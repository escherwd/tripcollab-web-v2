"use client";

import {
  ArrowsUpDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { mapController, MapFeatureWithLayerSpec, MapMarker, MapProject } from "./global_map";
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
  HereMultimodalRouteModality,
  HereMultimodalRouteSection,
  HereMultimodalRouteSectionTransport,
  serverCalculateMultimodalRoute,
} from "@/app/api/routes/here_multimodal";
import { MdDirectionsCar, MdDirectionsTransit, MdDirectionsWalk, MdRefresh } from "react-icons/md";
import { RiLoaderFill } from "react-icons/ri";
import { DateTime, Duration } from "luxon";
import { GeoJSONFeature, LngLatBounds } from "mapbox-gl";
import { decode } from "@here/flexpolyline";
import { MapGeoJSONFeature } from "react-map-gl/maplibre";
import { set } from "lodash";
import RoutePlanningSectionChip from "./route_planning_section_chip";
import { herePlatformDefaultSectionColors, herePlatformRouteGetStyleForSection } from "@/app/utils/here_maps/route_styles";
import * as turf from "@turf/turf";

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

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

  const modalityOptions: {
    value: HereMultimodalRouteModality;
    icon: React.ReactNode;
  }[] = [
      { value: "transit", icon: <MdDirectionsTransit /> },
      { value: "pedestrian", icon: <MdDirectionsWalk /> },
      { value: "car", icon: <MdDirectionsCar /> },
    ]

  const [selectedModality, setSelectedModality] = useState<HereMultimodalRouteModality>("transit")

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
    calculateRoutes(from.coordinate, to.coordinate, selectedModality);
  }, [to, from, selectedModality]);

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
      const id = route.id + "-" + section.id;

      

      const polyline = decode(section.polyline).polyline.map((coord) => [
        coord[1],
        coord[0],
      ])

      // if (section.type === 'pedestrian') {
      //   const line = turf.lineString(polyline);
      //   const length = turf.length(line, { units: 'meters' });
      //   if (length < 400) return null; // Skip very short pedestrian sections
      // }

      const styleSpec = herePlatformRouteGetStyleForSection(section);

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

      if (section.type === "transit") {
        const line = turf.lineString(polyline);
        const length = turf.length(line, { units: 'meters' });
        const center = turf.along(line, length / 2, { units: 'meters' });

        const transport = section.transport as HereMultimodalRouteSectionTransport<"transit">;

        feature.marker = {
          coordinate: {
            lat: center.geometry.coordinates[1],
            lng: center.geometry.coordinates[0],
          },
          element: (
            <RoutePlanningSectionChip section={section} />
          )
        }
      }

      return feature;
  }).filter(f => f !== null) as MapFeatureWithLayerSpec[];

  mapController.setFeatures("temporary", features);

  // Determine the bounding box of the route
  const completePolyline = route.sections.flatMap((section) => decode(section.polyline).polyline.map((coord) => [
    coord[1],
    coord[0],
  ]));

  const line = turf.lineString(completePolyline);
  const bbox = turf.bbox(line);

  // TODO: standardize padding values
  mapController.setPadding({
    top: 64,
    left: 8 + 288 + 8,
    right: 8 + 272 + 8,
    bottom: 0,
  })

  // Expand the bbox by 10% on each side
  const scalarY = Math.abs(bbox[0] - bbox[2]) / 10;
  bbox[0] -= scalarY;
  bbox[2] += scalarY;

  const scalarX = Math.abs(bbox[1] - bbox[3]) / 10;
  bbox[1] -= scalarX;
  bbox[3] += scalarX;

  mapController.flyToBounds(new LngLatBounds(
    [bbox[0], bbox[1]],
    [bbox[2], bbox[3]],
  ));
};

const calculateRoutes = async (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  modality: HereMultimodalRouteModality
) => {
  setIsCalculatingRoute(true);
  try {
    const routes = await serverCalculateMultimodalRoute(from, to, modality);
    setRouteOptions(routes);
    console.log(routes);
    if (routes.length > 0) {
      setSelectedRouteId(routes[0].id)
    }
  } catch (err) {
    console.error("Error calculating route:", err);
  }
  setIsCalculatingRoute(false);

};

useEffect(() => {
  if (!routeOptions) return;
  const selectedRoute = routeOptions.find(route => route.id === selectedRouteId)
  if (selectedRoute) {
    displayRoute(selectedRoute)
  }
}, [selectedRouteId, routeOptions])

const calculateTotalDuration = (route: HereMultimodalRoute): Duration => {
  return DateTime.fromISO(
    route.sections[route.sections.length - 1].arrival.time,
  ).diff(DateTime.fromISO(route.sections[0].departure.time), [
    "hours",
    "minutes",
  ]);
};

const shouldDisplay = (section: HereMultimodalRouteSection): boolean => {
  // For pedestrian sections, only display if longer than 400 meters
  if (section.type === 'pedestrian') {
    const polyline = decode(section.polyline).polyline.map((coord) => [
      coord[1],
      coord[0],
    ])
    const line = turf.lineString(polyline);
    const length = turf.length(line, { units: 'meters' });
    return length >= 400; // Display if 400 meters or longer
  }
  return true;
}



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
        <div className="grid grid-cols-3 gap-2 p-4">
          {modalityOptions.map((option) => (
            <button className={`px-3 py-2 flex justify-center transition-colors text-lg bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-lg ${selectedModality === option.value ? '!bg-black text-white' : ''}`}
              key={option.value}
              onClick={() => setSelectedModality(option.value)}>
              {option.icon}
            </button>
          ))}
        </div>
        <div className="flex-1 relative overflow-scroll">
          {isCalculatingRoute && (
            <div className="absolute inset-0 flex gap-2 items-start justify-center pt-4">
              <RiLoaderFill className="text-gray-400 size-5 animate-spin" />
              <div className="text-gray-400 text-sm">Finding routes...</div>
            </div>
          )}
          {routeOptions && !isCalculatingRoute && (
            <div className="fade-in">
              {
                routeOptions.length === 0 && (
                  <div className="p-4 text-sm text-center text-gray-400">
                    No routes found for the selected locations and modality.
                  </div>
                )
              }
              {routeOptions.map((route) => (
                <a className={`block p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedRouteId == route.id ? 'bg-gray-100 hover:bg-gray-100' : ''}`}
                  key={route.id}
                  onClick={() => { setSelectedRouteId(route.id) }}>
                  <div className="text font-display font-medium">
                    {calculateTotalDuration(route).toHuman({
                      listStyle: "narrow",
                      unitDisplay: "short",
                      showZeros: false,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="mt-2 text-gray-500 text-sm flex items-center flex-wrap gap-x-2 gap-y-1">
                    {route.sections.filter(section => shouldDisplay(section)).map((section) => (
                      <React.Fragment key={section.id}>
                        <RoutePlanningSectionChip section={section} />
                        <div className="flex-none last:hidden">
                          <ChevronRightIcon className="size-4" />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
