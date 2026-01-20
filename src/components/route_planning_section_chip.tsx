import { HereMultimodalRouteSection, HereMultimodalRouteSectionTransport } from "@/app/api/routes/here_multimodal";
import { serverGetAgencyIconUrl } from "@/app/utils/here_maps/agency_icon";
import { herePlatformDefaultSectionColors } from "@/app/utils/here_maps/route_styles";
import { contrastingWhiteOrBlack } from "@/app/utils/ui/contrastingWhiteOrBlack";
import { useEffect, useState } from "react";
import { MdDirectionsBike, MdDirectionsBoat, MdDirectionsBus, MdDirectionsCar, MdDirectionsRailway, MdDirectionsSubway, MdDirectionsTransit, MdDirectionsTransitFilled, MdDirectionsWalk, MdFlight } from "react-icons/md";

export function RoutePlanningTransitTransportModeIcon({ mode, agency }: { mode: string, agency?: {
    id: string;
    name: string;
    website?: string;
} }) {

    const [agencyImage, setAgencyImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgencyImage = async () => {

             if (!agency?.name) return;

            // Check local storage first
            if (localStorage.getItem('agencyIcon-' + agency?.name)) {
                const cachedImage = localStorage.getItem('agencyIcon-' + agency?.name);

                if (cachedImage === 'null') return;

                setAgencyImage(cachedImage!);
                return;
            }

            // Fetch from server
            const serverImageUrl = await serverGetAgencyIconUrl(agency!.name);
            // Cache result in local storage, even if null
            localStorage.setItem('agencyIcon-' + agency!.name, serverImageUrl || 'null');
            if (!serverImageUrl) return;

            // Update state and cache in local storage
            setAgencyImage(serverImageUrl);
        };
        if (agency?.name) {
            fetchAgencyImage();
        }
    }, [mode, agency]);

    if (agencyImage) {
        return <img src={agencyImage} alt={agency?.name + " Logo"} title={agency?.name} className="h-full w-auto aspect-square object-contain" />
    }

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

export default function RoutePlanningSectionChip({ section, styleData }: { section: HereMultimodalRouteSection, styleData?: PrismaJson.RouteStyleType }) {

    if (section.type === "pedestrian") {
        return (
            <div>
                <MdDirectionsWalk size={18} title="Walking Section" />
            </div>
        )
    }

    if (section.type === "airport") {

        const airport = section.transport as HereMultimodalRouteSectionTransport<"airport">;

        return (
            <div className="flex gap-1.5 items-center text-xs font-bold px-2 py-1 rounded-lg shadow bg-linear-to-b from-white to-gray-100/10 text-gray-800">
                <div className="font-label font-medium" >
                    {airport.iata ?? airport.icao ?? airport.name}
                </div>
            </div>
        )
    }

    if (section.type === "transit") {
        const transport = section.transport as HereMultimodalRouteSectionTransport<"transit">;

        // let backgroundColor = transport.color ?? herePlatformDefaultSectionColors.transit;
        // let textColor = transport.textColor ?? "#fff";

        // if (styleData?.color) {
        //     backgroundColor = styleData.color;
        //     textColor = contrastingWhiteOrBlack(backgroundColor);
        // }

        return (
            <div style={{ ['--tw-gradient-to' as string]: `color-mix(in oklab,${transport.color ?? 'grey'}, 95% white)` }} className="flex gap-1.5 items-center text-xs font-bold px-2 py-1 rounded-lg shadow bg-linear-to-b from-white to-gray-100/10 text-gray-800">
                {
                    transport.color && (
                        <div className="h-3.5 w-1 flex items-center rounded-full" style={{ backgroundColor: transport.color }} />
                    )
                }
                {
                    <div className="h-3.75 flex items-center">
                        <RoutePlanningTransitTransportModeIcon mode={transport.mode} agency={section.agency} />
                    </div>
                }
                <div className="font-label font-medium" >
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

    if (section.type === "flight") {
        return (
            <div>
                <MdFlight size={18} title="Flight Section" />
            </div>
        )
    }

    if (section.type === "vehicle") {


        if (section.transport.mode === "bicycle") {
            return (
                <div>
                    <MdDirectionsBike size={18} title="Bicycle Route" />
                </div>
            )
        }

        return (
            <div>
                <MdDirectionsCar size={18} title="Vehicle Route" />
            </div>
        )
    }

}


