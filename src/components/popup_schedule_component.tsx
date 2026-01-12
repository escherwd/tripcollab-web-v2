import {
  CalendarIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { mapController, MapPin, MapProject } from "./global_map";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import CalendarComponent from "./calendar_component";
import { Prisma } from "@prisma/client";
import { debounce } from "@/app/utils/ui/debounce";
import _, { set } from "lodash";
import { projectEventReceiver } from "@/app/utils/controllers/project_controller";
import PanelIconButton from "./panel_icon_button";
import { RiAddLine } from "@remixicon/react";

export default function PopupScheduleComponent({
  project,
  pin,
}: {
  project: MapProject;
  pin: MapPin;
}) {
  const [expanded, setExpanded] = useState(false);
  const [numDays, setNumDays] = useState(
    pin?.duration
      ? Math.floor(((pin.timeStart ?? 0) + pin.duration) / (24 * 60))
      : 0
  );
  const [timeStart, setTimeStart] = useState<number | null>(
    pin?.timeStart ?? null
  );
  const [timeLeave, setTimeLeave] = useState<number | null>(
    (pin?.timeStart && pin?.duration) ? (pin.timeStart + (pin?.duration ?? 0)) % (24 * 60) : null
  );
  // const [duration, setDuration] = useState(pin?.duration ?? 0);

  const durationError = useMemo(() => {
    if (timeLeave === null || timeStart === null) {
      return null;
    }
    const duration = timeLeave - timeStart + numDays * 24 * 60;
    if (duration < 0) {
      return "Duration must be positive";
    }
    return null;
  }, [timeLeave, timeStart, numDays]);

  const savePinUpdates = async (data: Prisma.PinUpdateInput) => {
    if (!pin?.id) {
      return;
    }
    console.log("Updated pin", pin.id, data);
    projectEventReceiver.didUpdateProject({
      ...project,
      pins: project.pins.map((p) =>
        p.id === pin.id ? { ...p, ...(data as any) } : p
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
    if (!timeStart) {
      return "00:00";
    }
    return minutesToTimeString(timeStart);
  }, [timeStart]);

  const timeEndString = useMemo(() => {
    if (!timeLeave) {
      return "00:00";
    }
    return minutesToTimeString(timeLeave);
  }, [timeLeave]);

  const setNewStartTime = (minutes: number) => {
    const duration = (timeLeave ?? minutes) - minutes + numDays * 24 * 60;
    
    if (duration < 0) {
      // Ensure leave time is after start time
      console.log("Start time must be before leave time");
      return;
    }
    
    savePinUpdates({ timeStart: minutes, duration: duration });
    setTimeStart(minutes);
  };

  const onStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes =
      parseInt(e.target.value.split(":")[0]) * 60 +
      parseInt(e.target.value.split(":")[1]);
    setTimeStart(minutes);

    setNewStartTime(minutes);
  };

  const setNewLeaveTime = (minutes: number) => {
    if (timeStart === null) {
      console.log("Time start is null, cannot set leave time");
      return;
    }

    const duration = minutes - timeStart + numDays * 24 * 60;

    if (duration < 0) {
      // Ensure leave time is after start time
      console.log("Leave time must be after start time");
      return;
    }
    savePinUpdates({ duration: duration });
    setTimeLeave(minutes);
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
    date?: DateTime<boolean> | null | undefined,
    numDays: number | undefined = 0
  ) => {
    const duration = (timeLeave ?? 0) - (timeStart ?? 0) + numDays * 24 * 60;
    console.log(
      "onNumDaysChange called with numDays:",
      numDays,
      "calculated duration:",
      duration
    );

    setNumDays(numDays);
    if (duration < 0) {
      console.log("Duration must be positive");
      return;
    }

    console.log("Saving pin updates with duration:", duration);
    savePinUpdates({ duration: duration, dateStart: date?.toJSDate() });
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
            (b.dateStart ? b.dateStart.getTime() : 0)
        )[0];
        return DateTime.fromJSDate(firstScheduledPin.dateStart!);
      }
    }
    // Fallback: use current date
    return DateTime.now();
  }, [pin, project]);

  const clearStartTime = () => {
    setTimeStart(null);
    setTimeLeave(null);

    const duration = numDays * 24 * 60;

    savePinUpdates({ timeStart: null, duration: duration });
  };

  const clearLeaveTime = () => {
    setTimeLeave(null);

    if (timeStart === null) {
      return;
    }

    let duration: number | undefined = numDays * 24 * 60;
    if (duration == 0) duration = undefined

    savePinUpdates({ duration: duration });
  };

  return (
    <div className="pb-4 px-4 flex flex-col gap-1">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div
          className={`py-2 px-2 hover:bg-gray-200 transition-colors flex items-center justify-between gap-2 cursor-pointer select-none`}
          onClick={() => setExpanded(!expanded)}
        >
          <CalendarIcon className="size-4 text-gray-500" />
          <div className="text-sm flex-1 font-medium text-gray-500">
            {pin?.dateStart
              ? DateTime.fromJSDate(pin.dateStart).toLocaleString({
                  month: "short",
                  day: "numeric",
                })
              : "Unscheduled"}
            {pin?.dateStart && pin.timeStart && " – " + timeStartString}
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
              date={pin?.dateStart ? DateTime.fromJSDate(pin.dateStart) : null}
              allowRange={true}
              initialAnchorDate={calendarAnchor}
              onDateChange={onNumDaysChange}
              initialNumDays={numDays}
            />
          </div>
          <div className="grid grid-rows-2 divide-x h-18 divide-gray-200">
            <div className="py-2 pl-2 pr-0.5 gap-1 border-t flex items-center justify-around border-gray-200">
              <div className="text-sm text-gray-500">
                Arrive
                {numDays > 0 && pin.dateStart && (
                  <span className="fade-in text-xs bg-gray-200 rounded-full px-2 py-0.5 ml-2">
                    {DateTime.fromJSDate(pin.dateStart)
                      .toLocaleString({
                        weekday: "long",
                      })
                      .toLowerCase()}
                  </span>
                )}
              </div>
              <div className="flex-1" />
              {timeStart ? (
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
                  clearStartTime();
                }}
              />
              </>
              ) : (
                <AddTimeButton
                  onClick={() => setNewStartTime(8 * 60)}
                />
              )}
            </div>
            <div
              className={`py-2 pl-2 pr-0.5 border-t gap-1 flex items-center justify-around border-gray-200 transition-colors ${
                durationError ? "bg-red-100" : ""
              } ${ timeStart === null ? "opacity-50 [&>*]:pointer-events-none cursor-not-allowed" : "" }`}
            >
              <div className="text-sm text-gray-500">
                Leave
                {numDays > 0 && pin.dateStart && (
                  <span className="fade-in text-xs bg-gray-200 rounded-full px-2 py-0.5 ml-2">
                    {DateTime.fromJSDate(pin.dateStart)
                      .plus({ days: numDays })
                      .toLocaleString({ weekday: "long" })
                      .toLowerCase()}
                  </span>
                )}
              </div>
              <div className="flex-1" />
              {timeLeave ? (
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
                      clearLeaveTime();
                    }}
                  />
                </>
              ) : (
                <AddTimeButton
                  onClick={() => setNewLeaveTime((timeStart ?? 0) + 120)}
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
