"use client";

import { MdHotel, MdLocationCity, MdRoute, MdStar } from "react-icons/md";
import { mapController, MapPin, MapProject } from "./global_map";
import MapPlaceIcon, {
  getMapIconFromAppleMapsCategoryId,
} from "./map_place_icon";
import { act, useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { DateTime } from "luxon";

type ActivityType = "place" | "transit" | "lodging" | "activity";

export default function ActivityListComponent({
  project,
}: {
  project?: MapProject | null;
}) {
  // const unscheduledActivities = useMemo(
  //   () => project?.pins.filter((pin) => !pin.dateStart),
  //   [project]
  // );

  //   const scheduledActivities = _.groupBy(project?.pins.filter((pin) => pin.dateStart),;

  const scheduledActivities = useMemo(() => {
    const groups: Record<
      string,
      {
        type: string;
        activityType: string;
        pin: MapPin | null;
        id: string;
        numDays: number;
        color: string;
        key: string;
      }[]
    > = {};

    for (const pin of project?.pins
      .filter((pin) => pin.dateStart)
      .sort((a, b) => (a.timeStart ?? 0) - (b.timeStart ?? 0)) ?? []) {
      const date = pin.dateStart!.toISOString().split("T")[0];

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push({
        type: "start",
        pin: pin,
        id: pin.id,
        activityType: pin.type,
        numDays:
          pin.dateStart && pin.duration ? Math.ceil(pin.duration / 1440) : 0,
        color: (pin.styleData as any)["iconColor"] ?? "bg-gray-500",
        key: `activity-start-${pin.id}`,
      });
      if (pin.dateStart && pin.duration && pin.duration > 1440) {
        const endDate = DateTime.fromJSDate(pin.dateStart)
          .plus({ minutes: pin.duration ?? 0 })
          .toISO({ precision: "day" })
          ?.substring(0, 10);
        if (!endDate) continue;
        groups[endDate] = [
          {
            type: "end",
            pin: null,
            activityType: pin.type,
            numDays:
              pin.dateStart && pin.duration
                ? Math.ceil(pin.duration / 1440)
                : 0,
            id: pin.id,
            key: `activity-end-${pin.id}`,
            color: (pin.styleData as any)["iconColor"] ?? "bg-gray-500",
          },
          ...(groups[endDate] ?? []),
        ];
      }
    }
    return groups;
  }, [project]);

  const datesToDisplay = useMemo(() => {
    const sortedDates = _.sortBy(
      project?.pins
        .filter((pin) => pin.dateStart)
        .map((pin) => pin.dateStart!.toISOString().split("T")[0]),
      (date) => date
    );
    // Also include any end dates for multi-day activities
    for (const pin of project?.pins ?? []) {
      if (pin.dateStart && pin.duration && pin.duration > 1440) {
        const endDate = DateTime.fromJSDate(pin.dateStart)
          .plus({ minutes: pin.duration ?? 0 })
          .toISO({ precision: "day" })
          ?.substring(0, 10);
        if (endDate && !sortedDates.includes(endDate)) {
          sortedDates.push(endDate);
        }
      }
    }
    let start: string | null = sortedDates[0];
    const end = sortedDates[sortedDates.length - 1];
    const dates = [];
    while (start !== null && end >= start) {
      dates.push(start);
      start =
        DateTime.fromISO(start).plus({ days: 1 }).toISO()?.split("T")[0] ??
        null;
    }
    return {
      start: sortedDates[0],
      end: end,
      dates: dates,
    };
  }, [project]);

  const [activeTab, setActiveTab] = useState<ActivityType>("place");

  const activityScrollView = useRef<HTMLDivElement>(null);
  const activityListContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const view = activityScrollView.current;

    const scrollWatcher = (e: Event) => {
      const el = e.target as HTMLDivElement;
      const offset = el.scrollTop;
      const items =
        activityListContainer.current?.querySelectorAll(
          ".tc-activity-list-unfocused-track-inner"
        ) ?? [];
      items.forEach((item) => {
        (item as HTMLDivElement).style.top = `-${offset}px`;
      });
    };

    view?.addEventListener("scroll", scrollWatcher);

    return () => {
      view?.removeEventListener("scroll", scrollWatcher);
    };
  }, [activityScrollView, activityListContainer, activeTab]);

  

  useEffect(() => {

    const animateDurationTracks = (activeTab: ActivityType) => {

      // Method for calculating the track height of an activity
      const calculateHeightForActivity = (activity: MapPin) => {
  
        if ((activity.duration ?? 0) < 1440 || !activity.dateStart) {
          return 0;
        }
        // const dateEnd = DateTime.fromJSDate(activity.dateStart)
        //   .plus({ minutes: activity.duration ?? 0 })
        //   .toISO({ precision: "day" })
        //   ?.substring(0, 10);
        // const dateStart = activity.dateStart!.toISOString().split("T")[0];
        const startEl = activityScrollView.current?.querySelector(
          `#activity-start-${activity.id}`
        ) as HTMLButtonElement | undefined;
        const endEl = activityScrollView.current?.querySelector(
          `#activity-end-${activity.id}`
        ) as HTMLDivElement | undefined;
  
        const height = (endEl?.offsetTop ?? 0) - (startEl?.offsetTop ?? 0);
  
        return height;
      };
  
      // Determine which elements need to be animated
      const durationTracks = _.flatten(_.valuesIn(scheduledActivities))
        .filter((activity) => activity.activityType === activeTab)
        .map((activity) => ({ 
          track: activityScrollView.current?.querySelector(
            `#activity-duration-track-${activity.key}`
          ) as HTMLDivElement | undefined,
          activity: activity,
        })).filter((track) => track.track !== undefined && track.activity.pin !== null);
  
      // Run the animation
      let i = 0;
      const tickLimit = 4;
      const interval = setInterval(() => {
        for (const track of durationTracks) {
          track.track!.style.height = `${calculateHeightForActivity(track.activity.pin!)}px`;
        }
        i++;
        if (i >= tickLimit) {
          clearInterval(interval);
        }
      }, 75);
    };


    animateDurationTracks(activeTab);
  }, [activeTab, scheduledActivities]);

  const openActivity = (activity: MapPin) => {
    mapController.openMarker(activity.id);
  }

  return (
    <div className="tc-panel flex flex-col pointer-events-auto h-full w-full">
      <div className="tc-panel-header flex-none">
        <div className="tc-panel-title">Itinerary</div>
      </div>
      <div className="border-b border-gray-100 px-4 py-2 flex gap-2">
        <div
          className={`border-gray-100 tc-activity-toggler ${
            activeTab === "place"
              ? "active bg-gray-500"
              : "bg-gray-100 !text-gray-500"
          }`}
          onClick={() => setActiveTab("place")}
        >
          <MdLocationCity className="" />
          <span className="">Places</span>
        </div>
        <div
          className={`border-blue-100 tc-activity-toggler ${
            activeTab === "transit"
              ? "active bg-blue-500"
              : "bg-blue-100 !text-blue-500"
          }`}
          onClick={() => setActiveTab("transit")}
        >
          <MdRoute className="" />
          <span className="">Transit</span>
        </div>
        <div
          className={`border-purple-100 tc-activity-toggler ${
            activeTab === "lodging"
              ? "active bg-purple-500"
              : "bg-purple-100 !text-purple-500"
          }`}
          onClick={() => setActiveTab("lodging")}
        >
          <MdHotel className="" />
          <span className="">Lodging</span>
        </div>
        <div
          className={` border-pink-100 tc-activity-toggler ${
            activeTab === "activity"
              ? "active bg-pink-500"
              : "bg-pink-100 !text-pink-500"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          <MdStar className="" />
          <span className="">Activities</span>
        </div>
      </div>
      <div
        className="flex-1 min-h-0 relative h-auto"
        ref={activityListContainer}
      >
        <div
          className="tc-activity-list-scroll-view tc-scrollbar-hidden z-10 relative"
          ref={activityScrollView}
        >
          <div className={`mx-2 my-2 z-10 bg-white pointer-events-auto`}>
            <div className={`transition-colors rounded-lg bg-white`}>
              {datesToDisplay.dates.map((date) => (
                <div key={date} id={`activity-list-${date}`}>
                  <div className={`tc-activity-list-header`}>
                    <span className="text-gray-800">
                      {DateTime.fromISO(date).toLocaleString({
                        weekday: "short",
                      })}{' '}
                    </span>
                    <span className="text-gray-400 float-right">
                      {DateTime.fromISO(date).toLocaleString({
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={`tc-activity-list-items`}>
                    {scheduledActivities[date]?.map((activity) => {
                      if (!activity.pin) {
                        return (
                          <div
                            key={activity.key}
                            id={activity.key}
                            className={`tc-activity-list-item-end ${
                              activity.activityType === activeTab
                                ? ""
                                : "tc-activity-list-item-end-unfocused"
                            }`}
                          >
                            <div
                              className={`${activity.color} ml-[12px] size-4 rounded-full relative border-3 border-white z-20`}
                            ></div>
                            <div className="text-xs text-gray-400">
                              {activity.numDays} days
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <button
                            key={activity.key}
                            id={activity.key}
                            onClick={() => {
                              if (activity.pin) 
                              openActivity(activity.pin)
                            }}
                            className={`tc-activity-list-item ${
                              activity.activityType === activeTab
                                ? ""
                                : "tc-activity-list-item-unfocused"
                            }`}
                          >
                            <div
                              id={`activity-duration-track-${activity.key}`}
                              className={`tc-activity-list-item-duration-track  ${
                                (activity.pin.styleData as any)["iconColor"]
                              }`}
                            ></div>
                            <div className="tc-activity-list-item-icon">
                              <MapPlaceIcon
                                tcCategoryId={
                                  (activity.pin.styleData as any)["iconId"] ??
                                  "address"
                                }
                              />
                            </div>
                            <div className="tc-activity-list-item-text">
                              {activity.pin.name}
                            </div>
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="tc-activity-list-header">Unscheduled</div>
          <div className="tc-activity-list-items">
            {unscheduledActivities?.map((activity) => (
              <button key={activity.id} className="tc-activity-list-item">
                <div className="">
                  <MapPlaceIcon
                    tcCategoryId={
                      (activity.styleData as any)["iconId"] ?? "address"
                    }
                  />
                </div>
                <div className="text-sm text-gray-500">{activity.name}</div>
              </button>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
