'use client'

import { HereMultimodalRouteSection } from "@/app/api/routes/here_multimodal"
import { MapFeatureWithLayerSpec } from "@/components/global_map"
import RoutePlanningSectionChip from "@/components/route_planning_section_chip"
import { decode } from "@here/flexpolyline"
import { herePlatformRouteGetStyleForSection } from "../here_maps/route_styles"

import * as turf from "@turf/turf";

export const hereMultimodalRouteSectionsToFeatures = (routeId: string, sections: HereMultimodalRouteSection[], includeMarkers: boolean = true, styleData?: PrismaJson.RouteStyleType): MapFeatureWithLayerSpec[] => {
  return sections.map((section) => {
    const id = routeId + "-" + section.id;



    const polyline = decode(section.polyline).polyline.map((coord) => [
      coord[1],
      coord[0],
    ])

    // if (section.type === 'pedestrian') {
    //   const line = turf.lineString(polyline);
    //   const length = turf.length(line, { units: 'meters' });
    //   if (length < 400) return null; // Skip very short pedestrian sections
    // }

    const styleSpec = herePlatformRouteGetStyleForSection(section, styleData);

    const feature: MapFeatureWithLayerSpec = {
      id,
      feature: {
        id,
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: polyline
        },
        properties: {}
      },
      layer: {
        ...styleSpec as any,
        id,
        source: id,
        type: "line",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        }
      },
    };

    if (section.type === "transit" && includeMarkers) {
      const line = turf.lineString(polyline);
      const length = turf.length(line, { units: 'meters' });
      const center = turf.along(line, length / 2, { units: 'meters' });

      feature.marker = {
        coordinate: {
          lat: center.geometry.coordinates[1],
          lng: center.geometry.coordinates[0],
        },
        element: (
          <RoutePlanningSectionChip section={section} styleData={styleData} />
        )
      }
    }

    return feature;
  }).filter(f => f !== null) as MapFeatureWithLayerSpec[];
}