"use client";

import {
  ArrowLeftIcon,
  ArrowsUpDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { mapController, MapMarker, MapPin, MapProject } from "./global_map";
import PanelIconButton from "./panel_icon_button";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppleMapsAutocompleteResponse,
  autocompleteAppleMaps,
} from "@/app/api/maps/autocomplete";
import SearchAutocompleteComponent from "./search_autocomplete";
import {
  HereMultimodalRoute,
  HereMultimodalRouteModality,
  HereMultimodalRouteRequestResult,
  HereMultimodalRouteSection,
  serverCalculateMultimodalRoute,
} from "@/app/api/routes/here_multimodal";
import {
  MdChevronRight,
  MdDirectionsBike,
  MdDirectionsCar,
  MdDirectionsTransit,
  MdDirectionsWalk,
  MdFlight,
  MdPedalBike,
  MdTravelExplore,
} from "react-icons/md";
import { RiLoaderFill } from "react-icons/ri";
import { DateTime, Duration } from "luxon";
import { LngLatBounds } from "mapbox-gl";
import { decode } from "@here/flexpolyline";
import RoutePlanningSectionChip from "./route_planning_section_chip";
import * as turf from "@turf/turf";
import MapPlaceIcon from "./map_place_icon";
import RoutePlanningStepRow from "./route_planning_step_row";
import { hereMultimodalRouteSectionsToFeatures } from "@/app/utils/backend/here_route_sections_to_features";
import RoutePlanningCustomizer from "./route_planning_customizer";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  ProjectFunctionOpenRoutePlanner,
  ProjectFunctionUpdateProject,
} from "@/app/(layout-map)/t/[slug]/content";
import {
  MAP_UI_PADDING_VALUES,
  SEARCH_AUTOCOMPLETE_DEBOUNCE_MS,
} from "@/app/utils/consts";
import { projectPinToMarker } from "@/app/utils/backend/project_pin_to_marker";
import padBbox from "@/app/utils/geo/pad_bbox";
import RoutePlanningCalendarSubpage from "./route_planning_calendar_subpage";
import TcButton from "./button";
import { formatDistance } from "@/app/utils/geo/format_distance";
import RoutePlanningFlightComponent from "./route_planning_flight_component";

