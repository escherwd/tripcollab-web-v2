import { DateTime } from "luxon";
import CalendarComponent from "./calendar_component";
import { MapPin, MapProject } from "./global_map";
import TcButton from "./button";
import { useEffect, useMemo, useState } from "react";
import {
  MdArrowForward,
  MdArrowRight,
  MdChevronRight,
  MdLastPage,
  MdPinEnd,
  MdStart,
} from "react-icons/md";
import {
  ROUTE_ARRIVAL_DEFAULT_TIME_OF_DAY_MINUTES,
  ROUTE_ARRIVAL_SUGGESTION_BUFFER_MINUTES,
  ROUTE_DEPARTURE_DEFAULT_TIME_OF_DAY_MINUTES,
  ROUTE_DEPARTURE_SUGGESTION_BUFFER_MINUTES,
} from "@/app/utils/consts";
import MapPlaceIcon from "./map_place_icon";

type RoutePlanningTimeType = "depart" | "arrive";

export default function RoutePlanningCalendarSubpage({
  initialDate,
  project,
  pinFrom,
  pinTo,
  onChange,
}: {
  initialDate: DateTime;
  project: MapProject;
  pinFrom?: MapPin;
  pinTo?: MapPin;
  onChange?: (value: { type: RoutePlanningTimeType; date: DateTime }) => void;
}) {
  const [dateType, setDateType] = useState<RoutePlanningTimeType>("depart");
  const [date, setDate] = useState<DateTime>(initialDate);

  const [time, setTime] = useState<number>(
    ROUTE_DEPARTURE_DEFAULT_TIME_OF_DAY_MINUTES,
  ); // minutes from midnight

  const suggestion = useMemo<
    | {
        date: DateTime;
        pin: MapPin;
        type: RoutePlanningTimeType;
      }
    | undefined
  >(() => {
    if (dateType === "depart" && pinFrom && pinFrom.dateStart) {
      return {
        date: DateTime.fromJSDate(pinFrom.dateStart, { zone: pinFrom.zoneName })
          .plus({ minutes: pinFrom.duration || 0 })
          .plus({ minutes: ROUTE_DEPARTURE_SUGGESTION_BUFFER_MINUTES }),
        pin: pinFrom,
        type: dateType,
      };
    } else if (dateType === "arrive" && pinTo && pinTo.dateStart) {
      return {
        date: DateTime.fromJSDate(pinTo.dateStart, {
          zone: pinFrom?.zoneName,
        }).minus({ minutes: ROUTE_ARRIVAL_SUGGESTION_BUFFER_MINUTES }),
        pin: pinTo,
        type: dateType,
      };
    }
    return undefined;
  }, [pinFrom, pinTo, dateType]);

  const setTimeFromDate = (dt: DateTime) => {
    setDate(dt);
    setTime(dt.hour * 60 + dt.minute);
  };

  useEffect(() => {
    const dateStr = date
      .set({ hour: Math.floor(time / 60), minute: time % 60 })
      .setZone(initialDate.zone, { keepLocalTime: true })
      
      // .toISO({ includeOffset: false });
    if (dateStr)
      onChange?.({
        type: dateType,
        date: dateStr,
      });
  }, [date, time, onChange, dateType]);

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-2 ">
        <TcButton
          primary={dateType === "depart"}
          onClick={() => {
            setDateType("depart");
          }}
        >
          <MdStart className="size-4" />
          Depart At
        </TcButton>
        <TcButton
          primary={dateType === "arrive"}
          onClick={() => {
            setDateType("arrive");
          }}
        >
          <MdLastPage className="size-4" />
          Arrive By
        </TcButton>
      </div>
      {suggestion && (
        <div>
          <div className="text-gray-500 text-sm mb-3">Suggestion</div>
          <div
            onClick={() => setTimeFromDate(suggestion.date)}
            className="pl-2 pr-2 py-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-sm flex gap-2 items-center cursor-pointer"
          >
            <div className="flex items-center">
              {suggestion.type === "arrive" && (
                <MdArrowForward className="size-4 text-gray-400" />
              )}
              <MapPlaceIcon
                tcCategoryId={suggestion.pin.styleData?.iconId}
                customColor={suggestion.pin.styleData?.iconColor}
                appleMapsCategoryId={
                  suggestion.pin.extendedMetadata?.categoryId
                }
                border
              />
              {suggestion.type === "depart" && (
                <MdArrowForward className="size-4 text-gray-400" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-xs text-gray-600">
                {suggestion.type === "depart" ? (
                  <>
                    Depart from{" "}
                    <span className="font-medium">{suggestion.pin.name}</span>{" "}
                    on
                  </>
                ) : (
                  <>
                    Arrive to{" "}
                    <span className="font-medium">{suggestion.pin.name}</span>{" "}
                    on
                  </>
                )}
              </div>
              <div>
                {suggestion.date.toLocaleString({
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  minute: "2-digit",
                  hour: "numeric",
                })}
              </div>
            </div>
            <MdChevronRight className="size-5 text-gray-400" />
          </div>
        </div>
      )}

      <div>
        <div className="text-gray-500 text-sm mb-3">Time</div>
        <div className="tc-route-planner-input !py-4">
          <span>At</span>
          <input
            type="time"
            className="flex-1 text-lg"
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              setTime(hours * 60 + minutes);
            }}
            value={`${Math.floor(time / 60)
              .toString()
              .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`}
          />
        </div>
      </div>

      <div>
        <div className="text-gray-500 text-sm mb-3">Date</div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
          <CalendarComponent
            dense
            project={project}
            initialAnchorDate={date}
            date={date}
            onDateChange={(d) => (d ? setDate(d) : null)}
            readonly={false}
          />
        </div>
      </div>
    </div>
  );
}
