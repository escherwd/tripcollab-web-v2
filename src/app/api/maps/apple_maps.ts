import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { AppleMapsPlace } from "./place";

export type AppleMapsPlaceResult = {
  name: string;
  address?: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  muid: string;
  categoryId?: string;
  categoryName?: string;
  timeZone?: string;
  rating?: {
    score: number;
    source: string;
  };
  photos?: {
    id: string;
    url: string;
    width: number;
    height: number;
    category?: string;
  }[];
};

export const appleMapsGenerateClientTimeInfo = () => {
  const now = DateTime.now();

  const info = {
    clientRequestTime: Math.floor(
      now.diff(DateTime.fromISO("2001-01-01"), "seconds").seconds,
    ),
    clientTimezoneOffset: 0 - now.offset / 60,
    clientHourOfDay: now.hour,
    clientDayOfWeek: now.weekday,
  };
  console.log(info);
  return info;
};

export const appleMapsGenerateAnalyticsBody = () => {
  const now = DateTime.now();

  return {
    appIdentifier: "com.apple.MapsWeb",
    appMajorVersion: "1",
    appMinorVersion: "1.4.159",
    isInternalInstall: false,
    isFromAPI: false,
    requestTime: {
      timeRoundedToHour: Math.floor(
        now.diff(DateTime.fromISO("2001-01-01"), "seconds").seconds,
      ),
      timezoneOffsetFromGmtInHours: 0 - now.offset / 60,
    },
    serviceTag: {
      // Some requests like autocomplete will be rejected if the service tag is not present.
      tag: randomUUID(),
    },
    hardwareModel: "Macintosh",
    osVersion: "Mac OS X 10_15_7",
    productName: "Macintosh",
  };
};

export const appleMapsPlaceResultToFullyFormedAppleMapsPlace = (
  mapResult: any,
): AppleMapsPlace | null => {
  if (!mapResult?.component || !Array.isArray(mapResult?.component) || !mapResult.muid) {
    console.log(mapResult);
    return null;
  }

  // Reduce the mapResult into an object to fetch components by ID
  const components: {
    [key: string]: { first?: any; all?: any[]; item?: any };
  } = (mapResult?.component as any[]).reduce((acc, item) => {
    if (item.value?.[0])
      acc[item.type] = {
        first: item.value[0],
        all: item.value,
        item,
      };
    return acc;
  }, {});

  const result = <AppleMapsPlace>{
    muid: mapResult.muid,
    // COMPONENT_TYPE_ENTITY
    name: components["COMPONENT_TYPE_ENTITY"]?.first?.entity?.name?.[0]
      ?.stringValue,
    categoryId:
      components["COMPONENT_TYPE_ENTITY"]?.first?.entity?.mapsCategoryId,
    categoryName: components[
      "COMPONENT_TYPE_ENTITY"
    ]?.first?.entity?.localizedCategory?.toSorted(
      (a: any, b: any) => b.level - a.level,
    )[0].localizedName?.[0]?.stringValue,
    // COMPONENT_TYPE_ADDRESS_OBJECT
    address:
      components["COMPONENT_TYPE_ADDRESS_OBJECT"]?.first?.addressObject
        ?.shortAddress,
    // COMPONENT_TYPE_PLACE_INFO
    coordinate:
      components["COMPONENT_TYPE_PLACE_INFO"]?.first?.placeInfo?.center,
    timeZone:
      components["COMPONENT_TYPE_PLACE_INFO"]?.first?.placeInfo?.timezone
        ?.identifier,
    // COMPONENT_TYPE_RATING
    rating: components["COMPONENT_TYPE_RATING"]?.first
      ? {
          source: "-",
          score:
            components["COMPONENT_TYPE_RATING"]?.first?.rating?.score /
            components["COMPONENT_TYPE_RATING"]?.first?.rating?.maxScore,
        }
      : null,
    // COMPONENT_TYPE_SEARCH_RESULT_PLACE_PHOTO or COMPONENT_TYPE_CATEGORIZED_PHOTOS
    photos:
      components["COMPONENT_TYPE_SEARCH_RESULT_PLACE_PHOTO"]?.all
        ?.map((photo: Record<string, any>) => ({
          id: photo.searchResultPlacePhoto?.photo.photo.photoId,
          url: photo.searchResultPlacePhoto?.photo.photo.photoVersion[0]?.url,
          width:
            photo.searchResultPlacePhoto?.photo.photo.photoVersion[0]?.width,
          height:
            photo.searchResultPlacePhoto?.photo.photo.photoVersion[0]?.height,
        }))
        .filter((photo: Record<string, any>) => photo.url) ??
      components["COMPONENT_TYPE_CATEGORIZED_PHOTOS"]?.all
        ?.reduce((acc: any[], item: any) => {
          return [...acc, ...item?.categorizedPhotos.photo];
        }, [])
        ?.map((photo: any) => ({
          id: photo.photo.photoId,
          url: photo.photo.photoVersion?.[0]?.url,
          width: photo.photo.photoVersion?.[0]?.width,
          height: photo.photo.photoVersion?.[0]?.height,
        })),
    // COMPONENT_TYPE_TEXT_BLOCK
    textBlock: components["COMPONENT_TYPE_TEXT_BLOCK"]?.first?.textBlock,
    // COMPONENT_TYPE_CONTAINMENT_PLACE
    containmentPlace: components["COMPONENT_TYPE_CONTAINMENT_PLACE"]?.first
      ? {
          text: components[
            "COMPONENT_TYPE_CONTAINMENT_PLACE"
          ]?.first?.containmentLine?.formatString?.[0]
            ?.replaceAll("{s:s}", "")
            .replaceAll("{/s:s}", ""),
          muid: components["COMPONENT_TYPE_CONTAINMENT_PLACE"]?.first
            ?.containmentPlace?.containerId?.shardedId?.muid,
        }
      : undefined,
  };

  return result;
};
