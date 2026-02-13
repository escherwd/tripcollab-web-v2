"use server";

import {
  appleMapsGenerateAnalyticsBody,
  appleMapsGenerateClientTimeInfo,
  AppleMapsPlaceResult,
} from "./apple_maps";
import { searchAppleMaps } from "./search";

export type AppleMapsPlace = AppleMapsPlaceResult & {
    textBlock?: {
        title: string;
        text: string;
        attributionUrl: string;
    },
    // timezone?: {
    //     name: string;
    //     offset: string;
    // },
    containmentPlace?: {
        text: string;
        muid: string;
    },
}

const getPlaceAppleMaps = async (muid: string, loc: {
    lng: number;
    lat: number;
    deltaLng: number;
    deltaLat: number;
}) => {
  if (muid.startsWith("mapbox-feature-needs-muid:")) {
    // Search for the place using the query
    const query = muid.split(":")[1]

    const results = await searchAppleMaps(query, loc);

    if (results.results.length === 0) {
      return null;
    }

    muid = results.results[0].muid;

    console.log(results.results[0], "from search for query", query);
  } else if (muid.startsWith("mapbox-feature-needs-address")) {
    // Reverse geocode to get the address
    const coords = muid.split(":")[1]

    // Searching coordinates will bring up the place with the closest address
    const results = await searchAppleMaps(coords, loc);

    if (results.results.length === 0) {
      return null;
    }

    const result = results.results[0];

    // There won't be text block or containment data, so we can just return the result
    return { ...<AppleMapsPlace>result, name: result.address ?? "Dropped Pin" };
  }

  const body = {
    places: [
      {
        muid: muid,
      },
    ],
    fetchAllComponents: true,
    dcc: "US",
    clientTimeInfo: appleMapsGenerateClientTimeInfo(),
    analyticMetadata: appleMapsGenerateAnalyticsBody(),
  };

  console.log(body);

  const response = await fetch(`https://maps.apple.com/data/place`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  
  if (!data.places || data.places.length === 0) {
    return null;
  }

  const result = data.places[0];

  const photos = [];

  const photoCategories = result.components.categorizedPhotos?.values;
  if ((photoCategories?.length ?? 0) > 0) {
    for (const category of photoCategories) {
      photos.push(...category.photos.map((photo: Record<string, any>) => ({
        id: photo.photo.photoId,
        url: photo.photo.photoVersions[0]?.url,
        width: photo.photo.photoVersions[0]?.width,
        height: photo.photo.photoVersions[0]?.height,
        category: category.categoryNames[0],
      })).filter((photo: Record<string, any>) => photo.url));
    }
  }

  return <AppleMapsPlace>{
    rawResult: result,
    name: result.components.entity.values[0].name,
    address: result.components.addressObject?.values[0].shortAddress,
    coordinate: result.components.locationInfo.values[0].center,
    muid: muid,
    categoryId: result.components.entity.values[0].mapsCategoryId,
    categoryName: result.components.entity.values[0].categories[0],
    rating: result.components.placeRating ? {
        source: result.components.placeRating.attribution.displayName,
        score: result.components.placeRating.values[0].score / result.components.placeRating.values[0].maxScore,
    } : null,
    photos: photos.length > 0 ? photos : null,
    textBlock: result.components.textBlock?.values[0] ? {
        title: result.components.textBlock?.values[0].title,
        text: result.components.textBlock?.values[0].text,
        attributionUrl: result.components.textBlock.values[0].attributionUrl,
    } : null,
    timeZone: result.components.locationInfo?.values[0].timezone,
    // timezone: result.components.locationInfo?.values[0] ? {
    //     name: result.components.locationInfo?.values[0].timezone,
    //     offset: result.components.locationInfo?.values[0].timezoneOffset,
    // } : null,
    containmentPlace: result.components.containmentPlace?.values[0] ? {
        text: result.components.containmentPlace?.values[0].containmentLine?.formatString[0]?.replaceAll("{s:s}", "").replaceAll("{/s:s}", ""),
        muid: result.components.containmentPlace?.values[0].containerId?.muid,
    } : null,
}
};

export { getPlaceAppleMaps };
