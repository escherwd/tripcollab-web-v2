import { HereMultimodalRouteSection, HereMultimodalRouteSectionTransport } from "@/app/api/routes/here_multimodal";
import { decode } from "@here/flexpolyline";
import { useMemo } from "react";
import { MdDirectionsCar, MdDirectionsTransit, MdDirectionsWalk, MdLabel, MdRoute, MdTransitEnterexit } from "react-icons/md";
import * as turf from "@turf/turf";
import { RoutePlanningTransitTransportModeIcon } from "./route_planning_section_chip";
import { herePlatformDefaultSectionColors } from "@/app/utils/here_maps/route_styles";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

export default function RoutePlanningStepRow({ section }: { section: HereMultimodalRouteSection }) {

    const distanceMeters = useMemo(() => {
        const polyline = decode(section.polyline).polyline.map((coord) => [
            coord[1],
            coord[0],
        ]);
        const line = turf.lineString(polyline);
        return turf.length(line, { units: 'meters' });
    }, [section]);

    const transport = section.transport as HereMultimodalRouteSectionTransport<"transit">;

    return (

        <div className="flex gap-3 items-center even:bg-gray-50 px-4 py-3">
            <div className="w-8 flex-none flex justify-center text-xl">
                {section.type === "pedestrian" && <MdDirectionsWalk className="text-gray-500" />}
                {section.type === "vehicle" && <MdDirectionsCar className="text-gray-500" />}
                {section.type === "transit" && <div className="text-gray-500 ">
                    <RoutePlanningTransitTransportModeIcon mode={(section.transport as any).mode} />
                </div>}
            </div>
            <div>
                {
                    section.type === "pedestrian" && (
                        <div className="">
                            Walk {Math.round(distanceMeters)} meters
                            {
                                section.arrival.place.name ? <> to <span className="font-semibold">{section.arrival.place.name}</span></> : ""
                            }
                        </div>
                    )
                }
                {
                    section.type === "transit" && (
                        <div className="flex flex-col gap-1 items-start justify-start">
                            <div className="text-xs text-gray-400">{transport.category?.split(', ')[0]} – <a target="_blank" className="hover:underline whitespace-nowrap" href={section.agency?.website ?? '#'}>{section.agency?.name}&nbsp;<ArrowUpRightIcon className="inline-block size-3.5 mb-px" /></a></div>
                            <div>
                                Line <span className="font-semibold">{transport.shortName ?? transport.name}</span>, signs for
                            </div>
                            <div className=" px-2 py-1 rounded-md text-sm font-semibold my-0.5" style={{ backgroundColor: `${transport.color ?? herePlatformDefaultSectionColors.transit}`, color: `${transport.textColor ?? "#fff"}` }}>
                                {
                                    transport.headsign ?? transport.name ?? transport.shortName
                                }
                            </div>
                            <div className="text-sm text-gray-600">
                                Exit at <span className="font-semibold">{section.arrival.place.name}</span>
                            </div>
                        </div>
                    )
                }
                {
                    section.type === "vehicle" && (
                        <div className="">
                            Drive {Math.round(distanceMeters / 1000)} kilometers
                        </div>
                    )
                }
            </div>
        </div>

    );
}