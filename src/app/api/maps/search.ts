"use server";

import {
  appleMapsGenerateAnalyticsBody,
  appleMapsGenerateClientTimeInfo,
  AppleMapsPlaceResult,
  appleMapsPlaceResultToFullyFormedAppleMapsPlace,
} from "./apple_maps";

export type AppleMapsSearchResult = {
  query: string;
  displayMapRegion?: {
    southLat: number;
    westLng: number;
    northLat: number;
    eastLng: number;
  };
  results: AppleMapsPlaceResult[];
};

export async function searchAppleMaps(
  query: string,
  loc: { lng: number; lat: number; deltaLng: number; deltaLat: number },
): Promise<AppleMapsSearchResult> {
  // Create the request body
  // Search results are always relative to the viewport
  // Note: clientRequestTime uses Apple's epoch time (seconds since Jan 1, 2001)
  const body = {
    sll: { lat: loc.lat, lng: loc.lng },
    span: {
      latitudeDelta: loc.deltaLat,
      longitudeDelta: loc.deltaLng,
    },
    dcc: "US",
    q: query,
    clientTimeInfo: appleMapsGenerateClientTimeInfo(),
    analyticMetadata: appleMapsGenerateAnalyticsBody(),
  };

  const response = await fetch(`https://maps.apple.com/data/search`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!data.globalResult) {
    return {
      query: query,
      displayMapRegion: undefined,
      results: [],
    };
  }

  const results: AppleMapsPlaceResult[] = [];

  for (const mapResult of data.mapsResult ?? []) {
    const result = appleMapsPlaceResultToFullyFormedAppleMapsPlace(
      mapResult.place,
    );
    if (result) results.push(result);
  }

  return {
    query: query,
    displayMapRegion: data.globalResult.searchResult.displayMapRegion,
    results: results,
  };
}
