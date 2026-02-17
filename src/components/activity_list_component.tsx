"use client";

import { MdHotel, MdLocationCity, MdRoute, MdStar } from "react-icons/md";
import { mapController, MapPin, MapProject } from "./global_map";
import MapPlaceIcon, {
  getMapIconFromAppleMapsCategoryId,
  mapIcons,
} from "./map_place_icon";
import { act, useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { DateTime, Duration } from "luxon";
import {
  ProjectFunctionOpenExistingRoute,
  userLocaleSettings,
} from "@/app/(layout-map)/t/[slug]/content";
import colors from "tailwindcss/colors";
import { calendarDayDifference } from "@/app/utils/logic/date_utils";

type ActivityType = "place" | "transit" | "lodging" | "activity";

type ActivityListItem = {
  id: string;
  name: string;
  subtitle?: string;
  type: string;
  activityType: ActivityType;
  pin: MapPin | null;
  numDays: string;
  timeStart?: DateTime;
  timeEnd?: DateTime;
  key: string;
  color?: string; // take from styledata
  iconId: string; // take from styledata
};

export default function ActivityListComponent({
  project,
  openExistingRoute,
}: {
  project?: MapProject | null;
  openExistingRoute: ProjectFunctionOpenExistingRoute;
}) {
  // const unscheduledActivities = useMemo(
  //   () => project?.pins.filter((pin) => !pin.dateStart),
  //   [project]
  // );

  //   const scheduledActivities = _.groupBy(project?.pins.filter((pin) => pin.dateStart),;

  const scheduledActivities = useMemo(() => {
    const groups: Record<string, ActivityListItem[]> = {};

    for (const pin of project?.pins.filter((pin) => pin.dateStart) ??
      // .sort((a, b) => (a.timeStart ?? 0) - (b.timeStart ?? 0)) ?? []) {
      []) {
      // const date = pin.dateStart!.toISOString().split("T")[0];

      const dateTime = DateTime.fromJSDate(pin.dateStart!, {
        zone: pin.zoneName,
      });
      const date = dateTime.toISODate();

      if (!date) continue;

      const dateTimeEnd = dateTime.plus({ minutes: pin.duration ?? 0 });

      const pinColor =
        pin.styleData?.iconColor ??
        mapIcons[pin.styleData?.iconId ?? "address"]?.color;
      const pinIconId = pin.styleData?.iconId ?? "address";

      const numDays: number = calendarDayDifference(dateTime, dateTimeEnd) - 1;

      const numDayString = numDays >= 1 ? `${numDays + 1} Days` : "1 Day";

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push({
        type: "start",
        pin: pin,
        id: pin.id,
        activityType: pin.type as ActivityType,
        numDays: numDayString,
        timeStart: dateTime,
        key: `activity-start-${pin.id}`,
        color: pinColor,
        iconId: (pin.styleData as any)["iconId"] ?? "address",
        name: pin.name,
      });
      if (pin.dateStart && pin.duration && numDays > 0) {
        const endDate = dateTime
          .plus({ minutes: pin.duration ?? 0 })
          .toISO({ precision: "day" })
          ?.substring(0, 10);
        if (!endDate) continue;
        groups[endDate] = [
          {
            type: "end",
            pin: null,
            activityType: pin.type as ActivityType,
            numDays: numDayString,
            id: pin.id,
            key: `activity-end-${pin.id}`,
            color: pinColor,
            iconId: pinIconId,
            timeEnd: dateTime.plus({ minutes: pin.duration ?? 0 }),
            name: pin.name,
          },
          ...(groups[endDate] ?? []),
        ];
      }
    }

    // Add the transportation activities
    for (const route of project?.routes ?? []) {
      if (!route.dateStart) continue;
      // const date = route.dateStart?.toISOString().split("T")[0];
      const dateTime = DateTime.fromJSDate(route.dateStart, {
        zone: route.zoneStart,
      });
      const date = dateTime.toISODate();

      if (!date) continue;

      const dateTimeEnd = dateTime
        .plus({ minutes: route.duration ?? 0 })
        .setZone(route.zoneEnd);

      // console.log("adding route", route, date);
      const numDays = calendarDayDifference(dateTime, dateTimeEnd);

      if (!groups[date]) {
        groups[date] = [];
      }
      const durationString = Duration.fromObject({
        minutes: (route.duration ?? 0) % 60,
        hours: Math.floor((route.duration ?? 0) / 60),
      }).toHuman({ unitDisplay: "short", showZeros: false });
      groups[date].push({
        type: "start",
        pin: null,
        id: route.id,
        activityType: "transit" as ActivityType,
        timeStart: dateTime,
        numDays: `${numDays} Days`,
        color:
          route.styleData?.color ??
          getMapIconFromAppleMapsCategoryId("transportation").color,
        key: `activity-start-${route.id}`,
        name: route.name ?? `${route.originName} to ${route.destName}`,
        subtitle: durationString,
        iconId: "public_transit",
      });
      if (numDays > 1) {
        // const endDate = DateTime.fromJSDate(route.dateStart).plus({
        //   minutes: route.duration ?? 0,
        // });

        const endDateISO = dateTimeEnd.toISODate();
        if (!endDateISO) continue;
        groups[endDateISO] = [
          {
            type: "end",
            pin: null,
            activityType: "transit" as ActivityType,
            id: route.id,
            numDays: `${numDays} Days`,
            key: `activity-end-${route.id}`,
            timeEnd: dateTimeEnd,
            color:
              route.styleData?.color ??
              getMapIconFromAppleMapsCategoryId("transportation").color,
            iconId: "public_transit",
            name: route.destName,
          },
          ...(groups[endDateISO] ?? []),
        ];
      }
    }

    // Make sure each day is sorted correctly by time
    for (const day in groups) {
      groups[day] = groups[day].toSorted(
        (a, b) =>
        {
          const aTime = a.timeStart ?? a.timeEnd as DateTime<true>
          const bTime = b.timeStart ?? b.timeEnd as DateTime<true>
          return (aTime.diff(aTime.startOf("day")).as('minutes') ?? 0) -
          (bTime.diff(bTime.startOf("day")).as('minutes') ?? 0)
        }
          ,
      );
    }

    return groups;
  }, [project]);

  const datesToDisplay = useMemo(() => {
    let sortedDates =
      project?.pins
        .filter((pin) => pin.dateStart)
        .map(
          (pin) =>
            DateTime.fromJSDate(pin.dateStart!, {
              zone: pin.zoneName,
            }).toISODate()!,
        ) ?? [];

    // Also include any route dates
    for (const route of project?.routes ?? []) {
      const date = DateTime.fromJSDate(route.dateStart!, {
        zone: route.zoneStart,
      });
      const isoDate = date.toISODate();
      if (isoDate && !sortedDates.includes(isoDate)) {
        sortedDates.push(isoDate);
      }
      const endDate = date
        .plus({ minutes: route.duration ?? 0 })
        .setZone(route.zoneEnd);
      const isoDateEnd = endDate.toISODate();
      if (
        isoDateEnd &&
        isoDateEnd != isoDate &&
        !sortedDates.includes(isoDateEnd)
      )
        sortedDates.push(isoDateEnd);
    }

    // Also include any end dates for multi-day activities
    for (const pin of project?.pins ?? []) {
      if (pin.dateStart && pin.duration && pin.duration > 1440) {
        const endDate = DateTime.fromJSDate(pin.dateStart, {
          zone: pin.zoneName,
        })
          .plus({ minutes: pin.duration ?? 0 })
          .toISO({ precision: "day" })
          ?.substring(0, 10);
        if (endDate && !sortedDates.includes(endDate)) {
          sortedDates.push(endDate);
        }
      }
    }

    sortedDates = _.sortBy(sortedDates, (date) => date);

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
          ".tc-activity-list-unfocused-track-inner",
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
      const calculateHeightForActivity = (id: string) => {
        // const dateEnd = DateTime.fromJSDate(activity.dateStart)
        //   .plus({ minutes: activity.duration ?? 0 })
        //   .toISO({ precision: "day" })
        //   ?.substring(0, 10);
        // const dateStart = activity.dateStart!.toISOString().split("T")[0];
        const startEl = activityScrollView.current?.querySelector(
          `#activity-start-${id}`,
        ) as HTMLButtonElement | undefined;
        const endEl = activityScrollView.current?.querySelector(
          `#activity-end-${id}`,
        ) as HTMLDivElement | undefined;

        if (!startEl || !endEl) {
          return { height: 0 };
        }

        return {
          top: startEl.clientHeight / 2,
          height:
            endEl.offsetTop +
            endEl.clientHeight / 2 -
            startEl.offsetTop -
            startEl.clientHeight / 2,
        };
      };

      // Determine which elements need to be animated
      const durationTracks = _.flatten(_.valuesIn(scheduledActivities))
        .filter((activity) => activity.activityType === activeTab)
        .map((activity) => ({
          track: activityScrollView.current?.querySelector(
            `#activity-duration-track-${activity.key}`,
          ) as HTMLDivElement | null | undefined,
          activity: activity,
        }))
        .filter((track) => track.track);

      // Run the animation
      let i = 0;
      const tickLimit = 4;
      const interval = setInterval(() => {
        for (const track of durationTracks) {
          const calculated = calculateHeightForActivity(track.activity.id);
          track.track!.style.height = `${calculated.height}px`;
          track.track!.style.top = `${calculated.top}px`;
        }
        i++;
        if (i >= tickLimit) {
          clearInterval(interval);
        }
      }, 75);
    };

    animateDurationTracks(activeTab);
  }, [activeTab, scheduledActivities]);

  const openActivity = (activity: ActivityListItem) => {
    console.log("Opening activity:", activity);
    if (activity.pin) {
      mapController.openMarker(activity.pin.id);
    } else if (activity.activityType == "transit") {
      const route = project?.routes.find((r) => r.id === activity.id);
      if (route) {
        // projectController.openExistingRoute(route);
        openExistingRoute(route);
      }
    }
  };

  return (
    <div className="tc-panel flex flex-col pointer-events-auto h-full w-full">
      <div className="tc-panel-header flex-none bg-gray-50">
        <div className="tc-panel-title">Itinerary</div>
      </div>
      <div className="pt-2 flex bg-gray-50">
        <div className="w-2 border-b border-gray-100" />
        <div
          className={`tc-activity-toggler text-gray-500 ${
            activeTab === "place" ? "active" : ""
          }`}
          style={
            {
              "--unfocused-bg": colors.gray[100],
              "--hover-bg": colors.gray[200],
            } as React.CSSProperties
          }
          onClick={() => setActiveTab("place")}
        >
          <MdLocationCity className="" />
          <span className="">Places</span>
        </div>
        <div
          className={`tc-activity-toggler text-blue-500 ${
            activeTab === "transit" ? "active " : ""
          }`}
          style={
            {
              "--unfocused-bg": colors.blue[100],
              "--hover-bg": colors.blue[200],
            } as React.CSSProperties
          }
          onClick={() => setActiveTab("transit")}
        >
          <MdRoute className="" />
          <span className="">Transit</span>
        </div>
        <div
          className={`tc-activity-toggler text-purple-500 ${
            activeTab === "lodging" ? "active " : ""
          }`}
          style={
            {
              "--unfocused-bg": colors.purple[100],
              "--hover-bg": colors.purple[200],
            } as React.CSSProperties
          }
          onClick={() => setActiveTab("lodging")}
        >
          <MdHotel className="" />
          <span className="">Lodging</span>
        </div>
        <div
          className={` tc-activity-toggler text-pink-500 ${
            activeTab === "activity" ? "active " : ""
          }`}
          style={
            {
              "--unfocused-bg": colors.pink[100],
              "--hover-bg": colors.pink[200],
            } as React.CSSProperties
          }
          onClick={() => setActiveTab("activity")}
        >
          <MdStar className="" />
          <span className="">Activities</span>
        </div>
        <div className="w-2 border-b border-gray-100" />
      </div>
      <div
        className="flex-1 min-h-0 relative h-auto z-10 bg-white"
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
                    <span className="text-gray-800 font-medium">
                      {DateTime.fromISO(date).toLocaleString({
                        weekday: "short",
                      })}{" "}
                    </span>
                    <span className="text-gray-500 float-right">
                      {DateTime.fromISO(date).toLocaleString({
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={`tc-activity-list-items`}>
                    {scheduledActivities[date]?.map((activity) => {
                      if (activity.type === "end") {
                        // End of activity
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
                              className={`ml-[12px] flex-shrink-0 !size-4 rounded-full relative border-3 border-white z-20 transition-colors`}
                              style={{ backgroundColor: activity.color }}
                            ></div>
                            <div className="text-xs w-full text-gray-400 flex items-center justify-between">
                              <span className="line-clamp-1 overflow-ellipsis">
                                {activity.activityType != "transit"
                                  ? `Depart ${activity.name}`
                                  : `Arrive to ${activity.name}`}
                              </span>
                              {activity.timeEnd && (
                                <span className="whitespace-nowrap">
                                  {activity.timeEnd.toLocaleString(
                                    DateTime.TIME_SIMPLE,
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      } else {
                        // Start of activity
                        return (
                          <button
                            key={activity.key}
                            id={activity.key}
                            onClick={() => {
                              openActivity(activity);
                            }}
                            className={`tc-activity-list-item ${
                              activity.activityType === activeTab
                                ? ""
                                : "tc-activity-list-item-unfocused"
                            }`}
                          >
                            <div
                              id={`activity-duration-track-${activity.key}`}
                              key={`duration-track-${activeTab}-${activity.key}`}
                              className={`tc-activity-list-item-duration-track`}
                              style={{ backgroundColor: activity.color }}
                            ></div>
                            <div className="tc-activity-list-item-icon">
                              <MapPlaceIcon
                                tcCategoryId={activity.iconId}
                                customColor={activity.color}
                              />
                            </div>
                            <div className="tc-activity-list-item-text">
                              <span>
                                <div>{activity.name}</div>
                                {activity.subtitle && (
                                  <div
                                    className={` text-gray-400 duration-300 mt-px transition-all ${
                                      activity.activityType === activeTab
                                        ? "opacity-100 h-4 text-xs"
                                        : "opacity-0 h-0 text-[0px]"
                                    }`}
                                  >
                                    {activity.subtitle}
                                  </div>
                                )}
                              </span>
                              {activity.timeStart && (
                                <div className="tc-activity-list-item-time">
                                  {activity.timeStart.toLocaleString(
                                    DateTime.TIME_SIMPLE,
                                  )}
                                </div>
                              )}
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
