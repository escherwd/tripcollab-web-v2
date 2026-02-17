"use server";

import { MapMarker } from "@/components/global_map";
import {
  appleMapsGenerateAnalyticsBody,
  appleMapsGenerateClientTimeInfo,
  AppleMapsPlaceResult,
} from "./apple_maps";
import { appleMapsReverseGeocode } from "./reverse_geocode";
import { searchAppleMaps } from "./search";

export type AppleMapsPlace = AppleMapsPlaceResult & {
  textBlock?: {
    title: string;
    text: string;
    attributionUrl: string;
  };
  // timezone?: {
  //     name: string;
  //     offset: string;
  // },
  containmentPlace?: {
    text: string;
    muid: string;
  };
};

const getPlaceAppleMaps = async (
  muid: string,
  loc: {
    lng: number;
    lat: number;
    // deltaLng?: number;
    // deltaLat?: number;
  },
  hints?: MapMarker['mapboxPlace'] & {
    shouldAttemptToFindContainingPlace?: boolean
  },
): Promise<AppleMapsPlace | null> => {
  if (muid.startsWith("mapbox-feature-needs-muid")) {
    // Search for the place using the query
    // const query = muid.split(":")[1];

    if (!hints) {
      throw "A place name is required for reverse lookup"
    }

    // 1 degree of latitude = ~111km
    // 1 degree of longitude = 111km (at equator), 0 at poles
    // (at equator) 50m in either direction from point
    const deltaLat = 50 * (1 / 111000);
    const deltaLng = 50 * (1 / 111000);

    const results = await searchAppleMaps(hints.name, {
      lat: loc.lat,
      lng: loc.lng,
      deltaLat,
      deltaLng,
    });

    if (results.results.length === 0) {
      return null;
    }

    const result = results.results?.[0];

    if (
      !result?.muid ||
      Math.abs(result.coordinate.lat - loc.lat) > 10000 * (1 / 111000) ||
      Math.abs(result.coordinate.lng - loc.lng) > 10000 * (1 / 111000)
    ) {
      // No found location or it is too far from input coordinate (~10km) to be considered an accurate match
      // Attempt to use pure reverse geocode to find containing place

      return await getPlaceAppleMaps("needs-reverse-geocode", loc, {
        ...hints,
        shouldAttemptToFindContainingPlace: true
      });
    }

    muid = result.muid;

  } else if (muid.startsWith("needs-reverse-geocode")) {
    // Reverse geo-code using Apple Maps for given coordinate
    const locationResult = await appleMapsReverseGeocode(loc);

    if (!locationResult) {
      return null;
    }

    console.log(locationResult.relatedPlaceAtAddress)

    if (
      !hints?.shouldAttemptToFindContainingPlace ||
      !locationResult.relatedPlaceAtAddress
    )
      return {
        muid: muid,
        name: hints?.name ?? "Dropped Pin",
        address: locationResult.address,
        coordinate: { lat: loc.lat, lng: loc.lng },
        timeZone: locationResult.timeZone,
        containmentPlace: locationResult?.containmentPlace,
      };

    muid = locationResult.relatedPlaceAtAddress.muid
  }

  const body = {
    places: [
      {
        muid,
      },
    ],
    fetchAllComponents: true,
    dcc: "US",
    clientTimeInfo: appleMapsGenerateClientTimeInfo(),
    analyticMetadata: appleMapsGenerateAnalyticsBody(),
  };


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
      photos.push(
        ...category.photos
          .map((photo: Record<string, any>) => ({
            id: photo.photo.photoId,
            url: photo.photo.photoVersions[0]?.url,
            width: photo.photo.photoVersions[0]?.width,
            height: photo.photo.photoVersions[0]?.height,
            category: category.categoryNames[0],
          }))
          .filter((photo: Record<string, any>) => photo.url),
      );
    }
  }

  return <AppleMapsPlace>{
    rawResult: result,
    name: result.components.entity.values[0].name,
    address: result.components.addressObject?.values[0].shortAddress,
    coordinate: { lat: loc.lat, lng: loc.lng }, //result.components.locationInfo.values[0].center,
    muid: muid,
    categoryId: result.components.entity.values[0].mapsCategoryId,
    categoryName: result.components.entity.values[0].categories[0],
    rating: result.components.placeRating
      ? {
          source: result.components.placeRating.attribution.displayName,
          score:
            result.components.placeRating.values[0].score /
            result.components.placeRating.values[0].maxScore,
        }
      : null,
    photos: photos.length > 0 ? photos : null,
    textBlock: result.components.textBlock?.values[0]
      ? {
          title: result.components.textBlock?.values[0].title,
          text: result.components.textBlock?.values[0].text,
          attributionUrl: result.components.textBlock.values[0].attributionUrl,
        }
      : null,
    timeZone: result.components.locationInfo?.values[0].timezone,
    // timezone: result.components.locationInfo?.values[0] ? {
    //     name: result.components.locationInfo?.values[0].timezone,
    //     offset: result.components.locationInfo?.values[0].timezoneOffset,
    // } : null,
    containmentPlace: result.components.containmentPlace?.values[0]
      ? {
          text: result.components.containmentPlace?.values[0].containmentLine?.formatString[0]
            ?.replaceAll("{s:s}", "")
            .replaceAll("{/s:s}", ""),
          muid: result.components.containmentPlace?.values[0].containerId?.muid,
        }
      : null,
  };
};

export { getPlaceAppleMaps };
