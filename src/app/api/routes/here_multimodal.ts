"use server";

import { decode } from "@here/flexpolyline";
import * as turf from "@turf/turf";
import { uniqueId } from "lodash";

export type HereMultimodalRouteSectionType =
  | "pedestrian"
  | "transit"
  | "vehicle"
  | "rented"
  | "taxi";

export type HereMultimodalRouteSectionTransportMode =
  | "highSpeedTrain"
  | "intercityTrain"
  | "interRegionalTrain"
  | "regionalTrain"
  | "cityTrain"
  | "bus"
  | "busRapid"
  | "ferry"
  | "subway"
  | "lightRail"
  | "privateBus"
  | "inclined"
  | "aerialBus"
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
  : never;

export type HereMultimodalRoutePlace = {
  id?: string;
  name?: string;
  type:
    | "place"
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

export type HereMultimodalRouteSection = {
  id: string;
  type: HereMultimodalRouteSectionType;
  departure: {
    time: string;
    place: HereMultimodalRoutePlace;
  };
  arrival: {
    time: string;
    place: HereMultimodalRoutePlace;
  };
  polyline: string;
  transport: HereMultimodalRouteSectionTransport<HereMultimodalRouteSectionType>;
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

export type HereMultimodalRouteModality = "transit" | "pedestrian" | "car";

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

export const serverCalculateMultimodalRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  modality: HereMultimodalRouteModality = "transit",
  options: {
    alternatives?: number;
    time?: HereMultimodalRouteTimeObject;
  }
): Promise<HereMultimodalRouteRequestResult> => {
  const { alternatives = 2, time } = options;

  const herePlatformAppId = process.env.HERE_PLATFORM_APP_ID;
  const herePlatformApiKey = process.env.HERE_PLATFORM_API_KEY;

  if (!herePlatformAppId || !herePlatformApiKey) {
    throw new Error(
      "HERE_PLATFORM_APP_ID and HERE_PLATFORM_API_KEY must be set"
    );
  }

  // API Docs:
  // https://www.here.com/docs/bundle/intermodal-routing-api-v8-api-reference/page/index.html

  const url = new URL(`https://intermodal.router.hereapi.com/v8/routes`);
  url.searchParams.set("apiKey", herePlatformApiKey!);
  url.searchParams.set("return", "polyline");
  // Disable taxis and rented vehicles for now
  url.searchParams.set("taxi[enable]", "");
  url.searchParams.set("rented[enable]", "");
  url.searchParams.set("origin", `${start.lat},${start.lng}`);
  url.searchParams.set("destination", `${end.lat},${end.lng}`);
  url.searchParams.set("alternatives", alternatives.toString());

  // TODO: Replace car and pedestrian routing with the general HERE routing api (higher usage limits)

  if (modality === "pedestrian") {
    // Disable transit, walking directions only.
    // Won't work for long routes.
    url.searchParams.set("transit[enable]", "");
  } else if (modality === "car") {
    // Disable transit, car directions only.
    url.searchParams.set("transit[enable]", "");
    url.searchParams.set("vehicle[enable]", "entireRoute");
    url.searchParams.set("vehicle[modes]", "car");
  } else {
    // url.searchParams.set("transit[modes]", "-bus,-busRapid");
  }

  if (time && time.type === "depart") {
    url.searchParams.set("departureTime", time.date);
  } else if (time && time.type === "arrive") {
    url.searchParams.set("arrivalTime", time.date);
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.routes.length === 0) {
    // throw new Error(data.notices[0]?.message ?? "No routes found");
    // Doesn't really need to be an error, just return an empty array
    return {
      routes: [],
      key: uniqueId(),
      time: time,
    };
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

  return {
    routes: routes,
    key: uniqueId(),
    time: time,
  };
};
