import { MapMarker } from "@/components/global_map";
import { randomBytes, randomUUID } from "crypto";
import { GeoJSONFeature, MapMouseEvent } from "mapbox-gl";
import { vectorPlaceSearchQuery } from "./vector_place_search_query";
import { mapboxPlaceClassToAppleType } from "./place_class_to_apple_type";

export const renderFeatureToMarker = (
  feature: GeoJSONFeature,
  e: MapMouseEvent,
) => {
  console.log(feature, e);

  const vectorTileFeature = (feature as any)["_vectorTileFeature"];
  const properties = vectorTileFeature?.properties;
  const coordinate = {
    lat: e.lngLat.lat,
    lng: e.lngLat.lng,
  };

  const isPoi = vectorTileFeature?.["type"] === 1;
  if (feature.geometry.type === "Point" && isPoi) {
    coordinate.lat = (feature as any).geometry.coordinates[1] ?? coordinate.lat;
    coordinate.lng = (feature as any).geometry.coordinates[0] ?? coordinate.lng;
  }
  const marker: MapMarker = {
    id: undefined,
    ephemeralId: feature.id?.toString() ?? randomBytes(8).toString("hex"),
    coordinate: coordinate,
    mapboxPlace: {
      name: properties?.name_en ?? feature.properties?.name,
      countryCode: properties?.iso_3166_1,
      category: properties?.category ?? properties?.type ?? properties?.class,
    },
    appleMapsPlace: {
      name: properties?.name_en ?? feature.properties?.name ?? "Dropped Pin",
      muid: isPoi
        ? "mapbox-feature-needs-muid:" + vectorPlaceSearchQuery(properties)
        : "needs-reverse-geocode:" + `${coordinate.lat},${coordinate.lng}`,
      coordinate: coordinate,
      categoryId: mapboxPlaceClassToAppleType(
        properties?.type ?? feature.properties?.class ?? "",
      ),
    },
    mapboxFeatureId: feature.id?.toString(),
  };

  return marker;
};
