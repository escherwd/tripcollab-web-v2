"use client";

import { useEffect } from "react";
import { mapController } from "./global_map";
import { EasingOptions } from "mapbox-gl";

export default function HomePageMapAnimator() {
  const windowHeight = () =>
    typeof window !== "undefined" ? window.innerHeight : 0;

  useEffect(() => {
    let callOffAnimation = false;
    let interval: NodeJS.Timeout | null = null;

    // Reset the padding
    mapController.setPadding(() => ({
      left: 0,
      right: 0,
      bottom: 0,
      top: (windowHeight() * 2) / 3,
    }));

    mapController.setMarkers([]);
    
    (async () => {
      const viewState: EasingOptions & { center: [number, number] } = {
        center: [-122.4, 37.8],
        zoom: 4.98,
        bearing: -14.2,
        pitch: 80.0,
        duration: 3000,
      };

      await mapController.clearAll();

      await mapController.flyTo(viewState);

      if (callOffAnimation) return;

      interval = setInterval(() => {
        viewState.center[0] += 0.01;

        mapController.flyTo({
          ...viewState,
          duration: 0,
        });
      }, 1000 / 30);
    })();

    return () => {
      callOffAnimation = true;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return <div className="fixed size-full" />;
}
