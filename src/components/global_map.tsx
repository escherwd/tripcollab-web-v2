"use client";

import Map, { MapRef, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { MapState, MapStateProps } from "react-map-gl";
import {
  EasingOptions,
  LngLatBounds,
  LngLatLike,
  PaddingOptions,
} from "mapbox-gl";
import { AppleMapsPlaceResult } from "@/app/api/maps/apple_maps";
import MapPlaceIcon from "./map_place_icon";

// Create a global event emitter for the map
const mapEmitter = new EventTarget();

export type CustomEasingOptions = EasingOptions & { center?: [number, number] };
export type MapPadding = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type MapMarker = {
  id: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  appleMapsPlace?: AppleMapsPlaceResult;
};

class MapController {
  private map: MapRef | null = null;

  private markers: MapMarker[] = [];

  private padding: MapPadding = {
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

  async setMarkers(markers: MapMarker[]) {
    await this.waitForMap();
    this.markers = markers;
    mapEmitter.dispatchEvent(
      new CustomEvent("set-markers", { detail: markers })
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
}

export const mapController = new MapController();

export default function GlobalAppMap() {
  const map = useRef<MapRef>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (map.current?.frameReady) {
        mapEmitter.dispatchEvent(
          new CustomEvent("map-mount", { detail: map.current })
        );
        clearInterval(interval);
      }
    }, 100);

    mapEmitter.addEventListener(
      "set-markers",
      (e: CustomEventInit<MapMarker[]>) => {
        if (e.detail) setMarkers(e.detail);
      }
    );
  }, []);

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
        interactive={true}
        projection={"globe"}
        mapStyle="mapbox://styles/escherwd/cme0ipkvn00og01sp60vr2cjt"
      >
        {markers.map((marker) => (
          <Marker
            className="fade-in"
            key={marker.id}
            latitude={marker.coordinate.lat}
            longitude={marker.coordinate.lng}
          >
            {marker.appleMapsPlace ? (
              <div className="bg-white border-2 border-white shadow-md rounded-full">
                <MapPlaceIcon
                  categoryId={marker.appleMapsPlace.categoryId}
                  type="ADDRESS"
                />
              </div>
            ) : (
              <div className="bg-red-500 rounded-full size-4"></div>
            )}
          </Marker>
        ))}
      </Map>
    </div>
  );
}
