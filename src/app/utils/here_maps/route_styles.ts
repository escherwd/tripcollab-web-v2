'use client'

import { HereMultimodalRouteSection, HereMultimodalRouteSectionTransport } from "@/app/api/routes/here_multimodal"
import { LayerSpecification } from "mapbox-gl"
import { LineLayerSpecification } from "react-map-gl/mapbox-legacy"

export const herePlatformDefaultSectionColors = {
    transit: "#364153",
    car: "#364153",
    pedestrian: "#4b5563"
}

export const herePlatformRouteGetStyleForSection = (section: HereMultimodalRouteSection): Partial<LayerSpecification> => {


    const generalPaint: Partial<LayerSpecification>["paint"] = {
        "line-width": 6,
        "line-border-color": "#FBFBFB",
        "line-border-width": 1,
    }

    if (section.type === "transit") {
        return {
            "paint": {
                "line-color": (section.transport as HereMultimodalRouteSectionTransport<"transit">).color ?? herePlatformDefaultSectionColors.transit,
                ...generalPaint
            },
        }
    } else if (section.type === "vehicle" || section.type === "rented") {
        return {
            "paint": {
                "line-color": herePlatformDefaultSectionColors.car,
                ...generalPaint
            }
        }
    } else {
        return {
            "paint": {
                "line-color": herePlatformDefaultSectionColors.pedestrian,
                "line-dasharray": [1, 2],
                ...generalPaint
            }
        }
    }
}