import { randomUUID } from "crypto";
import { DateTime } from "luxon";

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
) => {
  const components = (mapResult?.component as any[]).reduce((acc, item) => {
    if (item.value?.[0]) acc[item.type] = item.value[0];
    return acc;
  }, {});

  const result = <AppleMapsPlaceResult>{
    name: components["COMPONENT_TYPE_ENTITY"]?.entity?.name?.[0]?.stringValue,
    address:
      components["COMPONENT_TYPE_ADDRESS_OBJECT"]?.addressObject?.shortAddress,
    coordinate: components["COMPONENT_TYPE_PLACE_INFO"]?.placeInfo?.center,
    muid: mapResult.muid,
    categoryId: components["COMPONENT_TYPE_ENTITY"]?.entity?.mapsCategoryId,
    categoryName: components[
      "COMPONENT_TYPE_ENTITY"
    ]?.entity?.localizedCategory?.toSorted(
      (a: any, b: any) => b.level - a.level,
    )[0].localizedName?.[0]?.stringValue,
    rating: components["COMPONENT_TYPE_RATING"]
      ? {
          source: "-",
          score:
            components["COMPONENT_TYPE_RATING"].rating?.score /
            components["COMPONENT_TYPE_RATING"].rating?.maxScore,
        }
      : null,
    photos: mapResult.component
      .find((c: any) => c.type == "COMPONENT_TYPE_SEARCH_RESULT_PLACE_PHOTO")
      ?.value?.map((photo: Record<string, any>) => ({
        id: photo.searchResultPlacePhoto?.photo.photo.photoId,
        url: photo.searchResultPlacePhoto?.photo.photo.photoVersion[0]?.url,
        width: photo.searchResultPlacePhoto?.photo.photo.photoVersion[0]?.width,
        height:
          photo.searchResultPlacePhoto?.photo.photo.photoVersion[0]?.height,
      }))
      .filter((photo: Record<string, any>) => photo.url) ?? 
      mapResult.component
      .find((c: any) => c.type == "COMPONENT_TYPE_CATEGORIZED_PHOTOS")?.value.reduce((acc:any[], item:any) => {
          return [...acc, ...(item?.categorizedPhotos.photo)]
      },[])?.map((photo: any) => ({
        id: photo.photo.photoId,
        url: photo.photo.photoVersion?.[0]?.url,
        width: photo.photo.photoVersion?.[0]?.width,
        height:
          photo.photo.photoVersion?.[0]?.height,
      })),
    timeZone:
      components["COMPONENT_TYPE_PLACE_INFO"].placeInfo?.timezone?.identifier,
  };

  return result;
};

