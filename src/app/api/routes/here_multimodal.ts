"use server";

import { decode } from "@here/flexpolyline";
import * as turf from "@turf/turf";
import { tcFlightRoute } from "./tc_flights";

export type HereMultimodalRouteSectionType =
  | "pedestrian"
  | "transit"
  | "vehicle"
  | "rented"
  | "flight"
  | "airport"
  | "taxi";

export type HereMultimodalRouteSectionTransportMode =
  | "highSpeedTrain"
  | "intercityTrain"
  | "interRegionalTrain"
  | "regionalTrain"
  | "cityTrain"
  | "bicycle"
  | "bus"
  | "busRapid"
  | "ferry"
  | "subway"
  | "lightRail"
  | "privateBus"
  | "inclined"
  | "aerialBus"
  | "idle"
  | "rapid"
  | "monorail"
  | "flight";

export type HereMultimodalRouteSectionTransport<
  T extends HereMultimodalRouteSectionType
> = T extends "transit"
  ? {
      mode: HereMultimodalRouteSectionTransportMode;
      name?: string;
      headsign?: string;
      category?: string; // Human readable category name like 'Bus' or 'Train'
      color?: string;
      textColor?: string;
      shortName?: string;
      longName?: string;
      url?: string;
    }
  : never | T extends "taxi" | "rented"
  ? {
      mode: "car" | "bicycle" | "kickScooter";
      name?: string;
      category?: string;
      color?: string;
      textColor?: string;
      model?: string;
      licensePlate?: string;
      seats?: number;
      engine?: "electric" | "combustion";
    }
  : never | T extends "pedestrian" | "vehicle"
  ? {
      mode: "pedestrian" | "car";
    }
  : never | T extends "airport" 
  ? {
    mode: "idle"
    name?: string;
    city?: string;
    country?: string;
    iata?: string;
    icao?: string;
    event: "arrival" | "departure" | "layover";
  }
  : never;

export type HereMultimodalRoutePlace = {
  id?: string;
  name?: string;
  type:
    | "place"
    | "airport"
    | "station"
    | "accessPoint"
    | "parkingLot"
    | "chargingStation"
    | "dockingStation";
  location: {
    lat: number;
    lng: number;
  };
  platform?: string;
  code?: string;
};

export type HereMultimodalRouteSection<T extends HereMultimodalRouteSectionType = HereMultimodalRouteSectionType> = {
  id: string;
  type: T;
  departure: {
    time: string;
    place: HereMultimodalRoutePlace;
  };
  arrival: {
    time: string;
    place: HereMultimodalRoutePlace;
  };
  polyline: string;
  transport: HereMultimodalRouteSectionTransport<T>;
  agency?: {
    id: string;
    name: string;
    website?: string;
  };
  notices?: {
    code: string;
  }[];
  spans?: {
    walkAttributes: string[];
  }[];
  attributions?: {
    id: string;
    href: string;
    text: string;
    type: string;
  }[];
  // Only available on non-intermodal v8 routes, i.e. car and pedestrian
  summary?: {
    duration: number; // in minutes
    length: number; // in meters
    typicalDuration?: number; // in minutes
  }
};

export type HereMultimodalRoute = {
  id: string;
  modality: HereMultimodalRouteModality;
  sections: HereMultimodalRouteSection[];
  /* Total distance in meters */
  totalDistance: number;
  /* Starting time ISO string */
  departureTime?: string;
  /* Duration in minutes */
  duration: number;
};

export type HereMultimodalRouteModality = "transit" | "pedestrian" | "car" | "flight" | "bicycle";

export type HereMultimodalRouteTimeObject = {
  type: "depart" | "arrive";
  date: string;
};

export type HereMultimodalRouteRequestResult = {
  routes: HereMultimodalRoute[];
  key: string;
  time?: {
    type: "depart" | "arrive";
    date: string;
  };
};

export type HereMultimodalRouteRequestOptions = {
  alternatives?: number;
  time?: HereMultimodalRouteTimeObject;
};

const hereIntermodalRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  modality: HereMultimodalRouteModality,
  options: HereMultimodalRouteRequestOptions = {},
  keys: { appId: string; apiKey: string }
): Promise<HereMultimodalRoute[]> => {

  const { alternatives = 2, time } = options;


  const url = new URL(`https://intermodal.router.hereapi.com/v8/routes`);
  url.searchParams.set("apiKey", keys.apiKey);
  url.searchParams.set("return", "polyline");
  // Disable taxis and rented vehicles for now
  url.searchParams.set("taxi[enable]", "");
  url.searchParams.set("rented[enable]", "");
  url.searchParams.set("origin", `${start.lat},${start.lng}`);
  url.searchParams.set("destination", `${end.lat},${end.lng}`);
  url.searchParams.set("alternatives", alternatives.toString());

  if (time && time.type === "depart") {
    url.searchParams.set("departureTime", time.date.split(".")[0]);
  } else if (time && time.type === "arrive") {
    url.searchParams.set("arrivalTime", time.date.split(".")[0]);
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  if (response.ok === false) {
    console.log(data)
    throw new Error(`HERE Intermodal Route API error: ${response.status} ${response.statusText}`);
  }

  if (data.routes.length === 0) {
    // throw new Error(data.notices[0]?.message ?? "No routes found");
    // Doesn't really need to be an error, just return an empty array
    return [];
  }

  // At some point we should probably cast these manually, but for now we'll just return the object as it is
  // These objects are remarkably clean as it is
  const routes = (data.routes as HereMultimodalRoute[]).map((route) => {
    // Route transformations can happen here
    route.sections = route.sections.map((section) => {
      // Section transformations can happen here
      return section;
    });
    route.modality = modality;
    // Calculate total distance
    route.totalDistance = route.sections.reduce((acc, section) => {
      const polyline = decode(section.polyline).polyline.map((coord) => [
        coord[1],
        coord[0],
      ]);
      const line = turf.lineString(polyline);
      return acc + turf.length(line, { units: "meters" });
    }, 0);
    // Set departure time
    route.departureTime = route.sections[0].departure.time;
    // Calculate duration in minutes
    const departure = new Date(route.sections[0].departure.time).getTime();
    const arrival = new Date(
      route.sections[route.sections.length - 1].arrival.time
    ).getTime();
    route.duration = Math.round((arrival - departure) / (1000 * 60));
    // Return fully-formed route
    return route;
  });

  return routes;

}


const hereRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  modality: HereMultimodalRouteModality,
  options: HereMultimodalRouteRequestOptions = {},
  keys: { appId: string; apiKey: string }
): Promise<HereMultimodalRoute[]> => {

  const { alternatives = 2, time } = options;


  const url = new URL(`https://router.hereapi.com/v8/routes`);
  url.searchParams.set("apiKey", keys.apiKey);
  url.searchParams.set("return", "summary,polyline,typicalDuration");
  // Disable taxis and rented vehicles for now
  url.searchParams.set("transportMode", modality);
  url.searchParams.set("origin", `${start.lat},${start.lng}`);
  url.searchParams.set("destination", `${end.lat},${end.lng}`);
  url.searchParams.set("alternatives", alternatives.toString());

  // Set time parameters, removing milliseconds for RFC3339 compatibility
  if (time && time.type === "depart") {
    url.searchParams.set("departureTime", time.date.split(".")[0]);
  } else if (time && time.type === "arrive") {
    url.searchParams.set("arrivalTime", time.date.split(".")[0]);
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  console.log("HERE Route API response:", data);

  if (data.routes.length === 0) {
    // throw new Error(data.notices[0]?.message ?? "No routes found");
    // Doesn't really need to be an error, just return an empty array
    return [];
  }

  // At some point we should probably cast these manually, but for now we'll just return the object as it is
  // These objects are remarkably clean as it is
  const routes = (data.routes as HereMultimodalRoute[]).map((route) => {
    // Route transformations can happen here
    route.sections = route.sections.map((section) => {
      // Section transformations can happen here
      return section;
    });
    route.modality = modality;
    // Calculate total distance
    route.totalDistance = route.sections.reduce((acc, section) => {
      return acc + (section.summary?.length ?? 0);
    }, 0);
    // Set departure time
    route.departureTime = route.sections[0].departure.time;
    // Calculate duration in minutes
    route.duration = route.sections.reduce((acc, section) => {
      const dep = new Date(section.departure.time).getTime();
      const arr = new Date(section.arrival.time).getTime();
      return acc + (section.summary?.typicalDuration ?? Math.round((arr - dep) / (1000)));
    }, 0) / 60;
    // Return fully-formed route
    return route;
  });

  return routes;

}

export const serverCalculateMultimodalRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  modality: HereMultimodalRouteModality = "transit",
  options: HereMultimodalRouteRequestOptions = {}
): Promise<HereMultimodalRouteRequestResult> => {
  const { alternatives = 2, time } = options;

  const herePlatformAppId = process.env.HERE_PLATFORM_APP_ID;
  const herePlatformApiKey = process.env.HERE_PLATFORM_API_KEY;

  if (!herePlatformAppId || !herePlatformApiKey) {
    throw new Error(
      "HERE_PLATFORM_APP_ID and HERE_PLATFORM_API_KEY must be set"
    );
  }

  // Create a unique key based on the parameters of the request
  // TODO: Use this for caching
  const requestKey = `${start.lat.toFixed(6)},${start.lng.toFixed(6)}-${end.lat.toFixed(6)},${end.lng.toFixed(6)}-${modality}-${alternatives}-${time ? `${time.type}-${time.date}` : "notime"}`;


  if (modality == "flight") {
    // Use the flight-specific route function
    const route = await tcFlightRoute(
      start,
      end,
      options,
    );
    return {
      routes: [route],
      key: requestKey,
      time: time,
    };
  }

  // Use the transit-specific route function
  if (modality == "transit") {
    // Use the intermodal route function
    const routes = await hereIntermodalRoute(
      start,
      end,
      modality,
      { alternatives, time },
      { appId: herePlatformAppId, apiKey: herePlatformApiKey }
    );
    return {
      routes: routes,
      key: requestKey,
      time: time,
    };
  }

  // Use the general route function for pedestrian and car
  const routes = await hereRoute(
    start,
    end,
    modality,
    { alternatives, time },
    { appId: herePlatformAppId, apiKey: herePlatformApiKey }
  );
  return {
    routes: routes,
    key: requestKey,
    time: time,
  };

  
};
