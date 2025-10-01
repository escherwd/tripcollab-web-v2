"use server";

import { appleMapsGenerateAnalyticsBody, appleMapsGenerateClientTimeInfo, AppleMapsPlaceResult } from "./apple_maps";

export type AppleMapsSearchResult = {
    query: string,
    displayMapRegion?: {
        southLat: number;
        westLng: number;
        northLat: number;
        eastLng: number;
    },
    results: AppleMapsPlaceResult[]
}

export async function searchAppleMaps(
  query: string,
  loc: { lng: number; lat: number; deltaLng: number; deltaLat: number }
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
    analyticMetadata: appleMapsGenerateAnalyticsBody()
  };


  const response = await fetch(`https://maps.apple.com/data/search`,{
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json',
    }
  })

  const data = await response.json();

  if (!data.globalResult) {
    return {
      query: query,
      displayMapRegion: undefined,
      results: [],
    };
  }

  return {
    query: query,
    displayMapRegion: data.globalResult.searchResult.displayMapRegion,
    results: data.dataModels.filter((result: Record<string, any>) => result.components).map((result: Record<string, any>) => (<AppleMapsPlaceResult>{
        name: result.components.entity.values[0].name,
        address: result.components.addressObject?.values[0].shortAddress,
        coordinate: result.components.locationInfo.values[0].center,
        muid: result._persistentData.muid,
        categoryId: result.components.entity.values[0].mapsCategoryId,
        categoryName: result.components.entity.values[0].categories[0],
        rating: result.components.placeRating ? {
            source: result.components.placeRating.attribution.displayName,
            score: result.components.placeRating.values[0].score / result.components.placeRating.values[0].maxScore,
        } : null,
        photos: result.components.searchResultPlacePhoto?.values.map((photo: Record<string, any>) => ({
            id: photo.photo.photoId,
            url: photo.photo.photoVersions[0]?.url,
            width: photo.photo.photoVersions[0]?.width,
            height: photo.photo.photoVersions[0]?.height,
        })).filter((photo: Record<string, any>) => photo.url),
    }))
  };
}
