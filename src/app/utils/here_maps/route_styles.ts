'use client'

import { HereMultimodalRouteSection, HereMultimodalRouteSectionTransport } from "@/app/api/routes/here_multimodal"
import Colorizr from "colorizr"
import { LayerSpecification } from "mapbox-gl"
import { LineLayerSpecification } from "react-map-gl/mapbox-legacy"

export const herePlatformDefaultSectionColors = {
    transit: "#364153",
    car: "#364153",
    pedestrian: "#4b5563"
}

export const herePlatformRouteGetStyleForSection = (section: HereMultimodalRouteSection, styleData?: PrismaJson.RouteStyleType): Partial<LayerSpecification> => {


    const generalPaint: Partial<LayerSpecification>["paint"] = {
        "line-width": 6,
        "line-border-color": "#FBFBFB",
        "line-border-width": 1,
        "line-color-transition": {
            duration: 300,
            delay: 0,
        },
        'line-opacity-transition': {
            duration: 300,
            delay: 0,
        },
        'line-width-transition': {
            duration: 250,
            delay: 0,
        },
    }

    let res = {};

    if (section.type === "transit") {
        res = {
            "paint": {
                "line-color": (section.transport as HereMultimodalRouteSectionTransport<"transit">).color ?? herePlatformDefaultSectionColors.transit,
                ...generalPaint
            },
        }
    } else if (section.type === "vehicle" || section.type === "rented") {
        res = {
            "paint": {
                "line-color": herePlatformDefaultSectionColors.car,
                ...generalPaint
            }
        }
    } else {
        res = {
            "paint": {
                "line-color": herePlatformDefaultSectionColors.pedestrian,
                "line-dasharray": [1, 1],
                ...generalPaint
            }
        }
    }

    if (styleData?.color) {
        const color = new Colorizr(styleData.color);
        (res as any).paint["line-color"] = color.hex;
    }

    return res;
}