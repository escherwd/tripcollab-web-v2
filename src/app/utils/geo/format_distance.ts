import { userLocaleSettings } from "@/app/(layout-map)/t/[slug]/content";

export const formatDistance = (meters: number): string => {

  if (userLocaleSettings.distance == 'miles') {
    const feet = meters * 3.28084
    if (feet < 1000) {
      return `${Math.round(feet)} ft`;
    }
    const miles = meters * 0.00062137121212121
    if (miles < 10) {
      return `${miles.toLocaleString([], { maximumFractionDigits: 1 })} mi`;
    }
    return `${miles.toLocaleString([], { maximumFractionDigits: 0 })} mi`
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  if (meters < 10000) {
    return `${(meters / 1000).toLocaleString([], { maximumFractionDigits: 1 })} km`;
  }

  return `${(meters / 1000).toLocaleString([], { maximumFractionDigits: 0 })} km`;
}