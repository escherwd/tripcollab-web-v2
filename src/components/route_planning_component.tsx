"use client";

import {
  ArrowsUpDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { mapController, MapMarker, MapProject } from "./global_map";
import PanelIconButton from "./panel_icon_button";
import { projectController } from "@/app/utils/controllers/project_controller";
import React, { useCallback, useEffect, useState } from "react";
import {
  AppleMapsAutocompleteResponse,
  autocompleteAppleMaps,
} from "@/app/api/maps/autocomplete";
import SearchAutocompleteComponent from "./search_autocomplete";
import {
  HereMultimodalRoute,
  serverCalculateMultimodalRoute,
} from "@/app/api/routes/here_multimodal";
import { MdRefresh } from "react-icons/md";
import { RiLoaderFill } from "react-icons/ri";
import { DateTime, Duration } from "luxon";
import { GeoJSONFeature } from "mapbox-gl";
import { decode } from "@here/flexpolyline";
import { MapGeoJSONFeature } from "react-map-gl/maplibre";

export default function RoutePlanningComponent({
  project,
  initialFrom,
}: {
  project: MapProject;
  initialFrom?: MapMarker;
}) {
  const [fromSearchQuery, setFromSearchQuery] = useState<string | null>(null);
  const [toSearchQuery, setToSearchQuery] = useState<string | null>(null);

  const [from, setFrom] = useState<MapMarker | null>(initialFrom ?? null);
  const [to, setTo] = useState<MapMarker | null>(null);

  const [inputFocused, setInputFocused] = useState<"from" | "to" | null>(null);

  const [fromAutocompleteResults, setFromAutocompleteResults] =
    useState<AppleMapsAutocompleteResponse | null>(null);

  const [toAutocompleteResults, setToAutocompleteResults] =
    useState<AppleMapsAutocompleteResponse | null>(null);

  const close = () => {
    // Opening the route planner with nothing will close it
    projectController.openRoutePlanner(null);
  };

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeOptions, setRouteOptions] = useState<
    HereMultimodalRoute[] | null
  >(null);

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setFromSearchQuery(null);
    setToSearchQuery(null);
  };

  // Update the initial from if it changes
  useEffect(() => {
    setFrom(initialFrom ?? null);
  }, [initialFrom]);

  const handleAutocomplete = async (
    query: string,
    otherLocation?: { lng: number; lat: number },
  ) => {
    if (query.length > 3) {
      const bounds = await mapController.getMapBounds();

      if (!bounds) return;

      const data = await autocompleteAppleMaps(
        query,
        {
          lng: bounds.getCenter().lng,
          lat: bounds.getCenter().lat,
          deltaLng: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
          deltaLat: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
        },
        otherLocation
          ? { lng: otherLocation.lng, lat: otherLocation.lat }
          : undefined,
      );
      return data;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!fromSearchQuery || fromSearchQuery.length < 3) {
      setFromAutocompleteResults(null);
      return;
    }

    handleAutocomplete(
      fromSearchQuery!,
      to ? { lng: to.coordinate.lng, lat: to.coordinate.lat } : undefined,
    ).then((data) => {
      setFromAutocompleteResults(data ?? null);
    });
  }, [fromSearchQuery]);

  useEffect(() => {
    if (!to || !from) return;

    console.log(
      "should calculate route between",
      from.coordinate,
      to.coordinate,
    );
    calculateRoutes(from.coordinate, to.coordinate);
  }, [to, from]);

  useEffect(() => {
    if (!toSearchQuery || toSearchQuery.length < 3) {
      setToAutocompleteResults(null);
      return;
    }

    handleAutocomplete(
      toSearchQuery!,
      from ? { lng: from.coordinate.lng, lat: from.coordinate.lat } : undefined,
    ).then((data) => {
      setToAutocompleteResults(data ?? null);
    });
  }, [toSearchQuery]);

  const handleFromAutocompleteResultClick = (
    result: AppleMapsAutocompleteResponse["results"][number],
  ) => {
    if (!result.place) return;
    setFromSearchQuery(null);
    setFrom({
      coordinate: result.place.coordinate,
      ephemeralId: result.muid,
      appleMapsPlace: result.place,
    });
  };

  const handleToAutocompleteResultClick = (
    result: AppleMapsAutocompleteResponse["results"][number],
  ) => {
    // setToSearchQuery(result.highlight);
    if (!result.place) return;
    setToSearchQuery(null);
    setTo({
      coordinate: result.place.coordinate,
      ephemeralId: result.muid,
      appleMapsPlace: result.place,
    });
  };

  const displayRoute = (route: HereMultimodalRoute) => {
    const features = route.sections.map((section) => {
      const feature = {
        id: route.id + "-" + section.id,
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: decode(section.polyline).polyline.map((coord) => [
            coord[1],
            coord[0],
          ]),
        },
      };
      return feature;
    });
    mapController.setGeoJSONFeatures("temporary", features);
  };

  const calculateRoutes = async (
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
  ) => {
    setIsCalculatingRoute(true);
    const routes = await serverCalculateMultimodalRoute(from, to);
    setRouteOptions(routes);
    console.log(routes);
    setIsCalculatingRoute(false);
    if (routes.length > 0) {
      displayRoute(routes[0]);
    }
  };

  const calculateTotalDuration = (route: HereMultimodalRoute): Duration => {
    return DateTime.fromISO(
      route.sections[route.sections.length - 1].arrival.time,
    ).diff(DateTime.fromISO(route.sections[0].departure.time), [
      "hours",
      "minutes",
    ]);
  };

  return (
    <div className="absolute slide-in-from-left left-2 bottom-9 w-72 top-navbar">
      <div className="h-full tc-panel flex min-h-0 flex-col overflow-hidden">
        <div className="tc-panel-header flex-none">
          <div className="tc-panel-title">Browse Routes</div>
          <div>
            <PanelIconButton
              icon={<XMarkIcon />}
              onClick={() => {
                close();
              }}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-4 bg-gray-50 flex-none h-24 hidden"></div>
          <div className="p-4 flex-none flex flex-col border-b border-gray-100">
            <div className="tc-route-planner-input">
              <span>From</span>
              <input
                type="text"
                value={fromSearchQuery ?? from?.appleMapsPlace?.name ?? ""}
                onChange={(e) => {
                  setFromSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (fromAutocompleteResults?.results[0]) {
                      handleFromAutocompleteResultClick(
                        fromAutocompleteResults?.results[0],
                      );
                    }
                  }
                }}
                onFocus={() => {
                  setInputFocused("from");
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setInputFocused(null);
                  }, 100);
                }}
              />
            </div>

            <div className="relative w-full">
              {inputFocused === "from" && (
                <div className="absolute top-2 w-full z-40">
                  <SearchAutocompleteComponent
                    results={fromAutocompleteResults}
                    onResultClick={handleFromAutocompleteResultClick}
                  />
                </div>
              )}
            </div>

            <div className="h-2 w-full flex justify-end items-center pr-2 z-10">
              <PanelIconButton
                className=""
                icon={<ArrowsUpDownIcon />}
                onClick={() => {
                  swap();
                }}
              />
            </div>

            <div className="tc-route-planner-input">
              <span>To</span>
              <input
                type="text"
                value={toSearchQuery ?? to?.appleMapsPlace?.name ?? ""}
                onChange={(e) => {
                  setToSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (toAutocompleteResults?.results[0]) {
                      handleToAutocompleteResultClick(
                        toAutocompleteResults?.results[0],
                      );
                    }
                  }
                }}
                onFocus={() => {
                  setInputFocused("to");
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setInputFocused(null);
                  }, 100);
                }}
              />
            </div>

            <div className="relative w-full">
              {inputFocused === "to" && (
                <div className="absolute top-2 w-full z-40">
                  <SearchAutocompleteComponent
                    results={toAutocompleteResults}
                    onResultClick={handleToAutocompleteResultClick}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 relative overflow-scroll">
            {isCalculatingRoute && (
              <div className="absolute inset-0 flex gap-2 items-start justify-center pt-4">
                <RiLoaderFill className="text-gray-400 size-5 animate-spin" />
                <div className="text-gray-400 text-sm">Finding routes...</div>
              </div>
            )}
            {routeOptions && (
              <div className="fade-in">
                {routeOptions.map((route) => (
                  <div className="p-4 border-b border-gray-100" key={route.id}>
                    <div className="text font-display font-medium">
                      {calculateTotalDuration(route).toHuman({
                        listStyle: "narrow",
                        unitDisplay: "short",
                        showZeros: false,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div className="mt-2 text-gray-500 text-sm flex items-center flex-wrap gap-x-2 gap-y-1">
                      {route.sections.map((section) => (
                        <React.Fragment key={section.id}>
                          <div key={section.id}>{section.type}</div>
                          <div className="flex-none last:hidden">
                            <ChevronRightIcon className="size-4" />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
