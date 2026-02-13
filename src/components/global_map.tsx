"use client";

import Map, {
  Layer,
  LayerProps,
  MapRef,
  Marker,
  Source,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  EasingOptions,
  LayerSpecification,
  LngLatBounds,
  LngLatLike,
  MapMouseEvent,
} from "mapbox-gl";
import { AppleMapsPlaceResult } from "@/app/api/maps/apple_maps";
import MapPlaceIcon from "./map_place_icon";
import MapPlacePopup from "./map_place_popup";
import { renderFeatureToMarker } from "@/app/utils/mapbox/render_feature_to_marker";

import { AppleMapsPlace } from "@/app/api/maps/place";
import { projectPinToMarker } from "@/app/utils/backend/project_pin_to_marker";
// import { Feature } from "geojson";
import { Prisma } from "@prisma/client";
import { hereMultimodalRouteSectionsToFeatures } from "@/app/utils/backend/here_route_sections_to_features";
import { HereMultimodalRouteSection } from "@/app/api/routes/here_multimodal";
import { projectEventReceiver } from "@/app/utils/controllers/project_controller";
import _ from "lodash";
import { bbox, center, distance, point, points } from "@turf/turf";
import PinGroup from "./pin_group";
import {
  MAP_STYLES,
  MAP_UI_POPOVER_MIN_HEIGHT,
  MAP_UI_POPOVER_STAY_IN_FRAME,
} from "@/app/utils/consts";
import padBbox from "@/app/utils/geo/pad_bbox";
// import { projectController } from "@/app/utils/controllers/project_controller";

// Create a global event emitter for the map
const mapEmitter = new EventTarget();

export type CustomEasingOptions = EasingOptions & { center?: [number, number] };
export type MapPadding = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type MapMarker<T = AppleMapsPlaceResult> = {
  id?: string;
  ephemeralId: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  appleMapsPlace?: T;
  mapboxFeatureId?: string;
  customColor?: string;
};

export type MapProject = Prisma.ProjectGetPayload<{
  include: {
    pins: true;
    user: true;
    routes: true;
    projectShares: { include: { user: true } };
  };
}>;

export type MapPin = Prisma.PinGetPayload<any>;
export type MapRoute = Prisma.RouteGetPayload<any>;

export type ConsolidatedMapMarker = {
  coordinate: {
    lat: number;
    lng: number;
  };
  element: React.ReactNode;
};

export type MapFeatureWithLayerSpec = {
  id: string;
  feature: GeoJSON.GeoJSON;
  layer: LayerSpecification;
  marker?: ConsolidatedMapMarker;
};

type MapFeatureContextType = "permanent" | "temporary" | "all";

class MapController {
  private map: MapRef | null = null;

  private markers: MapMarker[] = [];

  private project: MapProject | null = null;

  private mapStyle: keyof typeof MAP_STYLES = "cartographer";

  padding: MapPadding = {
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
  };

  setPadding(updater: (currentPadding: MapPadding) => MapPadding) {
    this.padding = updater(this.padding);
  }

  constructor() {
    mapEmitter.addEventListener("map-mount", (e: CustomEventInit<MapRef>) => {
      this.map = e.detail ?? null;
    });
  }

  async clearAll() {
    await this.waitForMap();
    this.project = null;
    this.markers = [];
    mapEmitter.dispatchEvent(new CustomEvent("set-project", { detail: null }));
    mapEmitter.dispatchEvent(new CustomEvent("set-markers", { detail: [] }));
    mapEmitter.dispatchEvent(
      new CustomEvent("set-geojson-features", {
        detail: { type: "all", features: [] },
      }),
    );
  }

  async setMarkers(markers: MapMarker[]) {
    await this.waitForMap();
    this.markers = markers;
    mapEmitter.dispatchEvent(
      new CustomEvent("set-markers", { detail: markers }),
    );
  }

