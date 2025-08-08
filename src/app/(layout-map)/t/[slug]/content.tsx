'use client'

import { mapController } from "@/components/global_map";
import GeneralSearchComponent from "@/components/search_general";
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
        center: [ 4.996, 52.26],
        zoom: 10,
        bearing: 0,
        pitch: 0,
        duration: 5000,
        padding: {
            top: 64,
        }
    })

    useEffect(() => {

        mapController.setPadding({
            top: 64,
            left: 318,
            right: 318,
            bottom: 0,
        })

        mapController.flyTo(viewState)


    }, [viewState])


    return (
        <>
            <div className="fixed size-full pointer-events-none [&>*]:pointer-events-auto fade-in">

                <GeneralSearchComponent />

            </div>
        </>
    );
}