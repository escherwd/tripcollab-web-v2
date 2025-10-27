"use server";

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
};

export type HereMultimodalRouteModality = "transit" | "pedestrian" | "car"

export const serverCalculateMultimodalRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  modality: HereMultimodalRouteModality = "transit",
  alternatives: number = 2,
): Promise<HereMultimodalRoute[]> => {

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
  url.searchParams.set("taxi[enable]", '');
  url.searchParams.set("rented[enable]", '');
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

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.routes.length === 0) {
    // throw new Error(data.notices[0]?.message ?? "No routes found");
    // Doesn't really need to be an error, just return an empty array
    return [];
  }

  // At some point we should probably cast these manually, but for now we'll just return the object as it is
  // These objects are remarkably clean as it is
  return (data.routes as HereMultimodalRoute[]).map((route) => {
    // Route transformations can happen here
    route.sections = route.sections.map((section) => {
      // Section transformations can happen here
      return section;
    })
    route.modality = modality;
    return route;
  });
};
