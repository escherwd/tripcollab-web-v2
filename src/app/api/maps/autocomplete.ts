"use server";

import { randomUUID } from "crypto";
import {
  appleMapsGenerateAnalyticsBody,
  appleMapsGenerateClientTimeInfo,
  AppleMapsPlaceResult,
} from "./apple_maps";

export type AppleMapsAutocompleteResponse = {
  query: string;
  timestamp?: number;
  results: {
    muid: string;
    highlight: string;
    extra?: string;
    type: "QUERY" | "ADDRESS" | "BUSINESS";
    place?: AppleMapsPlaceResult;
  }[];
};

export async function autocompleteAppleMaps(
  query: string,
  loc: { lng: number; lat: number; deltaLng: number; deltaLat: number }
): Promise<AppleMapsAutocompleteResponse> {
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

  return {
    query: query,
    results:
      (data.globalResult.autocompleteResult.sections?.[2]?.entries ?? [])
        .filter((result: Record<string, any>) => {
          // Remove collections and "search nearby" results
          // There is probably a better way to do the second one
          return (
            ["QUERY", "ADDRESS", "BUSINESS"].includes(result.type) &&
            !result.highlightExtra?.line.includes("Search Nearby")
          );
        })
        .map((result: Record<string, any>) => {
          let muid = randomUUID();

          if (result.type === "BUSINESS") {
            muid = result.business.muid;
          }

          return {
            muid: muid,
            highlight: result.highlightMain.line,
            extra: result.highlightExtra?.line,
            type: result.type,
            place:
              result.type === "BUSINESS"
                ? (() => {
                    const mapResult = data.mapsResult.find(
                      (mapResult: Record<string, any>) =>
                        mapResult.place?.muid === muid
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


                    return <AppleMapsPlaceResult>{
                      name: entity.name[0].stringValue,
                      address: address?.formattedAddressLines,
                      coordinate: placeInfo.center,
                      categoryId: entity.mapsCategoryId,
                      muid: muid,
                    };
                  })()
                : null,
          };
        }) ?? [],
  };
}
