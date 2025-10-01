import { AppleMapsPlace } from "@/app/api/maps/place";
import { MapMarker } from "@/components/global_map";
import { Prisma } from "@prisma/client";

export function projectPinToMarker(
  pin: Prisma.PinGetPayload<any>
): MapMarker<AppleMapsPlace> {
  return {
    id: pin.id,
    ephemeralId: pin.id,
    coordinate: {
      lat: pin.latitude,
      lng: pin.longitude,
    },
    appleMapsPlace: {
      name: pin.name,
      coordinate: {
        lat: pin.latitude,
        lng: pin.longitude,
      },
      muid: pin.appleMapsMuid ?? "mapbox-feature",
      photos: (pin.extendedMetadata as any)["images"],
      textBlock: (pin.extendedMetadata as any)["text"],
      address: (pin.extendedMetadata as any)["address"],
    },
    mapboxFeatureId: pin.mapboxFeatureId ?? undefined,
  };
}
