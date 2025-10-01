import { randomUUID } from "crypto";
import { DateTime } from "luxon";

export type AppleMapsPlaceResult = {
    name: string;
    address?: string;
    coordinate: {
        lat: number;
        lng: number;
    }
    muid: string;
    categoryId?: string;
    categoryName?: string;
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
    }[]
}

export const appleMapsGenerateClientTimeInfo = () => {

  const now = DateTime.now();

  const info = {
    clientRequestTime: Math.floor(now.diff(DateTime.fromISO("2001-01-01"), "seconds").seconds),
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
      timeRoundedToHour: Math.floor(now.diff(DateTime.fromISO("2001-01-01"), "seconds").seconds),
      timezoneOffsetFromGmtInHours: 0 - now.offset / 60,
    },
    serviceTag: {
        // Some requests like autocomplete will be rejected if the service tag is not present.
        tag: randomUUID()
    },
    hardwareModel: "Macintosh",
    osVersion: "Mac OS X 10_15_7",
    productName: "Macintosh",
  };
};
