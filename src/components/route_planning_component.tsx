"use client";

import {
  ArrowLeftIcon,
  ArrowsUpDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { mapController, MapFeatureWithLayerSpec, MapMarker, MapProject } from "./global_map";
import PanelIconButton from "./panel_icon_button";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import MapPlaceIcon from "./map_place_icon";
import RoutePlanningStepRow from "./route_planning_step_row";
import { serverAddRoute } from "@/app/api/project/add_route";
import { hereMultimodalRouteSectionsToFeatures } from "@/app/utils/backend/here_route_sections_to_features";
import RoutePlanningCustomizer from "./route_planning_customizer";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { ProjectFunctionOpenRoutePlanner, ProjectFunctionUpdateProject } from "@/app/(layout-map)/t/[slug]/content";

export default function RoutePlanningComponent({
  project,
  initialFrom,
  showingDbRoute,
  openRoutePlanner,
  updateProject
}: {
  project: MapProject,
  initialFrom?: MapMarker,
  showingDbRoute?: Prisma.RouteGetPayload<any>,
  openRoutePlanner: ProjectFunctionOpenRoutePlanner,
  updateProject: ProjectFunctionUpdateProject,
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
    mapController.setFeatures("temporary", []);
    mapController.setMarkers([]);
    // projectController.openRoutePlanner(null);
    openRoutePlanner(null);
  };

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeOptions, setRouteOptions] = useState<
    HereMultimodalRoute[] | null
  >(null);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

  const [isAddingRoute, setIsAddingRoute] = useState(false);

  const modalityOptions: {
    value: HereMultimodalRouteModality;
    icon: React.ReactNode;
  }[] = [
      { value: "transit", icon: <MdDirectionsTransit /> },
      { value: "pedestrian", icon: <MdDirectionsWalk /> },
      { value: "car", icon: <MdDirectionsCar /> },
    ]

  const [selectedModality, setSelectedModality] = useState<HereMultimodalRouteModality>("transit")

  useEffect(() => {

    console.log("showingDbRoute changed:", showingDbRoute);

    if (showingDbRoute) {
      const route: HereMultimodalRoute = {
        id: showingDbRoute.id,
        modality: showingDbRoute.modality as HereMultimodalRouteModality,
        sections: showingDbRoute.segments as HereMultimodalRouteSection[],
      };
      setFrom({
        coordinate: {
          lat: showingDbRoute.originLat,
          lng: showingDbRoute.originLng,
        },
        ephemeralId: route.id+"-route-from",
        appleMapsPlace: {
          name: showingDbRoute.originName,
          muid: showingDbRoute.originAppleMapsMuid ?? "mapbox-feature-needs-muid-" + randomUUID(),
          coordinate: {
            lat: showingDbRoute.originLat,
            lng: showingDbRoute.originLng,
          },
          categoryId: showingDbRoute.originExtendedMetadata?.categoryId,
          categoryName: showingDbRoute.originExtendedMetadata?.categoryName,
        }
      })
      setTo({
        coordinate: {
          lat: showingDbRoute.destLat,
          lng: showingDbRoute.destLng,
        },
        ephemeralId: route.id+"-route-to",
        appleMapsPlace: {
          name: showingDbRoute.destName,
          muid: showingDbRoute.destAppleMapsMuid ?? "mapbox-feature-needs-muid-" + randomUUID(),
          coordinate: {
            lat: showingDbRoute.destLat,
            lng: showingDbRoute.destLng,
          },
          categoryId: showingDbRoute.destExtendedMetadata?.categoryId,
          categoryName: showingDbRoute.destExtendedMetadata?.categoryName,
        }
      })
      displayRoute(route);
      setRouteOptions([route]);
      setTimeout(() => {
        setSelectedRouteId(route.id);
      }, 100);
    }
  }, [showingDbRoute])

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setFromSearchQuery(null);
    setToSearchQuery(null);
  };

  useEffect(() => {
    if (!from && !to) mapController.setMarkers([]);

    // Don't need to set markers when just showing existing route
    if (showingDbRoute) return;
    mapController.setMarkers([from, to].filter(m => m !== null));
    mapController.openMarker(null);
  }, [to, from]);

  // Update the initial from if it changes
  useEffect(() => {
    if (!initialFrom) return;
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

    // Don't need to search if just showing existing route
    if (showingDbRoute) return;

    console.log(
      "should calculate route between",
      from.coordinate,
      to.coordinate,
    );
    calculateRoutes(from.coordinate, to.coordinate, selectedModality);
  }, [to, from, selectedModality, showingDbRoute]);

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

  const updateCurrentRouteId = (id: string) => {
    if (!selectedRouteId || !routeOptions || routeOptions.length === 0) return;
  

    console.log("Updating current route id to:", id);

    setRouteOptions(routeOptions.map(route => {
      if (route.id === selectedRouteId) {
        return {
          ...route,
          id: id,
        }
      }
      return route;
    }));
    setSelectedRouteId(id);

  }

  const displayRoute = (route: HereMultimodalRoute) => {

    console.log("displayRoute called")

    const features = hereMultimodalRouteSectionsToFeatures(route.id, route.sections, true, !route.id.startsWith("route-deleted") ? (showingDbRoute?.styleData ?? undefined) : undefined);

    mapController.setFeatures("temporary", features);

    // Close any open marker popups
    mapController.openMarker(null);

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
        // setSelectedRouteId(routes[0].id)
        displayRoute(routes[0]);
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

  const selectedRoute = useMemo(() => {
    if (!routeOptions || !selectedRouteId) return null;
    return routeOptions.find(route => route.id === selectedRouteId) || null;
  }, [routeOptions, selectedRouteId]);

  


  return (
    <div className="absolute slide-in-from-left left-2 bottom-9 w-72 top-navbar">
      <div className="h-full tc-panel flex min-h-0 flex-col overflow-hidden pointer-events-auto">
        <div className="tc-panel-header flex-none transition-all">
          { !showingDbRoute &&
          <div className={`${selectedRoute ? 'opacity-100 mr-0' : 'opacity-0 pointer-events-none -mr-[40px]'} transition-all w-6 flex-none`}>
            <PanelIconButton
              icon={<ArrowLeftIcon />}
              onClick={() => {
                setSelectedRouteId(null);
              }}
            />
          </div>
          }
          <div className="tc-panel-title flex-1">Browse Route{selectedRoute ? '' : 's'}</div>
          <div>
            <PanelIconButton
              icon={<XMarkIcon />}
              onClick={() => {
                close();
              }}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 min-h-0 relative overflow-hidden">
          <div id="route-info-panel" className={`absolute inset-0 bg-white z-30 shadow-lg duration-300 flex flex-col transition-transform ${(selectedRoute || showingDbRoute) ? 'translate-x-0' : 'translate-x-[100%]'}`}>
            {
              selectedRoute && from && to && (
                <>
                  <div className="flex-1 overflow-y-scroll">
                    <div className="p-4 border-b border-gray-100 pt-8 ">
                      <span className="text-gray-500 text-sm">Total Duration</span>
                      <h2 className="text-lg font-semibold mt-1">
                        {calculateTotalDuration(selectedRoute).toHuman({
                          listStyle: "narrow",
                          unitDisplay: "long",
                          showZeros: false,
                          maximumFractionDigits: 0,
                        })}
                      </h2>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex gap-3 px-4 py-3 items-center">
                          <div className="flex-none">
                            <MapPlaceIcon appleMapsCategoryId={from.appleMapsPlace?.categoryId} />
                          </div>
                          <div className="">
                            <div className="font-semibold">{from.appleMapsPlace?.name}</div>
                            <div className="text-sm text-gray-500">Start</div>
                          </div>
                        </div>
                        {selectedRoute.sections.map((section, index) => {
                          return (<RoutePlanningStepRow key={section.id} section={section} />);
                        })}
                        <div className="flex gap-3 px-4 py-3 items-center even:bg-gray-50">
                          <div className="flex-none">
                            <MapPlaceIcon appleMapsCategoryId={to.appleMapsPlace?.categoryId} />
                          </div>
                          <div className="">
                            <div className="font-semibold">{to.appleMapsPlace?.name}</div>
                            <div className="text-sm text-gray-500">Destination</div>
                          </div>
                        </div>
                    </div>

                  </div>
                  <RoutePlanningCustomizer updateRouteId={updateCurrentRouteId} project={project} route={selectedRoute} from={from} to={to} initialDBRoute={showingDbRoute} updateProject={updateProject} />
                </>
              )
            }
          </div>
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
                autoFocus={!!initialFrom}
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
                    <div className="font-medium flex items-center justify-between">
                      <span>
                        {calculateTotalDuration(route).toHuman({
                          listStyle: "narrow",
                          unitDisplay: "short",
                          showZeros: false,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      <div>
                        <ChevronRightIcon className={`size-4 text-gray-400 transition-transform ${selectedRouteId == route.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    <div className="mt-4 text-gray-500 text-sm flex items-center flex-wrap gap-x-2 gap-y-2 bg-gray-100 p-2 rounded-lg">
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