  private async waitForMap() {
    while (!this.map?.loaded || !this.map?.frameReady) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async getMapBounds() {
    await this.waitForMap();
    return this.map?.getBounds();
  }

  async setMapStyle(mapStyle: typeof this.mapStyle) {
    this.mapStyle = mapStyle;
    await this.waitForMap();
    mapEmitter.dispatchEvent(
      new CustomEvent("style-update", { detail: mapStyle }),
    );
  }

  /**
   *
   * @param easingOptions
   * @param offsetY Whether additional padding should be added to move the destination
   * to the upper center of the screen as opposed to the dead center
   */
  async flyTo(easingOptions: CustomEasingOptions, offsetY: boolean = false) {
    // Wait for the map to be mounted
    await this.waitForMap();

    // Fly to the new view state and wait for the duration
    this.map?.flyTo({
      ...easingOptions,
      padding: {
        ...this.padding,
        bottom: this.padding.bottom + (offsetY ? window.innerHeight / 4 : 0),
      },
    });
    await new Promise((resolve) => setTimeout(resolve, easingOptions.duration));
  }

  async flyToBounds(bounds: LngLatBounds, duration: number = 1000) {
    await this.waitForMap();
    this.map?.fitBounds(bounds, {
      duration: duration,
      padding: this.padding,
    });
    await new Promise((resolve) => setTimeout(resolve, duration));
  }

  async closeMarker(marker: MapMarker | string | null) {
    await this.waitForMap();

    if (!marker) return;

    console.log("Closing marker", marker);
    let markerId;

    if (typeof marker === "string") {
      markerId = marker;
    } else {
      markerId = marker.ephemeralId;
    }

    this.markers = this.markers.filter((m) => m.ephemeralId !== markerId);
    console.log("Updated markers", this.markers);

    mapEmitter.dispatchEvent(
      new CustomEvent("set-markers", {
        detail: this.markers,
      }),
    );
  }

  async openMarker(marker: MapMarker<AppleMapsPlace> | string | null) {
    await this.waitForMap();

    if (!marker) {
      mapEmitter.dispatchEvent(
        new CustomEvent("open-marker", { detail: null }),
      );
      return;
    }

    if (typeof marker === "string") {
      // Check the current markers (usually search results)
      let targetMarker = this.markers.find((m) => m.ephemeralId === marker);
      // Also check the project pins (permenent pins)
      if (!targetMarker) {
        const pin = this.project?.pins.find((p) => p.id === marker);
        if (pin) {
          targetMarker = projectPinToMarker(pin);
        }
      }
      if (targetMarker) {
        marker = targetMarker;
      } else {
        throw new Error("Marker not found");
      }
    }
    // Dispatch the event to set the markers
    mapEmitter.dispatchEvent(
      new CustomEvent("open-marker", { detail: marker }),
    );
  }

  async setProject(project?: MapProject | null) {
    await this.waitForMap();
    this.project = project ?? null;
    mapEmitter.dispatchEvent(
      new CustomEvent("set-project", { detail: project }),
    );
  }

  async setFeatures(
    type: MapFeatureContextType,
    // TODO: update to feature type
    features: MapFeatureWithLayerSpec[],
  ) {
    await this.waitForMap();
    console.log("Setting geojson features", type, features);
    mapEmitter.dispatchEvent(
      new CustomEvent("set-geojson-features", { detail: { type, features } }),
    );
  }

  async resetMapRotation() {
    await this.waitForMap();

    this.map?.flyTo({ bearing: 0, duration: 500 });
  }

  async zoomIn() {
    await this.waitForMap();
    this.map?.zoomIn({ duration: 250 });
  }

  async zoomOut() {
    await this.waitForMap();
    this.map?.zoomOut({ duration: 250 });
  }
}

export const mapController = new MapController();

export default function GlobalAppMap() {
  const map = useRef<MapRef>(null);

  const [project, setProject] = useState<MapProject | null>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [openMarker, setOpenMarker] = useState<MapMarker | null>(null);
  const [openMarkerPopupBounds, setOpenMarkerPopupBounds] = useState<{
    left: number | undefined;
    top: number | undefined;
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    transformOrigin: string | undefined;
  } | null>(null);
  const openMarkerRef = useRef<HTMLDivElement>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES['light_simple']);
  const [mapProjection, setMapProjection] = useState<"mercator" | "globe">(
    "globe",
  );

  const [temporaryFeatures, setTemporaryFeatures] = useState<
    MapFeatureWithLayerSpec[]
  >([]);
  const [permanentFeatures, setPermanentFeatures] = useState<
    MapFeatureWithLayerSpec[]
  >([]);

  const mapZoomStartEndListener = (e: { type: string }) => {
    if (e.type === "zoomstart" || e.type === "movestart") {
      openMarkerRef.current?.classList.add("scale-30", "pointer-events-none");
    } else if (e.type === "zoomend" || e.type === "moveend") {
      openMarkerRef.current?.classList.remove(
        "scale-30",
        "pointer-events-none",
      );
    }
  };

