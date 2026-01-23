"use server";

import Database from "better-sqlite3";
import {
  HereMultimodalRoute,
  HereMultimodalRouteRequestOptions,
  HereMultimodalRouteSection,
} from "./here_multimodal";
import { encode } from "@here/flexpolyline";
import * as turf from "@turf/turf";
import { DateTime } from "luxon";
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
};

const greatCirclePointsBetween = (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  numPoints: number,
): number[][] => {
  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  // Convert to radians
  const φ1 = toRad(start.lat);
  const λ1 = toRad(start.lng);
  const φ2 = toRad(end.lat);
  const λ2 = toRad(end.lng);

  // Convert to 3D Cartesian coordinates (unit sphere)
  const x1 = Math.cos(φ1) * Math.cos(λ1);
  const y1 = Math.cos(φ1) * Math.sin(λ1);
  const z1 = Math.sin(φ1);

  const x2 = Math.cos(φ2) * Math.cos(λ2);
  const y2 = Math.cos(φ2) * Math.sin(λ2);
  const z2 = Math.sin(φ2);

  // Calculate angular distance
  const d = Math.acos(x1 * x2 + y1 * y2 + z1 * z2);

  const points = [];

  // Generate n intermediate points (including start and end)
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints; // fraction along path (0 to 1)

    // Slerp (Spherical Linear Interpolation)
    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);

    const x = a * x1 + b * x2;
    const y = a * y1 + b * y2;
    const z = a * z1 + b * z2;

    // Convert back to lat/lon
    const lat = toDeg(Math.asin(z));
    const lon = toDeg(Math.atan2(y, x));

    points.push([lat, lon]);
  }

  return points;
};

const closestAirport = async (
  lat: number,
  lng: number,
  db: Database.Database,
): Promise<TcFlightsAirport | null> => {
  const stmt = db.prepare(
    "SELECT id, name, city, country, iata, type, lat, long AS lng, weight, SQRT( POW(69.1 * (lat - ?) , 2) + POW(69.1 * (? - long) * COS(lat / 57.3) , 2)) AS distance FROM airports WHERE type = 'airport' AND iata IS NOT NULL ORDER BY distance ASC LIMIT 5;",
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

  // Set the departure and arrival based on this guessed duration
  let departureDate = DateTime.fromISO(
    options.time?.date ?? new Date().toISOString(),
  ).toISO();
  let arrivalDate = DateTime.fromISO(
    options.time?.date ?? new Date().toISOString(),
  )
    .plus({ minutes: durationMinutes })
    .toISO();

  console.log(`time type: ${options.time?.type}`);

  // If desired time is for arrival, swap these around
  if (options.time?.type == "arrive") {
    arrivalDate = DateTime.fromISO(
      options.time?.date ?? new Date().toISOString(),
    ).toISO();
    departureDate = DateTime.fromISO(
      options.time?.date ?? new Date().toISOString(),
    )
      .minus({ minutes: durationMinutes })
      .toISO();
  }

  if (!arrivalDate || !departureDate) {
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
        departure: createArrivalOrDepartureFor(startAirport, departureDate),
        arrival: createArrivalOrDepartureFor(startAirport, departureDate),
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
        departure: createArrivalOrDepartureFor(startAirport, departureDate),
        arrival: createArrivalOrDepartureFor(endAirport, arrivalDate),
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
        departure: createArrivalOrDepartureFor(endAirport, arrivalDate),
        arrival: createArrivalOrDepartureFor(endAirport, arrivalDate),
        transport: {
          mode: "idle",
          event: "arrival",
          ...endAirport,
        },
      },
    ],
    departureTime: departureDate,
    duration: durationMinutes,
    totalDistance: distance * 1000, // in meters
  };

  return route;
};
