import { HereMultimodalRouteSection, HereMultimodalRouteSectionTransport } from "@/app/api/routes/here_multimodal";
import { herePlatformDefaultSectionColors } from "@/app/utils/here_maps/route_styles";
import { MdDirectionsBike, MdDirectionsBoat, MdDirectionsBus, MdDirectionsCar, MdDirectionsRailway, MdDirectionsSubway, MdDirectionsTransit, MdDirectionsTransitFilled, MdDirectionsWalk, MdFlight } from "react-icons/md";

export function RoutePlanningTransitTransportModeIcon({ mode }: { mode: string }) {
    return <>
        {
            mode === "ferry" ? <MdDirectionsBoat title="Ferry Section" /> :
                mode === "subway" ? <MdDirectionsSubway title="Subway Section" /> :
                    mode === "cityTrain" ? <MdDirectionsTransit title="Train Section" /> :
                        mode === 'highSpeedTrain' ? <MdDirectionsRailway title="High Speed Train Section" /> :
                            mode === 'interRegionalTrain' ? <MdDirectionsRailway title="Inter Regional Train Section" /> :
                                mode === 'regionalTrain' ? <MdDirectionsRailway title="Regional Train Section" /> :
                                    mode === 'intercityTrain' ? <MdDirectionsRailway title="Intercity Train Section" /> :
                                        mode === 'monorail' ? <MdDirectionsTransitFilled title="Monorail Section" /> :
                                            mode === 'lightRail' ? <MdDirectionsTransit title="Light Rail Section" /> :
                                                mode === 'aerialBus' ? <MdDirectionsBus title="Aerial Bus Section" /> :
                                                    mode === 'bus' ? <MdDirectionsBus title="Bus Section" /> :
                                                        mode === 'busRapid' ? <MdDirectionsBus title="Bus Rapid Section" /> :
                                                            mode === 'privateBus' ? <MdDirectionsBus title="Private Bus Section" /> :
                                                                mode === 'rapid' ? <MdDirectionsTransit title="Rapid Transit Section" /> :
                                                                    mode === 'inclined' ? <MdDirectionsTransit title="Inclined Transit Section" /> :
                                                                        mode === 'flight' ? <MdFlight title="Flight Section" /> :
                                                                            <MdDirectionsTransit title="Transit Section" />
        }
    </>
}

export default function RoutePlanningSectionChip({ section }: { section: HereMultimodalRouteSection }) {

    if (section.type === "pedestrian") {
        return (
            <div>
                <MdDirectionsWalk size={18} title="Walking Section" />
            </div>

        )
    }

    if (section.type === "transit") {
        const transport = section.transport as HereMultimodalRouteSectionTransport<"transit">;
        return (
            <div className="flex gap-1.5 items-center text-xs font-bold px-2 py-1 rounded-md" style={{ backgroundColor: `${transport.color ?? herePlatformDefaultSectionColors.transit}`, color: `${transport.textColor ?? "#fff"}` }}>
                {
                    <RoutePlanningTransitTransportModeIcon mode={transport.mode} />
                }
                <div className="" >
                    {transport.shortName ?? transport.name}
                </div>
            </div>
        )
    }

    if (section.type === "rented") {
        if (section.transport.mode === "bicycle") {
            return (
                <div>
                    <MdDirectionsBike size={18} title="Rented Bicycle Section" />
                </div>
            )
        }
    }

    if (section.type === "vehicle") {
        return (
            <div>
                <MdDirectionsCar size={18} title="Vehicle Route" />
            </div>
        )
    }

}