  const mapRotationListener = (e: { target: MapRef; type: "rotate" }) => {
    const map = e.target;
    projectEventReceiver.didUpdateMapRotation(map.getBearing());
  };

  useEffect(() => {
    console.log("Project updated in map component:", project);
    console.log("Open marker:", openMarker);
    if (openMarker && project && !openMarker.id) {
      // Update style for open marker if it overlaps with an existing pin
      // But has not been added to the project yet
      const overlappingPin =
        project.pins.find(
          (p) => p.mapboxFeatureId === openMarker.mapboxFeatureId,
        ) ??
        project.pins.find(
          (p) => p.appleMapsMuid === openMarker.appleMapsPlace?.muid,
        );
      if (overlappingPin) {
        // For now just update the color
        // TODO: update icon and other style attributes as well
        setOpenMarker((o) => ({
          ...o!,
          customColor: overlappingPin.styleData?.iconColor,
        }));
      }
    }

    const mapZoomThrottler = _.throttle(zoomListener as any, 250);
    const mapRotationThrottler = _.throttle(mapRotationListener as any, 50);

    const unsubscribe = () => {
      map.current?.off("zoom", mapZoomThrottler);
      map.current?.off("zoomstart", mapZoomStartEndListener);
      map.current?.off("zoomend", mapZoomStartEndListener);
      map.current?.off("movestart", mapZoomStartEndListener);
      map.current?.off("moveend", mapZoomStartEndListener);
      map.current?.off("rotate", mapRotationThrottler);
    };

    if (!project) {
      unsubscribe();
    } else {
      map.current?.on("zoom", mapZoomThrottler);
      map.current?.on("zoomstart", mapZoomStartEndListener);
      map.current?.on("zoomend", mapZoomStartEndListener);
      map.current?.on("movestart", mapZoomStartEndListener);
      map.current?.on("moveend", mapZoomStartEndListener);
      map.current?.on("rotate", mapRotationThrottler);
    }

    return () => {
      unsubscribe();
    };
  }, [project]);

  const consolidatedPins = React.useMemo<
    {
      lngLat: [number, number];
      pins: MapPin[];
      key: string;
    }[]
  >(() => {
    if (!project) return [];
    if (!map.current) return [];

    const pinGroups: MapPin[][] = [];

    for (const pin of project.pins ?? []) {
      let foundGroup = false;
      for (const group of pinGroups) {
        for (const memberPin of group) {
          // Calculating distance with turf accounts for earth curvature
          // more consistant as opposed to lat/long delta which varies
          const dist = distance(
            point([pin.longitude, pin.latitude]),
            point([memberPin.longitude, memberPin.latitude]),
            { units: "kilometers" },
          );
          // Fancy grouping formula, using exponential decay based on zoom level
          if (dist < 450 * Math.pow(0.43, (zoomLevel - 2) / 1.4)) {
            group.push(pin);
            foundGroup = true;
            break;
          }
        }
        if (foundGroup) break;
      }
      if (foundGroup) continue;
      // If not added to any group, create a new group
      pinGroups.push([pin]);
    }

    // Iterate through pin groups to create consolidated positions based on center of bounding box
    const consolidatedGroups: {
      lngLat: [number, number];
      pins: MapPin[];
      key: string;
    }[] = [];
    for (const group of pinGroups) {
      consolidatedGroups.push({
        lngLat: center(points(group.map((p) => [p.longitude, p.latitude])))
          .geometry.coordinates as [number, number],
        pins: group,
        // Prevents unecessary re-renders
        key: `pin-group-` + group.map((p) => p.id).join("-"),
      });
    }

    return consolidatedGroups;
  }, [project, zoomLevel]);

  const zoomToPinGroup = (pins: MapPin[]) => async () => {
    if (!map.current) return;
    if (pins.length === 0) return;

    if (pins.length === 1) {
      // Just fly to the single pin
      mapController.flyTo({
        center: [pins[0].longitude, pins[0].latitude],
        zoom: 14,
        duration: 1000,
      });
      return;
    }

    // Calculate bounds and add padding
    const bounds = padBbox(
      bbox(points(pins.map((p) => [p.longitude, p.latitude]))),
      0.1,
    );

    mapController.flyToBounds(
      new LngLatBounds([bounds[0], bounds[1]], [bounds[2], bounds[3]]),
      1000,
    );
  };

