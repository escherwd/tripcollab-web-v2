"use server";

import {
  appleMapsGenerateAnalyticsBody,
  appleMapsGenerateClientTimeInfo,
  AppleMapsPlaceResult,
} from "./apple_maps";

type AppleMapsReverseGeocodeResult = {
  coordinate: {
    lat: number;
    lng: number;
  };
  timeZone: string;
  address?: string;
  containmentPlace?: {
    text: string;
    muid: string;
  };
};

export const appleMapsReverseGeocode = async (coordinate: {
  lat: number;
  lng: number;
}): Promise<AppleMapsReverseGeocodeResult | null> => {
  // Create the request body
  // Note: clientRequestTime uses Apple's epoch time (seconds since Jan 1, 2001)
  const body = {
    latlong: { lat: coordinate.lat, lng: coordinate.lng },
    dcc: "US",
    ull: null,
    clientTimeInfo: appleMapsGenerateClientTimeInfo(),
    analyticMetadata: appleMapsGenerateAnalyticsBody(),
  };

  const response = await fetch("https://maps.apple.com/data/rev-geo", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (
    data.status != "STATUS_SUCCESS" ||
    !data.mapsResult?.[0]?.place?.component
  )
    return null;

  const components = (data.mapsResult?.[0]?.place?.component as any[]).reduce(
    (acc, item) => {
      if (item.value?.[0]) acc[item.type] = item.value[0];
      return acc;
    },
    {},
  );

  return {
    coordinate: coordinate,
    address:
      components["COMPONENT_TYPE_ADDRESS_OBJECT"]?.addressObject?.shortAddress,
    containmentPlace: components["COMPONENT_TYPE_CONTAINMENT_PLACE"]
      ? {
          muid: components["COMPONENT_TYPE_CONTAINMENT_PLACE"].containmentPlace
            ?.containerId?.shardedId?.muid,
          text: components[
            "COMPONENT_TYPE_CONTAINMENT_PLACE"
          ].containmentPlace?.containmentLine?.formatString?.[0]
            ?.replaceAll("{s:s}", "")
            .replaceAll("{/s:s}", ""),
        }
      : undefined,
    timeZone:
      components["COMPONENT_TYPE_PLACE_INFO"]?.placeInfo?.timezone
        ?.identifier ?? "utc",
  };
};
