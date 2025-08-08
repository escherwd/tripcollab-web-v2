import { randomUUID } from "crypto";
import moment from "moment";

export type AppleMapsPlaceResult = {
    name: string;
    address?: string[];
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
    }[]
}

export const appleMapsGenerateClientTimeInfo = () => {
  return {
    clientRequestTime: moment().diff(moment("2001-01-01"), "seconds"),
    clientTimezoneOffset: 0 - moment().utcOffset() / 60,
    clientHourOfDay: moment().hour(),
    clientDayOfWeek: moment().day(),
  };
};

export const appleMapsGenerateAnalyticsBody = () => {
  return {
    appIdentifier: "com.apple.MapsWeb",
    appMajorVersion: "1",
    appMinorVersion: "1.4.159",
    isInternalInstall: false,
    isFromAPI: false,
    requestTime: {
      timeRoundedToHour: moment().diff(moment("2001-01-01"), "seconds"),
      timezoneOffsetFromGmtInHours: 0 - moment().utcOffset() / 60,
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
