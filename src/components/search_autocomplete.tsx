"use client";

import { AppleMapsAutocompleteResponse } from "@/app/api/maps/autocomplete";
import MapPlaceIcon from "./map_place_icon";
import { MapProject } from "./global_map";
import {
  RiCheckFill,
  RiCheckLine,
  RiRoadMapFill,
  RiRoadMapLine,
} from "@remixicon/react";
import { DateTime } from "luxon";

export default function SearchAutocompleteComponent({
  results,
  project,
  onResultClick,
}: {
  results: AppleMapsAutocompleteResponse | null;
  project: MapProject;
  onResultClick: (
    result: AppleMapsAutocompleteResponse["results"][number]
  ) => void;
}) {
  return (
    <div
      className="tc-panel w-full !overflow-scroll duration-300 transition-all relative bg-white rounded-lg shadow-lg"
      style={{
        height: results ? "256px" : "0px",
        opacity: results ? "1" : "0",
      }}
    >
      {results?.results.map((result) => {
        const localPin = result.localProjectId
          ? project.pins.find((pin) => pin.id === result.localProjectId)
          : undefined;

        return (
          <button
            key={result.muid}
            onClick={() => {
              onResultClick(result);
            }}
            className="px-4 py-1.5 min-h-12 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 flex gap-4 items-center text-left w-full"
          >
            <div className="size-8 shrink-0 relative">
              <MapPlaceIcon
                tcCategoryId={localPin?.styleData?.iconId}
                customColor={localPin?.styleData?.iconColor}
                appleMapsCategoryId={
                  localPin?.extendedMetadata?.categoryId ??
                  result.place?.categoryId ??
                  result.type
                }
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-sm line-clamp-2">
                {localPin?.name ?? result.highlight}
              </div>
              {localPin && (
                <div className="flex items-center">
                  <div className="text-xs text-gray-500 py-0.5 pl-2 pr-2.5 mt-0.5 bg-gray-100 rounded-full flex items-center gap-1 whitespace-nowrap w-min">
                    <RiCheckLine className="size-3.5" /> Added
                  </div>
                  {
                    localPin.dateStart && (
                      <span className="text-xs text-gray-500">&nbsp;—&nbsp;{DateTime.fromJSDate(localPin.dateStart).toLocaleString({ day: 'numeric', month: 'short' })}</span>
                    )
                  }
                </div>
              )}
              {result.extra && (
                <div className="text-xs text-gray-500">{result.extra}</div>
              )}
            </div>
          </button>
        );
      })}
      {results?.results.length === 0 && (
        <div className="px-4 py-2 min-h-14 flex items-center justify-center text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
}
