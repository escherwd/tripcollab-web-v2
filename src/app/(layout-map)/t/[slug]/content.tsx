'use client'

import { mapController, mapEmitter } from "@/components/global_map";
import { Prisma } from "@prisma/client";
import { EasingOptions } from "mapbox-gl";
import { useEffect, useState } from "react";
import Map from "react-map-gl/mapbox";

export default function ProjectPageContent({
    project
}: {
    project: Prisma.ProjectGetPayload<null>
}) {


    const [viewState, setViewState] = useState<EasingOptions & {center: [number, number]}>({
        center: [-122.4, 37.8],
        zoom: 10,
        bearing: 0,
        pitch: 0,
        duration: 1000,
    })

    useEffect(() => {
        mapController.flyTo(viewState)
    }, [viewState])

    return (
        <>
            <div className="fixed size-full pointer-events-none fade-in">

                <div className="absolute size-full">
                    
                </div>

            </div>
        </>
    );
}