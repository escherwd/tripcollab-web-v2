"use client";

import { AppleMapsSearchResult, searchAppleMaps } from "@/app/api/maps/search";
import { useEffect, useRef, useState } from "react";
import { mapController } from "./global_map";
import { LngLatBounds } from "mapbox-gl";
import {
  AppleMapsAutocompleteResponse,
  autocompleteAppleMaps,
} from "@/app/api/maps/autocomplete";
import {
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import moment from "moment";
import MapPlaceIcon from "./map_place_icon";
import { MdRefresh } from "react-icons/md";

export default function GeneralSearchComponent() {
  const currentQuery = useRef("");

  const [searchQuery, setSearchQuery] = useState("");

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

      const timestamp = moment().valueOf();

      const data = await autocompleteAppleMaps(query, {
        lng: bounds.getCenter().lng,
        lat: bounds.getCenter().lat,
        deltaLng: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
        deltaLat: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
      });

      data.timestamp = timestamp;

      console.log(data);

      // Only update if the timestamp of this request is greater than the timestamp of the current results
      if (timestamp > (autocompleteResults?.timestamp ?? 0))
        setAutocompleteResults(data);
    })();
  }, [searchQuery]);

  const handleSearch = async (query?: string) => {
    const queryToUse = query ?? searchQuery;

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

      if (data.displayMapRegion)
        mapController.flyToBounds(
          new LngLatBounds(
            [data.displayMapRegion.westLng, data.displayMapRegion.southLat],
            [data.displayMapRegion.eastLng, data.displayMapRegion.northLat]
          )
        );

      mapController.setMarkers(
        data.results.map((result) => ({
          id: result.muid,
          coordinate: result.coordinate,
          appleMapsPlace: result,
        }))
      );
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

  return (
    <>
      <div className="flex flex-col gap-2 absolute top-navbar left-2 w-76 bottom-2">
        <div className="tc-floating w-full h-12 relative">
          <div className="absolute top-0 left-3.5 right-3.5 bottom-0 flex items-center justify-between pointer-events-none">
            <MagnifyingGlassIcon className="text-gray-400 size-5" />
            {isSearching && (
              <MdRefresh className="text-gray-400 size-5 animate-spin" />
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
        <div
          className="tc-floating w-full h-full overflow-scroll duration-300 transition-all relative bg-white rounded-lg shadow-lg"
          style={{
            height: autocompleteResults ? "256px" : "0px",
            opacity: autocompleteResults ? "1" : "0",
          }}
        >
          {autocompleteResults?.results.map((result) => (
            <button
              key={result.muid}
              onClick={() => {
                handleAutocompleteResultClick(result);
              }}
              className="px-4 py-1.5 min-h-12 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 flex gap-4 items-center text-left w-full"
            >
              <div className="size-8 shrink-0 relative">
                <MapPlaceIcon
                  categoryId={result.place?.categoryId}
                  type={result.type}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-sm line-clamp-2">{result.highlight}</div>
                {result.extra && (
                  <div className="text-xs text-gray-500">{result.extra}</div>
                )}
              </div>
            </button>
          ))}
          {autocompleteResults?.results.length === 0 && (
            <div className="px-4 py-2 min-h-14 flex items-center justify-center text-gray-500">
              No results found
            </div>
          )}
        </div>

        {searchResults && searchResults?.results.length !== 1 && (
          <div
            className="flex-1 flex flex-col tc-floating w-full transition-all duration-300 fade-in overflow-scroll bg-white"
            style={{
              marginTop: autocompleteResults ? "0px" : "-8px",
            }}
          >
            <div className="py-2 px-4 flex-none flex gap-4 items-center justify-between border-b border-gray-100">
              <div className="font-display font-medium leading-[1.8] min-w-0 text-ellipsis overflow-hidden">
                <span className="whitespace-nowrap">Results for</span>{" "}
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  &quot;{searchResults?.query}&quot;
                </span>
              </div>
              <button
                onClick={() => {
                  clearSearch();
                }}
                className="cursor-pointer text-gray-400 bg-gray-50 rounded-full p-0.5 whitespace-nowrap hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
              {/* <div className="text-xs text-gray-500 whitespace-nowrap">
                {searchResults?.results.length} results
              </div> */}
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
                className="flex flex-col gap-3 py-3 px-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 transition-colors w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="size-8 shrink-0 relative pt-1">
                    <MapPlaceIcon
                      categoryId={result.categoryId}
                      type="ADDRESS"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="line-clamp-2 leading-snug">
                      {result.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.categoryName}{" "}
                      {result.rating && (
                        <span className="whitespace-nowrap">
                          –{" "}
                          <StarIcon className="size-3.5 -mt-[3px] inline-block" />{" "}
                          {(result.rating.score * 5).toFixed(1)} on{" "}
                          {result.rating.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {(result.photos?.length ?? 0) > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {result.photos?.map((photo) => (
                      <div
                        key={photo.id}
                        className="bg-gray-100 rounded-md overflow-hidden aspect-square"
                      >
                        <img
                          loading="lazy"
                          src={photo.url}
                          className="size-full object-cover tc-render-faster"
                        />
                      </div>
                    ))}
                  </div>
                )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
