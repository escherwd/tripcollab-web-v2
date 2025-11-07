"use client";

import Map, { Layer, MapRef, Marker, Source } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  EasingOptions,
  GeoJSONFeature,
  LayerSpecification,
  LngLatBounds,
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
import { projectController } from "@/app/utils/controllers/project_controller";

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
};

export type MapProject = Prisma.ProjectGetPayload<{
  include: { pins: true; user: true, routes: true };
}>;

export type MapPin = Prisma.PinGetPayload<any>;

export type ConsolidatedMapMarker = {
  coordinate: {
    lat: number;
    lng: number
  },
  element: React.ReactNode
}

export type MapFeatureWithLayerSpec = {
  id: string;
  feature: GeoJSON.GeoJSON;
  layer: LayerSpecification;
  marker?: ConsolidatedMapMarker;
}

type MapFeatureContextType = "permanent" | "temporary" | "all";

class MapController {
  private map: MapRef | null = null;

  private markers: MapMarker[] = [];

  private project: MapProject | null = null;

  padding: MapPadding = {
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
  };

  setPadding(padding: MapPadding) {
    this.padding = padding;
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
    while (!this.map) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async getMapBounds() {
    await this.waitForMap();
    return this.map?.getBounds();
  }

  async flyTo(easingOptions: CustomEasingOptions) {
    // Wait for the map to be mounted
    await this.waitForMap();
    // Update padding values if they're included here
    if (easingOptions.padding) {
      this.padding = easingOptions.padding as MapPadding;
    }
    // Fly to the new view state and wait for the duration
    this.map?.flyTo({
      ...easingOptions,
      padding: this.padding,
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
}

export const mapController = new MapController();

export default function GlobalAppMap() {
  const map = useRef<MapRef>(null);

  const [project, setProject] = useState<MapProject | null>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [openMarker, setOpenMarker] = useState<MapMarker | null>(null);
  const [openMarkerPopupBounds, setOpenMarkerPopupBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    transformOrigin: string;
  } | null>(null);

  const mapStyles = [
    "mapbox://styles/escherwd/cme0ipkvn00og01sp60vr2cjt",
    "mapbox://styles/mapbox/standard",
  ];

  const [mapStyle, setMapStyle] = useState<string>(mapStyles[0]);

  const [temporaryFeatures, setTemporaryFeatures] = useState<MapFeatureWithLayerSpec[]>(
    [],
  );
  const [permanentFeatures, setPermanentFeatures] = useState<MapFeatureWithLayerSpec[]>(
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (map.current?.frameReady) {
        mapEmitter.dispatchEvent(
          new CustomEvent("map-mount", { detail: map.current }),
        );
        clearInterval(interval);
      }
    }, 100);

    const listenerSetMarkers = (e: CustomEventInit<MapMarker[]>) => {
      if (e.detail) setMarkers(e.detail);
    };

    mapEmitter.addEventListener("set-markers", listenerSetMarkers);

    const listenerOpenMarker = (e: CustomEventInit<MapMarker | null>) => {
      setOpenMarker(e.detail ?? null);
      if (!e.detail) return;
      const overflow = updateOpenMarkerPopupBounds(e.detail);
      if (overflow) {
        map.current?.flyTo({
          padding: map.current?.getPadding(),
          center: e.detail.coordinate,
          animate: true,
          duration: 1000,
        });
      }
    };

    mapEmitter.addEventListener("open-marker", listenerOpenMarker);

    const listenerSetProject = (e: CustomEventInit<MapProject>) => {
      // Set the project
      setProject(e.detail ?? null);
      // Set the permanent features (routes)
      if (e.detail) {
        const routeFeatures: MapFeatureWithLayerSpec[] = e.detail.routes
          .map((r) => hereMultimodalRouteSectionsToFeatures(r.id, (r.segments ?? []) as HereMultimodalRouteSection[], false)).flat();
        setPermanentFeatures(routeFeatures);
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

    return () => {
      clearInterval(interval);
      mapEmitter.removeEventListener("set-markers", listenerSetMarkers);
      mapEmitter.removeEventListener("open-marker", listenerOpenMarker);
      mapEmitter.removeEventListener("set-project", listenerSetProject);
    };
  }, [map]);

  useEffect(() => {
    const currentMap = map.current;

    const moveListener = () => {
      if (openMarker) {
        updateOpenMarkerPopupBounds(openMarker);
      }
    };

    currentMap?.on("move", () => {
      moveListener();
    });

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
    if (feature.layer?.type == 'line') {
      // Open a route segment
      const id = feature.layer?.id?.substring(0, 36);
      const route = project?.routes.find(f => f.id === id);
      if (route) {
        projectController.openExistingRoute(route)
      }
      return
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

  const updateOpenMarkerPopupBounds = (marker: MapMarker) => {
    const point = map.current?.project(marker.coordinate);
    if (!point || !map.current) return null;
    const padding = {
      top: 16 + mapController.padding.top,
      left: 16 + mapController.padding.left,
      right: 16 + mapController.padding.right,
      bottom: 16 + mapController.padding.bottom,
    };

    const canvasSize = {
      width: map.current?.getContainer().clientWidth,
      height: map.current?.getContainer().clientHeight,
    };
    const size = {
      width: 300,
      height: (canvasSize.height - padding.top - padding.bottom) / 2,
    };

    // If true, the popup will be placed above the marker
    const placedAbove =
      point.y + size.height + padding.bottom > canvasSize.height;
    let x = point.x - size.width / 2;
    x = Math.min(
      Math.max(x, padding.left),
      canvasSize.width - size.width - padding.right,
    );
    let y = placedAbove ? point.y - size.height : point.y;
    y = Math.min(
      Math.max(y, padding.top - 30),
      canvasSize.height - size.height - padding.bottom + 30,
    );

    const overflow = {
      top: y - padding.top,
      left: point.x - size.width / 2 - padding.left,
      right: canvasSize.width - (point.x + size.width / 2) - padding.right,
      bottom: canvasSize.height - y - size.height - padding.bottom,
    };

    setOpenMarkerPopupBounds({
      left: x,
      top: y,
      width: size.width,
      height: size.height - 30,
      marginTop: placedAbove ? 0 : 30,
      marginBottom: placedAbove ? 30 : 0,
      transformOrigin: placedAbove ? "bottom center" : "top center",
    });

    return Object.values(overflow).some((value) => value < 0);
  };

  return (
    <div className="fixed size-full bg-gray-900">
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
        projection={"globe"}
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
                  className={`bg-white expand-from-origin relative border-2 border-white shadow-md rounded-full transition-transform cursor-pointer ${openMarker?.ephemeralId === marker.ephemeralId
                    ? "scale-140 tc-marker-caret"
                    : ""
                    } ${openMarker?.ephemeralId &&
                      openMarker.ephemeralId !== marker.ephemeralId
                      ? "opacity-50 scale-80"
                      : ""
                    }`}
                  onClick={(e) => handleMarkerClick(e, marker)}
                >
                  <MapPlaceIcon
                    appleMapsCategoryId={marker.appleMapsPlace.categoryId}
                  />
                </div>
              ) : (
                <div className="bg-red-500 rounded-full size-4"></div>
              )}
            </Marker>
          ))}
        {project?.pins.map((pin) => (
          <Marker
            className=""
            key={pin.id}
            latitude={pin.latitude}
            longitude={pin.longitude}
          >
            <div
              onClick={(e) => handlePinClick(e, pin)}
              className={`bg-white fade-in relative border-2 border-white shadow-md rounded-full transition-transform cursor-pointer z-10 ${openMarker?.id === pin.id ? "scale-140 tc-marker-caret" : ""
                } ${markers.length > 0 ? "scale-80" : ""}`}
            >
              <MapPlaceIcon tcCategoryId={(pin.styleData as any)["iconId"]} />
            </div>
          </Marker>
        ))}
        {
          [{ type: "temporary", features: temporaryFeatures }, { type: "permanent", features: permanentFeatures }].map((featureset) => <Fragment key={featureset.type}>
            {featureset.features.map((feature) => {
              feature.layer.paint = {
                ...feature.layer.paint,
                "line-opacity": (featureset.type == "permanent" && temporaryFeatures.length > 0) ? 0.2 : 1.0,
              };
              return (
                <Source key={featureset.type + "-" + feature.id} type="geojson" data={feature.feature}>
                  <Layer
                    {...feature.layer}
                  />
                </Source>
              )
            })}
            {
              featureset.features.filter(f => f.marker).map((feature) => (
                <Marker key={feature.id + "-" + featureset.type + "-feature-marker"} latitude={feature.marker!.coordinate.lat} longitude={feature.marker!.coordinate.lng}>
                  {feature.marker!.element}
                </Marker>
              ))
            }
          </Fragment>)
        }

      </Map>
      {openMarker && openMarkerPopupBounds && project && (
        <div
          className="absolute z-40 expand-from-origin"
          style={{
            ...openMarkerPopupBounds,
          }}
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