export default function RoutePlanningComponent({
  project,
  initialFrom,
  showingDbRoute,
  openRoutePlanner,
  updateProject,
}: {
  project: MapProject;
  initialFrom?: MapMarker;
  showingDbRoute?: Prisma.RouteGetPayload<any>;
  openRoutePlanner: ProjectFunctionOpenRoutePlanner;
  updateProject: ProjectFunctionUpdateProject;
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

  // On close
  const close = () => {
    // Opening the route planner with nothing will close it
    mapController.setFeatures("temporary", []);
    mapController.setMarkers([]);
    // projectController.openRoutePlanner(null);
    openRoutePlanner(null);
  };

  // On open
  useEffect(() => {
    mapController.setPadding((p) => ({
      ...p,
      left: MAP_UI_PADDING_VALUES.NAVIGATION_PANEL,
    }));
  }, []);



  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeSearchResults, setRouteSearchResults] =
    useState<HereMultimodalRouteRequestResult | null>(null);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const modalityOptions: {
    value: HereMultimodalRouteModality;
    icon: React.ReactNode;
  }[] = [
    { value: "flight", icon: <MdFlight /> },
    { value: "transit", icon: <MdDirectionsTransit /> },
    { value: "car", icon: <MdDirectionsCar /> },
    { value: "pedestrian", icon: <MdDirectionsWalk /> },
    { value: "bicycle", icon: <MdDirectionsBike /> },
  ];

  const [selectedModality, setSelectedModality] =
    useState<HereMultimodalRouteModality>("transit");

  useEffect(() => {
    console.log("showingDbRoute changed:", showingDbRoute);

    if (showingDbRoute) {
      const route: HereMultimodalRoute = {
        id: showingDbRoute.id,
        modality: showingDbRoute.modality as HereMultimodalRouteModality,
        sections: showingDbRoute.segments as HereMultimodalRouteSection[],
        totalDistance: 0, // TODO: calculate total distance
        duration: showingDbRoute.duration || 0,
        departureTime: showingDbRoute.dateStart?.toISOString(),
      };
      setFrom({
        coordinate: {
          lat: showingDbRoute.originLat,
          lng: showingDbRoute.originLng,
        },
        ephemeralId: route.id + "-route-from",
        appleMapsPlace: {
          name: showingDbRoute.originName,
          muid:
            showingDbRoute.originAppleMapsMuid ??
            "mapbox-feature-needs-muid-" + randomUUID(),
          coordinate: {
            lat: showingDbRoute.originLat,
            lng: showingDbRoute.originLng,
          },
          categoryId: showingDbRoute.originExtendedMetadata?.categoryId,
          categoryName: showingDbRoute.originExtendedMetadata?.categoryName,
        },
      });
      setTo({
        coordinate: {
          lat: showingDbRoute.destLat,
          lng: showingDbRoute.destLng,
        },
        ephemeralId: route.id + "-route-to",
        appleMapsPlace: {
          name: showingDbRoute.destName,
          muid:
            showingDbRoute.destAppleMapsMuid ??
            "mapbox-feature-needs-muid-" + randomUUID(),
          coordinate: {
            lat: showingDbRoute.destLat,
            lng: showingDbRoute.destLng,
          },
          categoryId: showingDbRoute.destExtendedMetadata?.categoryId,
          categoryName: showingDbRoute.destExtendedMetadata?.categoryName,
        },
      });
      displayRoute(route);
      setRouteSearchResults({
        routes: [route],
        key: route.id,
        time: undefined,
      });
      setTimeout(() => {
        setSelectedRouteId(route.id);
      }, 100);
    }
  }, [showingDbRoute]);

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
    mapController.setMarkers([from, to].filter((m) => m !== null));
    mapController.openMarker(null);
  }, [to, from]);

  // Update the initial from if it changes
  useEffect(() => {
    if (!initialFrom) return;
    setFrom(initialFrom ?? null);

    if (initialFrom.appleMapsPlace?.categoryId?.includes('airport'))
      setSelectedModality("flight");
  }, [initialFrom]);

  const handleAutocomplete = async (
    query: string,
    otherLocation?: { lng: number; lat: number }
  ) => {
    if (query.length > 0) {
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
        project.pins.map((pin) => ({
          id: pin.id,
          appleMapsMuid: pin.appleMapsMuid ?? undefined,
          name: pin.name,
        }))
      );
      return data;
    } else {
      return null;
    }
  };

  const latestFromQuery = useRef("");
  useEffect(() => {
    if (!fromSearchQuery || fromSearchQuery.length < 1) {
      setFromAutocompleteResults(null);
      return;
    }

    const currentSearch = `${fromSearchQuery}`;
    latestFromQuery.current = currentSearch;

    (async () => {
      // Very basic debounce
      await new Promise((resolve) =>
        setTimeout(resolve, SEARCH_AUTOCOMPLETE_DEBOUNCE_MS)
      );
      if (currentSearch !== latestFromQuery.current) return;

      handleAutocomplete(
        currentSearch,
        to ? { lng: to.coordinate.lng, lat: to.coordinate.lat } : undefined
      ).then((data) => {
        setFromAutocompleteResults(data ?? null);
      });
    })();
  }, [fromSearchQuery]);

  useEffect(() => {
    if (!to || !from) return;

    // Don't need to search if just showing existing route
    if (showingDbRoute) return;

    console.log(
      "should calculate route between",
      from.coordinate,
      to.coordinate
    );
    calculateRoutes(
      from.coordinate,
      to.coordinate,
      selectedModality,
      routeTime
    );
  }, [to, from, selectedModality, showingDbRoute]);

  const latestToQuery = useRef("");
  useEffect(() => {
    if (!toSearchQuery || toSearchQuery.length < 1) {
      setToAutocompleteResults(null);
      return;
    }

    const currentSearch = `${toSearchQuery}`;
    latestToQuery.current = currentSearch;

    (async () => {
      // Very basic debounce
      await new Promise((resolve) =>
        setTimeout(resolve, SEARCH_AUTOCOMPLETE_DEBOUNCE_MS)
      );
      if (currentSearch !== latestToQuery.current) return;

      handleAutocomplete(
        currentSearch,
        from
          ? { lng: from.coordinate.lng, lat: from.coordinate.lat }
          : undefined
      ).then((data) => {
        setToAutocompleteResults(data ?? null);
      });
    })();
  }, [toSearchQuery]);

  const handleFromAutocompleteResultClick = (
    result: AppleMapsAutocompleteResponse["results"][number]
  ) => {
    // Handle existing pins
    if (result.localProjectId) {
      const pin = project.pins.find((pin) => pin.id === result.localProjectId);
      if (!pin) return;
      setFromSearchQuery(null);
      setFrom(projectPinToMarker(pin));
      return;
    }
    // Handle Apple Maps results
    if (!result.place) return;
    setFromSearchQuery(null);
    setFrom({
      coordinate: result.place.coordinate,
      ephemeralId: result.muid,
      appleMapsPlace: result.place,
    });
  };

  const handleToAutocompleteResultClick = (
    result: AppleMapsAutocompleteResponse["results"][number]
  ) => {
    // Handle existing pins
    if (result.localProjectId) {
      const pin = project.pins.find((pin) => pin.id === result.localProjectId);
      if (!pin) return;
      setToSearchQuery(null);
      setTo(projectPinToMarker(pin));
      return;
    }
    // Handle Apple Maps results
    if (!result.place) return;
    setToSearchQuery(null);
    setTo({
      coordinate: result.place.coordinate,
      ephemeralId: result.muid,
      appleMapsPlace: result.place,
    });
  };

  const updateCurrentRouteId = (id: string) => {
    if (
      !selectedRouteId ||
      !routeSearchResults ||
      routeSearchResults.routes.length === 0
    )
      return;

    console.log("Updating current route id to:", id);

    setRouteSearchResults({
      ...routeSearchResults,
      routes: routeSearchResults.routes.map((route) => {
        if (route.id === selectedRouteId) {
          return {
            ...route,
            id: id,
          };
        }
        return route;
      }),
    });
    setSelectedRouteId(id);
  };

  const displayRoute = (route: HereMultimodalRoute) => {
    console.log("displayRoute called");

    const features = hereMultimodalRouteSectionsToFeatures(
      route.id,
      route.sections,
      true,
      !route.id.startsWith("route-deleted")
        ? showingDbRoute?.styleData ?? undefined
        : undefined
    );

    mapController.setFeatures("temporary", features);

    // Close any open marker popups
    mapController.openMarker(null);

    // Determine the bounding box of the route
    const completePolyline = route.sections.flatMap((section) =>
      decode(section.polyline).polyline.map((coord) => [coord[1], coord[0]])
    );

    const line = turf.lineString(completePolyline);
    const bbox = padBbox(turf.bbox(line), 0.1);

    mapController.flyToBounds(
      new LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]])
    );
  };

  const calculateRoutes = async (
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    modality: HereMultimodalRouteModality,
    time: typeof routeTime
  ) => {
    setIsCalculatingRoute(true);
    try {
      const routes = await serverCalculateMultimodalRoute(from, to, modality, {
        time,
      });
      setRouteSearchResults(routes);
      console.log(routes);
      if (routes.routes.length > 0) {
        // setSelectedRouteId(routes.routes[0].id)
        displayRoute(routes.routes[0]);
      }
    } catch (err) {
      console.error("Error calculating route:", err);
    }
    setIsCalculatingRoute(false);
  };

  useEffect(() => {
    if (!routeSearchResults) return;
    const selectedRoute = routeSearchResults.routes.find(
      (route) => route.id === selectedRouteId
    );
    if (selectedRoute) {
      displayRoute(selectedRoute);
    }
  }, [selectedRouteId, routeSearchResults]);

  const calculateTotalDuration = (route: HereMultimodalRoute): Duration => {
    const days = Math.floor(route.duration / 1440);
    const hours = Math.floor((route.duration % 1440) / 60);
    const minutes = route.duration % 60;
    return Duration.fromDurationLike({ days, hours, minutes });
  };

  const shouldDisplay = (modality: HereMultimodalRouteModality, section: HereMultimodalRouteSection): boolean => {
    // For pedestrian sections, only display if longer than 400 meters
    if (modality === "transit" && section.type === "pedestrian") {
      const polyline = decode(section.polyline).polyline.map((coord) => [
        coord[1],
        coord[0],
      ]);
      const line = turf.lineString(polyline);
      const length = turf.length(line, { units: "meters" });
      return length >= 400; // Display if 400 meters or longer
    }
    return true;
  };

  const selectedRoute = useMemo(() => {
    if (!routeSearchResults || !selectedRouteId) return null;
    return (
      routeSearchResults.routes.find((route) => route.id === selectedRouteId) ||
      null
    );
  }, [routeSearchResults, selectedRouteId]);

  const [calendarPageOpen, setCalendarPageOpen] = useState(false);

  const associatedMapPins: {
    from: MapPin | undefined;
    to: MapPin | undefined;
  } = useMemo(() => {
    return {
      from:
        from && from.id
          ? project.pins.find((pin) => pin.id === from.id)
          : undefined,
      to:
        to && to.id ? project.pins.find((pin) => pin.id === to.id) : undefined,
    };
  }, [from, to, project.pins]);

  const [routeTime, setRouteTime] = useState<{
    type: "depart" | "arrive";
    date: string;
  }>({
    type: "depart",
    date: DateTime.now().toISO({ includeOffset: false }),
  });

  const onRouteTimeChange = useCallback((value: typeof routeTime) => {
    console.log("Route time changed:", value);
    if (value.date === routeTime.date && value.type === routeTime.type) return;
    setRouteTime(value);
  }, []);

  const closeSubPage = () => {
    if (calendarPageOpen) {
      // Close calendar
      setCalendarPageOpen(false);
      // Early return if no route selected
      if (!to || !from) return;
      // Early return if time didn't change since prev. search results
      if (
        routeTime.date === routeSearchResults?.time?.date &&
        routeTime.type === routeSearchResults?.time?.type
      )
        return;

      // Recalculate route with new time
      calculateRoutes(
        from.coordinate,
        to.coordinate,
        selectedModality,
        routeTime
      );

      return;
    } else if (selectedRoute) {
      // Close route details
      setSelectedRouteId(null);
      return;
    }
  };

  return (
    <div className="absolute slide-in-from-left left-2 bottom-9 w-72 top-navbar">
      <div className="h-full tc-panel flex min-h-0 flex-col overflow-hidden pointer-events-auto">
        <div className="tc-panel-header flex-none transition-all">
          {!showingDbRoute && (
            <div
              className={`${
                selectedRoute || calendarPageOpen
                  ? "opacity-100 mr-0"
                  : "opacity-0 pointer-events-none -mr-[40px]"
              } transition-all w-6 flex-none`}
            >
              <PanelIconButton
                icon={<ArrowLeftIcon />}
                onClick={closeSubPage}
              />
            </div>
          )}
          <div className="tc-panel-title flex-1">
            {calendarPageOpen
              ? "Select Time"
              : selectedRoute
              ? "Route Details"
              : "Browse Routes"}
          </div>
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
          <div
            id="route-calendar-panel"
            className={`absolute inset-0 bg-white z-30 shadow-lg duration-300 flex flex-col transition-transform ${
              calendarPageOpen
                ? "translate-x-0"
                : "translate-x-[100%] shadow-none"
            }`}
          >
            <RoutePlanningCalendarSubpage
              project={project}
              pinTo={associatedMapPins.to}
              pinFrom={associatedMapPins.from}
              onChange={onRouteTimeChange}
            />
          </div>
          <div
            id="route-info-panel"
            className={`absolute inset-0 bg-white z-30 shadow-lg duration-300 flex flex-col transition-transform ${
              selectedRoute || showingDbRoute
                ? "translate-x-0"
                : "translate-x-[100%] shadow-none"
            }`}
          >
            {selectedRoute && from && to && (
              <>
                <div className="flex-1 overflow-y-scroll">
                  <div className="p-4 border-b border-gray-100 pt-8 ">
                    <span className="text-gray-500 text-sm">
                      Total Duration
                    </span>
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
                        <MapPlaceIcon
                          appleMapsCategoryId={from.appleMapsPlace?.categoryId}
                        />
                      </div>
                      <div className="">
                        <div className="font-semibold">
                          {from.appleMapsPlace?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Start
                          {selectedRoute.departureTime && (
                            <span>
                              {" – "}
                              {DateTime.fromISO(selectedRoute.departureTime, {
                                setZone: true,
                              }).toLocaleString(DateTime.TIME_SIMPLE)}
                            </span>
                          )}{" "}
                        </div>
                      </div>
                    </div>
                    {selectedRoute.sections.map((section, index) => {
                      return (
                        <RoutePlanningStepRow
                          key={section.id}
                          section={section}
                        />
                      );
                    })}
                    <div className="flex gap-3 px-4 py-3 items-center even:bg-gray-50">
                      <div className="flex-none">
                        <MapPlaceIcon
                          appleMapsCategoryId={to.appleMapsPlace?.categoryId}
                        />
                      </div>
                      <div className="">
                        <div className="font-semibold">
                          {to.appleMapsPlace?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Destination
                          {selectedRoute.departureTime && (
                            <span>{" – "}
                              {DateTime.fromISO(selectedRoute.departureTime, {
                                setZone: true,
                              })
                                .plus({ minutes: selectedRoute.duration })
                                .toLocaleString(DateTime.TIME_SIMPLE)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <RoutePlanningCustomizer
                  updateRouteId={updateCurrentRouteId}
                  project={project}
                  route={selectedRoute}
                  from={from}
                  to={to}
                  initialDBRoute={showingDbRoute}
                  updateProject={updateProject}
                />
              </>
            )}
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
                        fromAutocompleteResults?.results[0]
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
                    project={project}
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
                        toAutocompleteResults?.results[0]
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
                    project={project}
                  />
                </div>
              )}
            </div>

            <div
              onClick={() => setCalendarPageOpen(true)}
              className={`mt-2 tc-route-planner-input transition-all hover:!bg-gray-200 cursor-pointer overflow-hidden`}
            >
              <span>{routeTime.type === "depart" ? "Depart" : "Arrive"}</span>
              <div className="tc-route-planner-input-content !pr-2 flex items-center justify-between">
                <span>
                  {DateTime.fromISO(routeTime.date).toLocaleString({
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <MdChevronRight className="size-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 p-4">
            {modalityOptions.map((option) => (
              <TcButton
                key={option.value}
                primary={selectedModality === option.value}
                onClick={() => setSelectedModality(option.value)}
                className="!text-base"
              >
                {option.icon}
              </TcButton>
            ))}
          </div>
          <div className="flex-1 relative overflow-scroll border-t border-gray-100">
            {isCalculatingRoute && (
              <div className="absolute inset-0 flex gap-2 items-start justify-center pt-4">
                <RiLoaderFill className="text-gray-400 size-5 animate-spin" />
                <div className="text-gray-400 text-sm">Finding routes...</div>
              </div>
            )}
            {routeSearchResults && !isCalculatingRoute && (
              <div className="fade-in">
                {routeSearchResults.routes.length === 0 && (
                  <div className="p-4 text-sm text-center text-gray-400">
                    No routes found for the selected locations and modality.
                  </div>
                ) || (selectedModality === 'flight' && <RoutePlanningFlightComponent />)}
                {routeSearchResults.routes.map((route) => (
                  <a
                    className={`block p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      selectedRouteId == route.id
                        ? "bg-gray-100 hover:bg-gray-100"
                        : ""
                    }`}
                    key={route.id}
                    onClick={() => {
                      setSelectedRouteId(route.id);
                    }}
                  >
                    <div className=" flex gap-2 items-center justify-between">
                      <div className="flex flex-1 flex-col gap-2 items-stretch">
                        <span className="font-medium text-lg">
                          {calculateTotalDuration(route).toHuman({
                            listStyle: "narrow",
                            unitDisplay: "short",
                            showZeros: false,
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>

                      <div>
                        <ChevronRightIcon
                          className={`size-5 text-gray-400 transition-transform ${
                            selectedRouteId == route.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {route.departureTime && (
                      <div className="my-3 text-xs text-gray-400 flex items-center gap-2 w-full">
                        {DateTime.fromISO(route.departureTime, {
                          setZone: true,
                        }).toLocaleString(DateTime.TIME_SIMPLE)}
                        <div className="flex-1 border-t-2 border-gray-400 border-dotted" />
                        {formatDistance(route.totalDistance)}
                        <div className="flex-1 border-t-2 border-gray-400 border-dotted" />
                        <span className="text-gray-700">
                          {DateTime.fromISO(route.departureTime, {
                            setZone: true,
                          })
                            .plus({ minutes: route.duration })
                            .toLocaleString(DateTime.TIME_SIMPLE)}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 text-gray-500 text-sm flex items-center flex-wrap gap-x-2 gap-y-2 bg-gray-100 p-2 rounded-lg">
                      {route.sections
                        .filter((section) => shouldDisplay(route.modality, section))
                        .map((section) => (
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