  const zoomListener = (e: { target: MapRef; type: "zoom" }) => {
    const map = e.target;

    setZoomLevel(map.getZoom());
  };

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (map.current?.frameReady) {
        // Map (frame) is ready - doesn't guarentee all resources are loaded
        mapEmitter.dispatchEvent(
          new CustomEvent("map-mount", { detail: map.current }),
        );
        clearInterval(interval);

        // Check if map is actually loaded
        // Sources can only be added after the map is loaded
        setIsMapLoaded(map.current.loaded());
        map.current.once("load", () => {
          setIsMapLoaded(true);
        });
      }
    }, 100);

    const listenerSetMarkers = (e: CustomEventInit<MapMarker[]>) => {
      if (e.detail) setMarkers(e.detail);
    };

    mapEmitter.addEventListener("set-markers", listenerSetMarkers);

    const listenerOpenMarker = (e: CustomEventInit<MapMarker | null>) => {
      setOpenMarker(e.detail ?? null);
      if (!e.detail) return;
      const overflow = updateOpenMarkerPopupBounds(e.detail, map.current);
      if (overflow) {
        mapController.flyTo(
          {
            center: [e.detail.coordinate.lng, e.detail.coordinate.lat],
            animate: true,
            duration: 1000,
          },
          true,
        );
      }
    };

    mapEmitter.addEventListener("open-marker", listenerOpenMarker);

    const listenerSetProject = (e: CustomEventInit<MapProject>) => {
      // Set the project
      setProject(e.detail ?? null);
      console.log("Set project in map:", e.detail);
      // Set the permanent features (routes)
      if (e.detail) {
        const routeFeatures: MapFeatureWithLayerSpec[] = e.detail.routes
          .map((r) =>
            hereMultimodalRouteSectionsToFeatures(
              r.id,
              (r.segments ?? []) as HereMultimodalRouteSection[],
              false,
              r.styleData ?? undefined,
            ),
          )
          .flat();
        setPermanentFeatures(routeFeatures);

        // Update style for open marker if it overlaps with an existing pin
        console.log(e.detail.pins);
      }
    };

    mapEmitter.addEventListener("set-project", listenerSetProject);

    const listenerSetGeoJSONFeatures = (
      e: CustomEventInit<{
        type: MapFeatureContextType;
        features: MapFeatureWithLayerSpec[];
      }>,
    ) => {
      if (e.detail?.type === "permanent" || e.detail?.type === "all") {
        setPermanentFeatures(e.detail.features);
      }
      if (e.detail?.type === "temporary" || e.detail?.type === "all") {
        setTemporaryFeatures(e.detail.features);
      }
    };

    mapEmitter.addEventListener(
      "set-geojson-features",
      listenerSetGeoJSONFeatures,
    );

    const listenerUpdateMapStyle = (e: CustomEventInit<keyof typeof MAP_STYLES>) => {
      if (e.detail) setMapStyle(MAP_STYLES[e.detail]);
    };

    mapEmitter.addEventListener("style-update", listenerUpdateMapStyle);

    return () => {
      clearInterval(interval);
      mapEmitter.removeEventListener("set-markers", listenerSetMarkers);
      mapEmitter.removeEventListener("open-marker", listenerOpenMarker);
      mapEmitter.removeEventListener("set-project", listenerSetProject);
      // Delete the current map instance from the mapController
      mapEmitter.dispatchEvent(new CustomEvent("map-mount", { detail: null }))
    };
  }, [map]);

  useEffect(() => {
    const currentMap = map.current;

    const moveListener = (e: any) => {
      if (openMarker) {
        updateOpenMarkerPopupBounds(openMarker, e.target);
      }
    };

    currentMap?.on("move", moveListener);

    return () => {
      currentMap?.off("move", moveListener);
    };
  }, [map, openMarker]);

  const handleMapClick = (e: MapMouseEvent) => {
    // Clear the open marker
    setOpenMarker(null);

    const feature = map?.current?.queryRenderedFeatures(e.point)?.[0];

    if (!feature) return;

    console.log(feature);
    if (feature.layer?.type == "line") {
      // Open a route segment
      const id = feature.layer?.id?.substring(0, 36);
      const route = project?.routes.find((f) => f.id === id);
      if (route) {
        projectEventReceiver.didClickExistingRoute(route);
      }
      return;
    }

    // Create a marker from the feature
    const marker = renderFeatureToMarker(feature, e);
    // Match the marker id to the project pin id if it exists
    marker.id =
      project?.pins.find((p) => p.mapboxFeatureId === marker.mapboxFeatureId)
        ?.id ?? marker.id;
    mapController.openMarker(marker);
  };

  const handleMarkerClick = (
    e: React.MouseEvent<HTMLDivElement>,
    marker: MapMarker,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear the open marker
    setOpenMarker(null);

    mapController.openMarker(marker);
  };

  const handlePinClick = (
    e: React.MouseEvent<HTMLDivElement>,
    pin: Prisma.PinGetPayload<any>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear the open marker
    setOpenMarker(null);

    mapController.openMarker(projectPinToMarker(pin));
  };

  const updateOpenMarkerPopupBounds = (
    marker: MapMarker,
    mapRef: MapRef | null,
  ) => {
    if (!mapRef) return null;
    const point = mapRef.project(marker.coordinate);
    if (!point || !mapRef) return null;

    const padding = {
      top: 16 + mapController.padding.top,
      left: 16 + mapController.padding.left,
      right: 16 + mapController.padding.right,
      bottom: 16 + mapController.padding.bottom,
    };

    const canvasSize = {
      width: mapRef.getContainer().clientWidth,
      height: mapRef.getContainer().clientHeight,
    };
    const size = {
      width: 300,
      height: Math.max(
        MAP_UI_POPOVER_MIN_HEIGHT,
        (canvasSize.height - padding.top - padding.bottom) / 2,
      ),
    };

    // If true, the popup will be placed above the marker
    const placedAbove =
      point.y + size.height + padding.bottom > canvasSize.height;
    let x = point.x - size.width / 2;
    let y = placedAbove ? point.y - size.height : point.y;
    if (MAP_UI_POPOVER_STAY_IN_FRAME) {
      // Clamp x and y to stay within the map frame with padding
      x = Math.min(
        Math.max(x, padding.left),
        canvasSize.width - size.width - padding.right,
      );
      y = Math.min(
        Math.max(y, padding.top - 30),
        canvasSize.height - size.height - padding.bottom + 30,
      );
    }

    const overflow = {
      top: y - padding.top,
      left: point.x - size.width / 2 - padding.left,
      right: canvasSize.width - (point.x + size.width / 2) - padding.right,
      bottom: canvasSize.height - y - size.height - padding.bottom,
    };

    const transformOrigin = placedAbove ? "bottom center" : "top center";

    // Update popup position directly through ref (needs to be fast)
    openMarkerRef.current?.style.setProperty("left", `${x}px`);
    openMarkerRef.current?.style.setProperty("top", `${y}px`);
    openMarkerRef.current?.style.setProperty(
      "transform-origin",
      transformOrigin,
    );

    // Configure rest of style through react state (slower to update)
    setOpenMarkerPopupBounds({
      // These are okay to be set when ref doesn't exist yet (as initial render)
      left: openMarkerRef.current ? undefined : x,
      top: openMarkerRef.current ? undefined : y,
      width: size.width,
      height: size.height - 30,
      marginTop: placedAbove ? 0 : 30,
      marginBottom: placedAbove ? 30 : 0,
      transformOrigin: openMarkerRef.current ? undefined : transformOrigin,
    });

    return Object.values(overflow).some((value) => value < 0);
  };

  return (
    <div className="fixed size-full">
      {/* <div className="absolute top-navbar text-red-500 left-[300px] z-20">
        Zoom: {zoomLevel.toFixed(2)}
      </div> */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        ref={map}
        initialViewState={{
          zoom: 1,
          pitch: 0,
          bearing: 0,
        }}
        onClick={handleMapClick}
        interactive={true}
        projection={mapProjection}
        mapStyle={mapStyle}
      >
        {[
          ...markers,
          !markers.some((m) => m.ephemeralId === openMarker?.ephemeralId) &&
          !openMarker?.id
            ? openMarker
            : null,
        ]
          .filter((m) => m !== null)
          .map((marker) => (
            <Marker
              className=""
              style={{
                zIndex:
                  openMarker?.ephemeralId === marker.ephemeralId ? 25 : 20,
              }}
              key={marker.ephemeralId}
              latitude={marker.coordinate.lat}
              longitude={marker.coordinate.lng}
            >
              {marker.appleMapsPlace ? (
                <div
                  className={`tc-pin-on-map relative expand-from-origin rounded-full transition-transform cursor-pointer z-10 ${
                    openMarker?.ephemeralId === marker.ephemeralId
                      ? "scale-140 tc-marker-caret"
                      : ""
                  } ${
                    openMarker?.ephemeralId &&
                    openMarker.ephemeralId !== marker.ephemeralId
                      ? "opacity-50 scale-80"
                      : ""
                  }`}
                  onClick={(e) => handleMarkerClick(e, marker)}
                >
                  <MapPlaceIcon
                    appleMapsCategoryId={marker.appleMapsPlace.categoryId}
                    customColor={marker.customColor}
                    border={true}
                  />
                </div>
              ) : (
                <div className="bg-red-500 rounded-full size-4"></div>
              )}
            </Marker>
          ))}

        {consolidatedPins.map((group, _) => (
          <Marker
            key={group.key}
            longitude={group.lngLat[0]}
            latitude={group.lngLat[1]}
          >
            {group.pins.length > 1 ? (
              <PinGroup
                key={group.key}
                pins={group.pins}
                onClick={zoomToPinGroup(group.pins)}
              />
            ) : (
              <div
                onClick={(e) => handlePinClick(e, group.pins[0])}
                key={group.key}
                className={`relative tc-pin-on-map rounded-full transition-transform cursor-pointer z-10 ${
                  openMarker?.id === group.pins[0].id
                    ? "scale-140 tc-marker-caret"
                    : ""
                } ${markers.length > 0 ? "scale-80" : ""}`}
              >
                <MapPlaceIcon
                  border={true}
                  customColor={group.pins[0].styleData?.iconColor}
                  tcCategoryId={group.pins[0].styleData?.iconId}
                />
              </div>
            )}
          </Marker>
        ))}
        {/* {project?.pins.map((pin) => (
          <Marker
            className=""
            key={pin.id}
            latitude={pin.latitude}
            longitude={pin.longitude}
          >
            <div
              onClick={(e) => handlePinClick(e, pin)}
              className={`bg-white fade-in relative border-white shadow-lg rounded-full transition-transform cursor-pointer z-10 ${
                openMarker?.id === pin.id ? "scale-140 tc-marker-caret" : ""
              } ${markers.length > 0 ? "scale-80" : ""}`}
            >
              <MapPlaceIcon
                customColor={pin.styleData?.iconColor}
                tcCategoryId={pin.styleData?.iconId}
              />
            </div>
          </Marker>
        ))} */}

        {isMapLoaded &&
          [
            { type: "temporary", features: temporaryFeatures },
            { type: "permanent", features: permanentFeatures },
          ].map((featureset) => (
            <Fragment key={featureset.type}>
              {featureset?.features?.map((feature) => {
                feature.layer.paint = {
                  ...feature.layer.paint,
                  "line-opacity":
                    featureset.type == "permanent" &&
                    temporaryFeatures.length > 0 &&
                    !temporaryFeatures.find((f) => f.id === feature.id)
                      ? 0.2
                      : 1.0,
                };

                if (
                  featureset.type == "temporary" &&
                  permanentFeatures.find((f) => f.id === feature.id)
                ) {
                  // Automatically remove temporary features that are already permanent
                  // We'll just not dim them instead of adding them again
                  return null;
                }

                const isHighlighted =
                  featureset.type == "temporary" ||
                  temporaryFeatures.find((f) => f.id === feature.id);

                return (
                  <Source
                    key={featureset.type + "-" + feature.id}
                    type="geojson"
                    data={feature.feature}
                  >
                    <Layer
                      id={feature.id}
                      type={feature.layer.type as any}
                      paint={{
                        ...feature.layer.paint,
                        "line-width": isHighlighted ? 8 : zoomLevel > 5 ? 6 : 4,
                      }}
                      layout={feature.layer.layout as any}
                    />
                  </Source>
                );
              })}
              {featureset.features
                .filter((f) => f.marker)
                .map((feature) => (
                  <Marker
                    key={feature.id + "-" + featureset.type + "-feature-marker"}
                    latitude={feature.marker!.coordinate.lat}
                    longitude={feature.marker!.coordinate.lng}
                  >
                    {feature.marker!.element}
                  </Marker>
                ))}
            </Fragment>
          ))}
      </Map>
      {openMarker && openMarkerPopupBounds && project && (
        <div
          className="absolute z-40 expand-from-origin transition-[scale]"
          style={{
            ...openMarkerPopupBounds,
          }}
          ref={openMarkerRef}
          key={openMarker.ephemeralId}
        >
          <MapPlacePopup
            onClose={() => setOpenMarker(null)}
            onMarkerUpdate={(marker) => setOpenMarker(marker)}
            marker={openMarker}
            project={project}
            key={openMarker.ephemeralId}
          />
        </div>
      )}
    </div>
  );
}
