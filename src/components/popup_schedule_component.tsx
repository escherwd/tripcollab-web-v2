import { CalendarIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { mapController, MapPin, MapProject } from "./global_map";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import CalendarComponent from "./calendar_component";
import { updatePin } from "@/app/api/project/update_pin";
import { Prisma } from "@prisma/client";
import { debounce } from "@/app/utils/ui/debounce";
import _ from "lodash";

export default function PopupScheduleComponent({
  project,
  pin,
}: {
  project: MapProject;
  pin: MapPin;
}) {
  const [expanded, setExpanded] = useState(false);
  const [timeStart, setTimeStart] = useState(pin?.timeStart ?? 0);
  const [duration, setDuration] = useState(pin?.duration ?? 0);

  const savePinUpdates = async (data: Prisma.PinUpdateInput) => {
    if (!pin?.id) {
      return;
    }
    console.log("Updated pin", pin.id, data);
    mapController.setProject({
      ...project,
      pins: project.pins.map((p) =>
        p.id === pin.id ? { ...p, ...(data as any) } : p
      ),
    });

    const sendUpdate = async () => {
      await updatePin(pin.id, data);
    };
    // Debounce this request
    debounce(sendUpdate, "schedule-component-update", 300);
  };

  // Convert minutes to HH:MM string
  const timeStartString = useMemo(() => {
    if (!timeStart) {
      return "00:00";
    }
    return `${Math.floor(timeStart / 60)
      .toString()
      .padStart(2, "0")}:${(timeStart % 60).toString().padStart(2, "0")}`;
  }, [timeStart]);

  // Handle start time changes
  const onTimeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes =
      parseInt(e.target.value.split(":")[0]) * 60 +
      parseInt(e.target.value.split(":")[1]);
    setTimeStart(minutes);
    savePinUpdates({ timeStart: minutes });
  };

  const onDurationChange = ({
    days,
    hours,
    minutes,
  }: {
    days?: number;
    hours?: number;
    minutes?: number;
  }) => {
    console.log("onDurationChange", duration, days, hours, minutes);
    days = days ?? Math.floor(duration / 24 / 60) ?? 0;
    hours = hours ?? Math.floor((duration % (24 * 60)) / 60) ?? 0;
    minutes = minutes ?? duration % 60 ?? 0;
    console.log("onDurationChange", days, hours, minutes);
    const newDuration =
      (days ?? 0) * 24 * 60 + (hours ?? 0) * 60 + (minutes ?? 0);
    setDuration(newDuration);
    savePinUpdates({ duration: newDuration });
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
              {
                pin?.dateStart && pin.timeStart && (
                  " – " + timeStartString
                )
              }
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
          className={`transition-all duration-300 h-72 flex flex-col ${
            expanded ? "max-h-72" : "max-h-0"
          }`}
        >
          <div className="flex-none h-[214px] bg-gray-50">
            <CalendarComponent
              dense={true}
              project={project}
              date={pin?.dateStart ? DateTime.fromJSDate(pin.dateStart) : null}
              onDateChange={(d) => savePinUpdates({ dateStart: d?.toJSDate() })}
            />
          </div>
          <div className="py-2 px-2 border-t flex items-center justify-between border-gray-200">
            <div className="text-sm text-gray-500">Time</div>
            <input
              defaultValue={timeStartString}
              type="time"
              className="text-sm text-gray-500"
              onChange={onTimeStartChange}
            />
          </div>
          <div className="py-2 px-2 border-t grid grid-cols-3 items-center justify-center border-gray-200">
            <div className="flex items-center justify-start gap-1.5">
              <div className="text-sm text-gray-500">Days</div>
              <input
                type="number"
                className="text-sm text-gray-800 w-9 tc-input-always-show-arrows"
                placeholder="00"
                defaultValue={Math.floor(duration / 24 / 60)
                  .toString()
                  .padStart(2, "0")}
                onChange={(e) => {
                  onDurationChange({ days: parseInt(e.target.value) });
                  e.target.value = (parseInt(e.target.value) ?? 0)
                    .toString()
                    .padStart(2, "0");
                }}
                max={99}
                min={0}
                step={1}
              />
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <div className="text-sm text-gray-500">Hrs</div>
              <input
                type="number"
                className="text-sm text-gray-800 w-9 tc-input-always-show-arrows"
                placeholder="00"
                defaultValue={Math.floor((duration % (24 * 60)) / 60)
                  .toString()
                  .padStart(2, "0")}
                onChange={(e) => {
                  onDurationChange({ hours: parseInt(e.target.value) });
                  e.target.value = (parseInt(e.target.value) ?? 0)
                    .toString()
                    .padStart(2, "0");
                }}
                max={23}
                min={0}
                step={1}
              />
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <div className="text-sm text-gray-500">Min</div>
              <input
                type="number"
                className="text-sm text-gray-800 w-9 tc-input-always-show-arrows"
                placeholder="00"
                defaultValue={(duration % 60)?.toString().padStart(2, "0")}
                onChange={(e) => {
                  onDurationChange({ minutes: parseInt(e.target.value) });
                  e.target.value = (parseInt(e.target.value) ?? 0)
                    .toString()
                    .padStart(2, "0");
                }}
                max={59}
                min={0}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
