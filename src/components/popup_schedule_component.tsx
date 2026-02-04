import {
  CalendarIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { mapController, MapPin, MapProject } from "./global_map";
import { DateTime, Zone } from "luxon";
import { useMemo, useState } from "react";
import CalendarComponent from "./calendar_component";
import { Prisma } from "@prisma/client";
import { debounce } from "@/app/utils/ui/debounce";
import _, { set } from "lodash";
import { projectEventReceiver } from "@/app/utils/controllers/project_controller";
import PanelIconButton from "./panel_icon_button";
import { RiAddLine } from "@remixicon/react";
import { calendarDayDifference } from "@/app/utils/logic/date_utils";

export default function PopupScheduleComponent({
  project,
  pin,
}: {
  project: MapProject;
  pin: MapPin;
}) {
  // const dateTime = useMemo(() => {
  //   return pin.dateStart
  //     ? DateTime.fromJSDate(pin.dateStart, { zone: pin.zoneName })
  //     : null;
  // }, [pin]);

  const [expanded, setExpanded] = useState(false);

  const [dateTimeStart, setDateTimeStart] = useState(
    pin.dateStart
      ? DateTime.fromJSDate(pin.dateStart, { zone: pin.zoneName })
      : undefined,
  );
  const [dateTimeEnd, setDateTimeEnd] = useState(
    dateTimeStart?.plus({ minutes: pin.duration ?? 0 }),
  );

  const numDays = useMemo(() => {
    if (!dateTimeStart || !dateTimeEnd) return 0;
    return calendarDayDifference(dateTimeStart, dateTimeEnd) - 1;
  }, [dateTimeStart, dateTimeEnd]);

  // const [numDays, setNumDays] = useState(
  //   pin.duration ?
  // );
  // const [timeStart, setTimeStart] = useState<number | null>(
  //   pin?.timeStart ?? null
  // );
  // const [timeLeave, setTimeLeave] = useState<number | null>(
  //   (pin?.timeStart && pin?.duration) ? (pin.timeStart + (pin?.duration ?? 0)) % (24 * 60) : null
  // );
  // const [duration, setDuration] = useState(pin?.duration ?? 0);

  const durationError = useMemo(() => {
    // No dateTimes set, no error
    if (!dateTimeEnd || !dateTimeStart) return null;

    const duration = dateTimeEnd.diff(dateTimeStart).as("minutes");
    return duration < 0 ? "Duration must be positive" : null;
  }, [dateTimeStart, dateTimeEnd]);

  const savePinUpdates = async (data: Prisma.PinUpdateInput) => {
    if (!pin?.id) {
      return;
    }
    console.log("Updated pin", pin.id, data);
    projectEventReceiver.didUpdateProject({
      ...project,
      pins: project.pins.map((p) =>
        p.id === pin.id ? { ...p, ...(data as any) } : p,
      ),
    });

    // const sendUpdate = async () => {
    //   // TODO: do not cast data to any
    //   await updatePin(pin.id, data as any);
    // };
    // Debounce this request
    // debounce(sendUpdate, "schedule-component-update", 300);
  };

  const minutesToTimeString = (minutes: number) => {
    return `${Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
  };

  // Convert minutes to HH:MM string
  const timeStartString = useMemo(() => {
    if (!dateTimeStart) {
      return "00:00";
    }
    return dateTimeStart.toFormat("T");
  }, [dateTimeStart]);

  const timeEndString = useMemo(() => {
    if (!dateTimeEnd) {
      return "00:00";
    }
    return dateTimeEnd.toFormat("T");
  }, [dateTimeEnd]);

  const setNewStartTime = (minutes: number) => {
    const newDateTimeStart =
      dateTimeStart?.set({
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      }) ?? undefined;
    const duration = newDateTimeStart
      ? (dateTimeEnd?.diff(newDateTimeStart).as("minutes") ?? 0)
      : null;

    if ((duration ?? 0) < 0) {
      // Ensure leave time is after start time
      console.log("Start time must be before leave time");
      return;
    }

    savePinUpdates({
      dateStart: newDateTimeStart?.toJSDate(),
      duration: duration,
    });
    setDateTimeStart(newDateTimeStart);
  };

  const onStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes =
      parseInt(e.target.value.split(":")[0]) * 60 +
      parseInt(e.target.value.split(":")[1]);
    // setTimeStart(minutes);

    setNewStartTime(minutes);
  };

  const setNewLeaveTime = (minutes: number) => {
    if (!dateTimeStart) {
      console.log("Time start is null, cannot set leave time");
      return;
    }

    const newDateTimeLeave =
      dateTimeEnd?.set({
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      }) ?? undefined;

    const duration = newDateTimeLeave?.diff(dateTimeStart).as("minutes") ?? 0;

    if (duration < 0) {
      // Ensure leave time is after start time
      console.log("Leave time must be after start time");
      return;
    }
    savePinUpdates({ duration: duration });
    setDateTimeEnd(newDateTimeLeave);
  };

  const onLeaveTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("onLeaveTimeChange called");

    const minutes =
      parseInt(e.target.value.split(":")[0]) * 60 +
      parseInt(e.target.value.split(":")[1]);

    setNewLeaveTime(minutes);
    // savePinUpdates({ timeLeave: minutes });
  };

  const onNumDaysChange = (
    date?: DateTime<boolean> | undefined,
    numDays: number | undefined = 0,
  ) => {
    console.log("date or numdays changed?", date, numDays);

    if (date === undefined || numDays === undefined) return;

    const newDateTimeStart = date.set({
      hour: dateTimeStart?.hour,
      minute: dateTimeEnd?.minute,
    });
    const newDateTimeEnd = newDateTimeStart.plus({ days: numDays }).set({
      hour: dateTimeEnd?.hour,
      minute: dateTimeEnd?.minute,
    });

    console.log(newDateTimeStart, newDateTimeEnd);

    const duration = newDateTimeEnd.diff(newDateTimeStart).as("minutes");
    console.log(
      "onNumDaysChange called with numDays:",
      numDays,
      "calculated duration:",
      duration,
    );

    // setNumDays(numDays);
    if (duration < 0) {
      console.log("Duration must be positive");
      return;
    }

    console.log("Saving pin updates with duration:", duration);
    savePinUpdates({
      duration: duration,
      dateStart: newDateTimeStart?.toJSDate(),
    });
    setDateTimeStart(newDateTimeStart);
    setDateTimeEnd(newDateTimeEnd);
  };

  const calendarAnchor = useMemo(() => {
    if (pin?.dateStart) {
      // Best case: use the pin's dateStart
      return DateTime.fromJSDate(pin.dateStart);
    }
    // Second best: use the first scheduled pin's date
    if (project.pins.length > 0) {
      const scheduledPins = project.pins.filter((p) => p.dateStart);
      if (scheduledPins.length > 0) {
        const firstScheduledPin = scheduledPins.sort(
          (a, b) =>
            (a.dateStart ? a.dateStart.getTime() : 0) -
            (b.dateStart ? b.dateStart.getTime() : 0),
        )[0];
        return DateTime.fromJSDate(firstScheduledPin.dateStart!);
      }
    }
    // Fallback: use current date
    return DateTime.now();
  }, [pin, project]);

  // const clearStartTime = () => {
  //   setDateTimeEnd(undefined);
  //   setDateTimeStart(undefined);

  //   const duration = numDays * 24 * 60;

  //   savePinUpdates({ timeStart: null, duration: duration });
  // };

  // const clearLeaveTime = () => {
  //   setTimeLeave(null);

  //   if (timeStart === null) {
  //     return;
  //   }

  //   let duration: number | undefined = numDays * 24 * 60;
  //   if (duration == 0) duration = undefined;

  //   savePinUpdates({ duration: duration });
  // };

  const timeLabelString = useMemo(() => {
    if (!dateTimeStart) return "Unscheduled";
    if (!dateTimeEnd)
      return dateTimeStart.toLocaleString({ month: "short", day: "numeric" });
    const dayDiff = calendarDayDifference(dateTimeStart, dateTimeEnd);
    if (dayDiff > 1) {
      if (dateTimeStart.hasSame(dateTimeEnd, "month")) {
        const localeStart = dateTimeStart.toLocaleString({
          month: "short",
          day: "numeric",
        });
        const localeEnd = dateTimeEnd.toLocaleString({ day: "numeric" });
        return `${localeStart} – ${localeEnd}`;
      } else {
        const localeStart = dateTimeStart.toLocaleString({
          month: "short",
          day: "numeric",
        });
        const localeEnd = dateTimeEnd.toLocaleString({
          month: "short",
          day: "numeric",
        });
        return `${localeStart} – ${localeEnd}`;
      }
    } else {
      const localeStart = dateTimeStart.toLocaleString({
        month: "short",
        day: "numeric",
      });
      const timeStart = dateTimeStart.toLocaleString({
        hour: "numeric",
        minute: dateTimeStart.get("minute") != 0 ? "numeric" : undefined,
      });
      const timeEnd = dateTimeEnd.toLocaleString({
        hour: "numeric",
        minute: dateTimeEnd.get("minute") != 0 ? "numeric" : undefined,
      });
      return `${localeStart} – ${timeStart} to ${timeEnd}`;
    }
  }, [dateTimeStart, dateTimeEnd]);

  return (
    <div className="pb-4 px-4 flex flex-col gap-1">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div
          className={`py-2 px-2 hover:bg-gray-200 transition-colors flex items-center justify-between gap-2 cursor-pointer select-none`}
          onClick={() => setExpanded(!expanded)}
        >
          <CalendarIcon className="size-4 text-gray-500" />
          <div className="text-sm flex-1 font-medium text-gray-500">
            {timeLabelString}
          </div>
          <div>
            <ChevronRightIcon
              className={`size-5 text-gray-500 transition-transform duration-300 ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>
        <div
          className={`transition-all duration-300 h-78 flex flex-col ${
            expanded ? "max-h-78" : "max-h-0"
          }`}
        >
          <div className="flex-none bg-gray-50 h-60">
            <CalendarComponent
              dense={true}
              project={project}
              date={dateTimeStart}
              allowRange={true}
              initialAnchorDate={calendarAnchor}
              onDateChange={onNumDaysChange}
              initialNumDays={numDays}
              timeZone={pin.zoneName}
            />
          </div>
          <div className="grid grid-rows-2 divide-x h-18 divide-gray-200">
            <div className="py-2 pl-2 pr-0.5 gap-1 border-t flex items-center justify-around border-gray-200">
              <div className="text-sm text-gray-500">
                Arrive
                {numDays > 0 && dateTimeStart && (
                  <span className="fade-in text-xs bg-gray-200 rounded-full px-2 py-0.5 ml-2">
                    {dateTimeStart
                      .toLocaleString({
                        weekday: "long",
                      })
                      .toLowerCase()}
                  </span>
                )}
              </div>
              <div className="flex-1" />
              {true ? (
                <>
                  <input
                    defaultValue={timeStartString}
                    type="time"
                    className="text-sm text-gray-500"
                    onChange={onStartTimeChange}
                  />
                  <PanelIconButton
                    icon={<XMarkIcon />}
                    onClick={() => {
                      //clearStartTime();
                    }}
                  />
                </>
              ) : (
                <AddTimeButton onClick={() => setNewStartTime(8 * 60)} />
              )}
            </div>
            <div
              className={`py-2 pl-2 pr-0.5 border-t gap-1 flex items-center justify-around border-gray-200 transition-colors ${
                durationError ? "bg-red-100" : ""
              } ${true === null ? "opacity-50 [&>*]:pointer-events-none cursor-not-allowed" : ""}`}
            >
              <div className="text-sm text-gray-500">
                Leave
                {numDays > 0 && dateTimeEnd && (
                  <span className="fade-in text-xs bg-gray-200 rounded-full px-2 py-0.5 ml-2">
                    {dateTimeEnd
                      .toLocaleString({ weekday: "long" })
                      .toLowerCase()}
                  </span>
                )}
              </div>
              <div className="flex-1" />
              {true ? (
                <>
                  <input
                    defaultValue={timeEndString}
                    type="time"
                    className="text-sm text-gray-500"
                    onChange={onLeaveTimeChange}
                  />
                  <PanelIconButton
                    icon={<XMarkIcon />}
                    onClick={() => {
                      //clearLeaveTime();
                    }}
                  />
                </>
              ) : (
                <AddTimeButton
                  onClick={() => {
                    //setNewLeaveTime((timeStart ?? 0) + 120)
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddTimeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-medium cursor-pointer flex items-center gap-1 text-gray-500 hover:bg-gray-200 pl-2.5 pr-3 py-1 rounded-full transition-colors"
    >
      <RiAddLine size={16} />
      <span>Add Time</span>
    </button>
  );
}
