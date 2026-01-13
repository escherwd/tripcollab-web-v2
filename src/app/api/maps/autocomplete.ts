"use server";

import { randomUUID } from "crypto";
import {
  appleMapsGenerateAnalyticsBody,
  appleMapsGenerateClientTimeInfo,
  AppleMapsPlaceResult,
} from "./apple_maps";
import { MapPin } from "@/components/global_map";
import { SEARCH_LOCAL_RESULTS_MAX } from "@/app/utils/consts";

export type AppleMapsAutocompleteResponse = {
  query: string;
  timestamp?: number;
  results: {
    muid: string;
    highlight: string;
    extra?: string;
    type: "QUERY" | "ADDRESS" | "BUSINESS";
    localProjectId?: string;
    place?: AppleMapsPlaceResult;
  }[];
};

export async function autocompleteAppleMaps(
  query: string,
  loc: { lng: number; lat: number; deltaLng: number; deltaLat: number },
  routePlanningPreviousLocation?: { lng: number; lat: number },
  includeProjectPins?: {
    id: string;
    appleMapsMuid?: string;
    name: string;
  }[]
): Promise<AppleMapsAutocompleteResponse> {

  // Generate project pin results
  const projectPinsGenerator = () => {
    return includeProjectPins
      ?.filter((pin) => pin.name.toLowerCase().includes(query.toLowerCase()))
      .map(
        (pin) =>
          <AppleMapsAutocompleteResponse["results"][number]>{
            muid: pin.appleMapsMuid ?? `fake-muid-${pin.id}`,
            highlight: pin.name,
            type: "BUSINESS",
            localProjectId: pin.id,
          }
      ).toSorted((a) => {
        return a.highlight.toLowerCase().startsWith(query) ? -1 : 1;
      }).slice(0, SEARCH_LOCAL_RESULTS_MAX);
  };

  if (query.trim().length < 3) {
    // Only return project pins if the query is too short
    return {
      query: query,
      results: projectPinsGenerator() ?? [],
    }
  }

  const body = {
    latlong: { lat: loc.lat, lng: loc.lng },
    span: {
      latitudeDelta: loc.deltaLat,
      longitudeDelta: loc.deltaLng,
    },
    dcc: "US",
    q: query,
    clientTimeInfo: appleMapsGenerateClientTimeInfo(),
    analyticMetadata: appleMapsGenerateAnalyticsBody(),
    routePlanningParameters: routePlanningPreviousLocation
      ? {
          fromRoutePlanning: true,
          previousLocation: routePlanningPreviousLocation,
        }
      : undefined,
  };

  const response = await fetch(
    "https://maps.apple.com/data/search-autocomplete",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  const includedResults = projectPinsGenerator() ?? [];

  return {
    query: query,
    results: includedResults.concat(
      (data.globalResult.autocompleteResult.sections?.[2]?.entries ?? [])
        .filter((result: Record<string, any>) => {
          // Filter out results that are already in the project pins
          const muid: string | undefined =
            result.business?.muid ??
            result.address?.mapsId?.shardedId?.muid ??
            result.address?.opaqueGeoId;
          if (includeProjectPins?.map((p) => p.appleMapsMuid).includes(muid)) {
            return false;
          }

          // Remove collections and "search nearby" results
          // There is probably a better way to do the second one
          return (
            ["QUERY", "ADDRESS", "BUSINESS"].includes(result.type) &&
            !result.highlightExtra?.line.includes("Search Nearby")
          );
        })
        .map((result: Record<string, any>) => {
          let muid = randomUUID();
          let place: AppleMapsPlaceResult | null = null;

          if (result.type === "BUSINESS") {
            muid = result.business.muid;

            const mapResult = data.mapsResult.find(
              (mapResult: Record<string, any>) => mapResult.place?.muid === muid
            );

            if (!mapResult) return null;

            const entity = mapResult.place.component.find(
              (component: Record<string, any>) =>
                component.type === "COMPONENT_TYPE_ENTITY"
            )?.value[0].entity;

            if (!entity) return null;

            const placeInfo = mapResult.place.component.find(
              (component: Record<string, any>) =>
                component.type === "COMPONENT_TYPE_PLACE_INFO"
            )?.value[0].placeInfo;

            if (!placeInfo) return null;

            const address = mapResult.place.component.find(
              (component: Record<string, any>) =>
                component.type === "COMPONENT_TYPE_ADDRESS_OBJECT"
            )?.value?.[0]?.addressObject;

            place = <AppleMapsPlaceResult>{
              name: entity.name[0].stringValue,
              address: address?.formattedAddressLines,
              coordinate: placeInfo.center,
              categoryId: entity.mapsCategoryId,
              muid: muid,
            };
          } else if (result.type === "ADDRESS") {
            place = <AppleMapsPlaceResult>{
              name: result.highlightMain.line,
              coordinate: result.address.center,
              categoryId: result.address.placeType?.toLowerCase(),
              muid:
                result.address?.mapsId?.shardedId?.muid ??
                result.address?.opaqueGeoId ??
                muid,
            };
          }

          return {
            muid: muid,
            highlight: result.highlightMain.line,
            extra: result.highlightExtra?.line,
            type: result.type,
            place: place,
          };
        }) ?? []
    ),
  };
}
