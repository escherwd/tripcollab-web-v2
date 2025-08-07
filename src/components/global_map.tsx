'use client'

import Map, { MapRef } from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from "react";
import { MapState, MapStateProps } from "react-map-gl";
import { EasingOptions, PaddingOptions } from "mapbox-gl";

// Create a global event emitter for the map
export const mapEmitter = new EventTarget()

class MapController {
    private mapMounted: boolean = false

    constructor() {
        mapEmitter.addEventListener('map-mount', (_) => {
            this.mapMounted = true
        })
    }

    async flyTo(easingOptions: EasingOptions & { center?: [number, number] }) {
        while (!this.mapMounted) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        mapEmitter.dispatchEvent(new CustomEvent('map-view-state-change', {
            detail: {
                ...easingOptions,
            }
        }))
        await new Promise(resolve => setTimeout(resolve, easingOptions.duration))
    }
}
    
export const mapController = new MapController()


export default function GlobalAppMap() {

    const map = useRef<MapRef>(null)

    const eventMapViewStateChange = (e: CustomEventInit<EasingOptions>) => {

        map.current?.flyTo({
            ...e.detail,
        })
    }


    useEffect(() => {

        mapEmitter.addEventListener('map-view-state-change', eventMapViewStateChange)

        const interval = setInterval(() => {
            if (map.current?.frameReady) {
                mapEmitter.dispatchEvent(new CustomEvent('map-mount'))
                clearInterval(interval)
            }
        }, 100)
        
        

        return () => {
            mapEmitter.removeEventListener('map-view-state-change', eventMapViewStateChange)
        }
    }, [map])



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
                projection={'globe'}
                mapStyle="mapbox://styles/escherwd/cme0ipkvn00og01sp60vr2cjt"
            />
        </div>
    );
}