"use server";

import Database from "better-sqlite3";
import {
  HereMultimodalRoute,
  HereMultimodalRouteRequestOptions,
  HereMultimodalRouteSection,
} from "./here_multimodal";
import { encode } from "@here/flexpolyline";
import * as turf from "@turf/turf";
import { DateTime, Zone } from "luxon";
import path from "path";
import process from "process";

export type TcFlightsAirport = {
  id: number;
  name: string;
  city: string;
  country: string;
  iata: string;
  type: string;
  lat: number;
  lng: number;
  distance: number;
  weight: number;
  tzName: string;
};

const closestAirport = async (
  lat: number,
  lng: number,
  db: Database.Database,
): Promise<TcFlightsAirport | null> => {
  const stmt = db.prepare(
    "SELECT id, name, city, country, iata, type, lat, long AS lng, weight, tz_name as tzName, SQRT( POW(69.1 * (lat - ?) , 2) + POW(69.1 * (? - long) * COS(lat / 57.3) , 2)) AS distance FROM airports WHERE type = 'airport' AND iata IS NOT NULL ORDER BY distance ASC LIMIT 5;",
  );
  const rows = stmt.all(lat, lng) as TcFlightsAirport[] | undefined;

  const row = rows?.sort((a, b) => b.weight - a.weight)[0];

  return row || null;
};

export const tcFlightRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  options: HereMultimodalRouteRequestOptions = {},
): Promise<HereMultimodalRoute> => {
  const dbFile = path.join(
    process.cwd(),
    "data",
    "flights",
    "airports-weighted.sqlite",
  );

  console.log("Using TC Flights database at:", dbFile);

  const db = new Database(dbFile, {
    readonly: true,
  });

  const startAirport = await closestAirport(start.lat, start.lng, db);
  const endAirport = await closestAirport(end.lat, end.lng, db);

  if (!startAirport || !endAirport) {
    throw new Error("Could not find nearby airports for flight route.");
  }

  db.close();

  const greatCircle = turf.greatCircle(
    [startAirport.lng, startAirport.lat],
    [endAirport.lng, endAirport.lat],
    { npoints: 64 },
  );

  const polyline = encode({
    polyline: greatCircle.geometry.coordinates.map(
      (coord) => [coord[1], coord[0]] as number[],
    ),
    precision: 3,
  });

  // Calculate distance between airports (approximate)
  const distance = turf.length(greatCircle, { units: "kilometers" });

  // Very loose duration calcuation: assume average speed of 800 km/h (on the lower side, would rather overestimate duration)
  let assumedAverageSpeedKph = 800;
  if (distance < 2000) {
    assumedAverageSpeedKph = 600;
  }
  let durationMinutes = Math.round((distance / assumedAverageSpeedKph) * 60);
  // Round to the nearest 15 minute increment
  durationMinutes += 15 - (durationMinutes % 15);

  console.log(options.time);

  // Set the departure and arrival based on this guessed duration
  let departureDate = DateTime.fromISO(
    options.time?.date ?? new Date().toISOString(),
    {
      zone: startAirport.tzName,
    },
  );
  let arrivalDate = DateTime.fromISO(
    options.time?.date ?? new Date().toISOString(),
    {
      zone: startAirport.tzName,
    },
  ).plus({ minutes: durationMinutes }).setZone(endAirport.tzName);

  // If desired time is for arrival, swap these around
  if (options.time?.type == "arrive") {
    arrivalDate = DateTime.fromISO(
      options.time?.date ?? new Date().toISOString(),
      {
        zone: endAirport.tzName,
      },
    );
    departureDate = DateTime.fromISO(
      options.time?.date ?? new Date().toISOString(),
      {
        zone: endAirport.tzName,
      },
    ).minus({ minutes: durationMinutes }).setZone(startAirport.tzName);
  }

  // Set the time zones
  // departureDate = departureDate.setZone(startAirport.tzName, {
  //   keepLocalTime: true,
  // });
  // arrivalDate = arrivalDate.setZone(endAirport.tzName, { keepLocalTime: true });

  if (
    !arrivalDate ||
    !departureDate ||
    !arrivalDate.toISO() ||
    !departureDate.toISO()
  ) {
    throw new Error(
      "Could not calculate arrival or departure date for flight route.",
    );
  }

  const createArrivalOrDepartureFor = (
    airport: TcFlightsAirport,
    atTime: string,
  ): HereMultimodalRouteSection["arrival" | "departure"] => {
    return {
      time: atTime,
      place: {
        id: airport.iata,
        code: airport.iata,
        location: {
          lat: airport.lat,
          lng: airport.lng,
        },
        type: "airport",
        name: airport.name,
      },
    };
  };

  // Articulate flight into a HereMultimodalRoute
  const route: HereMultimodalRoute = {
    id: `flight-${startAirport.iata}-${endAirport.iata}-${Date.now()}`,
    customName: `${startAirport.iata} to ${endAirport.iata}`,
    modality: "flight",
    sections: [
      // Section: idle time at departure airport
      {
        id: `flight-departure-airport-${startAirport.iata}`,
        type: "airport",
        polyline: encode({
          polyline: [[startAirport.lat, startAirport.lng]],
          precision: 3,
        }),
        departure: createArrivalOrDepartureFor(
          startAirport,
          departureDate.toISO()!,
        ),
        arrival: createArrivalOrDepartureFor(
          startAirport,
          departureDate.toISO()!,
        ),
        transport: {
          mode: "idle",
          event: "departure",
          ...startAirport,
        },
      },
      //   Section: flight
      {
        id: `flight-section-${startAirport.iata}-${
          endAirport.iata
        }-${Date.now()}`,
        type: "flight",
        polyline: polyline,
        departure: createArrivalOrDepartureFor(
          startAirport,
          departureDate.toISO()!,
        ),
        arrival: createArrivalOrDepartureFor(endAirport, arrivalDate.toISO()!),
        transport: {
          mode: "flight",
        },
        summary: {
          duration: durationMinutes,
          length: distance * 1000, // in meters
        },
      },
      // Section: idle time at arrival airport
      {
        id: `flight-arrival-airport-${endAirport.iata}`,
        type: "airport",
        polyline: encode({
          polyline: [[endAirport.lat, endAirport.lng]],
          precision: 3,
        }),
        departure: createArrivalOrDepartureFor(
          endAirport,
          arrivalDate.toISO()!,
        ),
        arrival: createArrivalOrDepartureFor(endAirport, arrivalDate.toISO()!),
        transport: {
          mode: "idle",
          event: "arrival",
          ...endAirport,
        },
      },
    ],
    departureTime: departureDate.toISO()!,
    duration: durationMinutes,
    totalDistance: distance * 1000, // in meters
    zones: {
      start: departureDate.zoneName ?? "utc",
      end: arrivalDate.zoneName ?? "utc",
    },
  };

  return route;
};
