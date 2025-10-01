"use client";

import { AppleMapsSearchResult, searchAppleMaps } from "@/app/api/maps/search";
import { useEffect, useMemo, useRef, useState } from "react";
import { mapController, MapProject } from "./global_map";
import { LngLatBounds } from "mapbox-gl";
import {
  AppleMapsAutocompleteResponse,
  autocompleteAppleMaps,
} from "@/app/api/maps/autocomplete";
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import MapPlaceIcon from "./map_place_icon";
import { MdRefresh } from "react-icons/md";
import PanelIconButton from "./panel_icon_button";
import { DateTime } from "luxon";
import SearchAutocompleteComponent from "./search_autocomplete";

export default function GeneralSearchComponent({
  project,
  hide,
}: {
  project?: MapProject | null;
  hide?: boolean;
}) {
  const currentQuery = useRef("");

  const [searchQuery, setSearchQuery] = useState("");

  // This exists to prevent autocomplete from firing when a full search is performed (on enter key)
  let committedSearchQuery = "";

  const [autocompleteResults, setAutocompleteResults] =
    useState<AppleMapsAutocompleteResponse | null>(null);

  const [searchResults, setSearchResults] =
    useState<AppleMapsSearchResult | null>(null);

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    currentQuery.current = searchQuery;

    (async () => {
      const query = currentQuery.current;

      if (query.length == 0) {
        setAutocompleteResults(null);
        return;
      }

      if (query.length < 3) return;

      // Debounce the request
      await new Promise((resolve) => setTimeout(resolve, 250));
      console.log(currentQuery.current, query);
      if (currentQuery.current != query) return;

      const bounds = await mapController.getMapBounds();
      if (!bounds) return;

      const timestamp = DateTime.now().toMillis();

      const data = await autocompleteAppleMaps(query, {
        lng: bounds.getCenter().lng,
        lat: bounds.getCenter().lat,
        deltaLng: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
        deltaLat: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
      });

      data.timestamp = timestamp;

      // Only update if the timestamp of this request is greater than the timestamp of the current results
      if (
        timestamp > (autocompleteResults?.timestamp ?? 0) &&
        data?.query != committedSearchQuery
      )
        setAutocompleteResults(data);
    })();
  }, [searchQuery]);

  const handleSearch = async (query?: string) => {
    const queryToUse = query ?? searchQuery;
    committedSearchQuery = queryToUse;
    if (queryToUse.trim().length < 3) return;

    const bounds = await mapController.getMapBounds();

    if (!bounds) return;

    setIsSearching(true);

    try {
      const data = await searchAppleMaps(queryToUse, {
        lng: bounds.getCenter().lng,
        lat: bounds.getCenter().lat,
        deltaLng: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
        deltaLat: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
      });

      console.log(data);
      setSearchResults(data);
      setAutocompleteResults(null);

      // Give the padding time to update
      setTimeout(() => {
      if (data.displayMapRegion)
        mapController.flyToBounds(
          new LngLatBounds(
            [data.displayMapRegion.westLng, data.displayMapRegion.southLat],
            [data.displayMapRegion.eastLng, data.displayMapRegion.northLat]
          )
        );
      }, 100);

      mapController.setMarkers(
        data.results.map((result) => {
          const existingPin = project?.pins.find(
            (p) => p.appleMapsMuid === result.muid
          );
          return {
            id: existingPin?.id,
            ephemeralId:
              existingPin?.id ?? result.muid ?? self.crypto.randomUUID(),
            coordinate: result.coordinate,
            appleMapsPlace: result,
          };
        })
      );

      if (data.results.length === 1) {
        handleSearchResultClick(data.results[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery("");
    mapController.setMarkers([]);
  };

  const handleAutocompleteResultClick = (
    result: AppleMapsAutocompleteResponse["results"][number]
  ) => {
    if (result.type == "QUERY") {
      // setSearchQuery(result.highlight);
      handleSearch(result.highlight);
    }
  };

  const handleSearchResultClick = (
    result: AppleMapsSearchResult["results"][number]
  ) => {
    const existingPin = project?.pins.find(
      (p) => p.appleMapsMuid === result.muid
    );
    mapController.openMarker(existingPin?.id ?? result.muid);
  };

  const isShowingResults = useMemo(() => {
    return searchResults && searchResults?.results.length !== 1;
  }, [searchResults]);

  useEffect(() => {
    console.log("isShowingResults", isShowingResults);
    mapController.setPadding({
      top: 64,
      left: isShowingResults ? 8 + 288 + 8 : 0,
      right: 8 + 272 + 8,
      bottom: 0,
    });
  }, [searchResults]);

  return (
    <>
      <div className={`flex flex-col gap-2 absolute top-navbar left-2 w-72 bottom-9 !pointer-events-none [&>*]:pointer-events-auto duration-300 ${hide ? "transition-opacity pointer-events-none opacity-0" : "transition-none"}`}>
        <div className="tc-panel w-full h-12 relative">
          <div className="absolute top-0 left-3.5 right-4 bottom-0 flex gap-2 items-center justify-between pointer-events-none">
            <MagnifyingGlassIcon className="text-gray-400 size-5" />
            <div className="flex-1"></div>
            {isSearching && (
              <MdRefresh className="text-gray-400 size-5 animate-spin" />
            )}
            {!isSearching && searchQuery.length > 0 && (
              <PanelIconButton
                className="pointer-events-auto"
                onClick={clearSearch}
                icon={<XMarkIcon className="size-5" />}
              />
            )}
          </div>
          <input
            type="text"
            className="px-12 focus:outline-gray-300 size-full"
            placeholder="Search for a place"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <SearchAutocompleteComponent results={autocompleteResults} onResultClick={handleAutocompleteResultClick} />

        {isShowingResults && (
          <div
            className="flex-1 flex flex-col tc-panel w-full transition-all duration-300 fade-in overflow-scroll bg-white"
            style={{
              marginTop: autocompleteResults ? "0px" : "-8px",
            }}
          >
            <div className="tc-panel-header">
              <div className="tc-panel-title">
                <span className="whitespace-nowrap">Results for</span>{" "}
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  &quot;{searchResults?.query}&quot;
                </span>
              </div>
              <div>
                <PanelIconButton
                  icon={<ArrowPathIcon />}
                  onClick={() => handleSearch(searchResults?.query)}
                />
              </div>
            </div>
            {searchResults?.results.length === 0 && (
              <div className="px-4 py-6 flex items-center justify-center text-gray-500">
                No results Found.
              </div>
            )}
            <div className="flex-1 overflow-scroll">
              {searchResults?.results.map((result) => (
                <button
                  key={result.muid}
                  className="flex gap-2 py-3.5 px-4 items-stretch relative cursor-pointer hover:bg-gray-100 focus:bg-gray-100 transition-colors w-full text-left"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <div className="absolute bottom-0 left-24 h-px bg-neutral-100 right-0" />
                  {/* <div className="w-1 h-16 rounded-r-full bg-green-500 shrink-0" /> */}

                  <div className="flex-none size-16 relative rounded-lg shadow-md aspect-square bg-gray-100">
                    <div className="absolute -bottom-1.5 -right-1.5 origin-bottom-right rounded-full scale-75 border-2 shadow border-white overflow-hidden">
                      <MapPlaceIcon appleMapsCategoryId={result.categoryId} />
                    </div>
                    <img
                      src={result.photos?.[0]?.url}
                      alt={result.name}
                      className="size-full rounded-lg object-cover tc-render-faster overflow-hidden"
                    />
                  </div>
                  <div className="flex-1 pl-2 flex flex-col gap-0.5">
                    <div className="line-clamp-2 leading-snug">
                      {result.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.categoryName}{" "}
                      {result.rating && (
                        <span className="whitespace-nowrap">
                          –{" "}
                          <StarIcon className="size-3.5 -mt-[3px] inline-block" />{" "}
                          {(result.rating.score * 5).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
