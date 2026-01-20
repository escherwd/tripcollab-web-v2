import {
  HereMultimodalRouteSection,
  HereMultimodalRouteSectionTransport,
} from "@/app/api/routes/here_multimodal";
import { decode } from "@here/flexpolyline";
import { useMemo } from "react";
import {
  MdAirlineStops,
  MdDirectionsBike,
  MdDirectionsCar,
  MdDirectionsTransit,
  MdDirectionsWalk,
  MdFlight,
  MdFlightClass,
  MdFlightLand,
  MdFlightTakeoff,
  MdLabel,
  MdRoute,
  MdTransitEnterexit,
} from "react-icons/md";
import * as turf from "@turf/turf";
import { RoutePlanningTransitTransportModeIcon } from "./route_planning_section_chip";
import { herePlatformDefaultSectionColors } from "@/app/utils/here_maps/route_styles";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { formatDistance } from "@/app/utils/geo/format_distance";

export default function RoutePlanningStepRow({
  section,
}: {
  section: HereMultimodalRouteSection;
}) {
  const distanceMeters = useMemo(() => {
    const polyline = decode(section.polyline).polyline.map((coord) => [
      coord[1],
      coord[0],
    ]);
    if (polyline.length < 2) return 0;
    const line = turf.lineString(polyline);
    return turf.length(line, { units: "meters" });
  }, [section]);

  const transport =
    section.transport as HereMultimodalRouteSectionTransport<"transit">;

  return (
    <div className="flex gap-3 items-center even:bg-gray-50 px-4 py-3">
      <div className="w-8 flex-none flex justify-center text-xl">
        {section.type === "flight" && <MdFlight className="text-gray-500" />}
        {section.type === "airport" && (section as HereMultimodalRouteSection<"airport">).transport.event === 'departure' && <MdFlightTakeoff className="text-gray-500" />}
        {section.type === "airport" && (section as HereMultimodalRouteSection<"airport">).transport.event === 'arrival' && <MdFlightLand className="text-gray-500" />}
        {section.type === "airport" && (section as HereMultimodalRouteSection<"airport">).transport.event === 'layover' && <MdAirlineStops className="text-gray-500" />}
        {section.type === "pedestrian" && (
          <MdDirectionsWalk className="text-gray-500" />
        )}
        {section.type === "vehicle" &&
          (() => {
            if ((section.transport as any).mode === "bicycle") {
              return (
                <div className="text-gray-500">
                  <MdDirectionsBike />
                </div>
              );
            }
            return <MdDirectionsCar className="text-gray-500" />;
          })()}
        {section.type === "transit" && (
          <div className="text-gray-500 h-8">
            <RoutePlanningTransitTransportModeIcon
              agency={section.agency}
              mode={(section.transport as any).mode}
            />
          </div>
        )}
      </div>
      <div>
        {section.type === "pedestrian" && (
          <div className="">
            Walk {formatDistance(Math.round(distanceMeters))}
            {section.arrival.place.name ? (
              <>
                {" "}
                to{" "}
                <span className="font-semibold">
                  {section.arrival.place.name}
                </span>
              </>
            ) : (
              ""
            )}
          </div>
        )}
        {section.type === "transit" && (
          <div className="flex flex-col gap-1.5 items-start justify-start">
            <div className="text-xs text-gray-400">
              {transport.category?.split(", ")[0]} –{" "}
              <a
                target="_blank"
                className="hover:underline whitespace-nowrap"
                href={section.agency?.website ?? "#"}
              >
                {section.agency?.name}&nbsp;
                <ArrowUpRightIcon className="inline-block size-3.5 mb-px" />
              </a>
            </div>
            <div>
              Line{" "}
              <span className="font-semibold font-label text-sm bg-gray-100 py-1 px-2 rounded-lg">
                {transport.shortName ?? transport.name ?? transport.longName}
              </span>
            </div>
            {transport.headsign && (
              <>
                <div className="text-sm text-gray-600 mt-3">Signs for:</div>
                <div
                  className="font-label px-2 py-1 rounded-md text-sm font-semibold my-0.5"
                  style={{
                    backgroundColor: `${
                      transport.color ??
                      herePlatformDefaultSectionColors.transit
                    }`,

                    color: `${transport.textColor ?? "#fff"}`,
                  }}
                >
                  {transport.headsign}
                </div>
              </>
            )}

            <div className="text-sm text-gray-600">
              Exit at{" "}
              <span className="font-semibold">
                {section.arrival.place.name}
              </span>
            </div>
          </div>
        )}
        {section.type === "vehicle" &&
          (() => {
            if ((section.transport as any).mode === "bicycle") {
              return (
                <div className="">Bike {formatDistance(distanceMeters)}</div>
              );
            }
            return (
              <div className="">Drive {formatDistance(distanceMeters)}</div>
            );
          })()}
        {section.type === "flight" && (
          <div>Fly {formatDistance(section.summary?.length ?? 0)}</div>
        )}
        {section.type === "airport" &&
          (() => {
            const airport =
              section.transport as HereMultimodalRouteSectionTransport<"airport">;
            return (
              <div>
                <div className="text-sm text-gray-600">
                  {airport.event === "departure" && "Take off from "}
                  {airport.event === "arrival" && "Touch down at "}
                </div>
                <div className="font-semibold">
                  {airport.name}
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
