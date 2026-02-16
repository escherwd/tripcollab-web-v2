import {
  MdAirlineStops,
  MdCallSplit,
  MdClose,
  MdPolyline,
  MdRefresh,
  MdRoute,
} from "react-icons/md";
import { mapController, MapMarker, MapProject } from "./global_map";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  ClipboardIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { RiFileCopyLine, RiLoaderFill, RiRouteFill } from "react-icons/ri";
import { AppleMapsPlace, getPlaceAppleMaps } from "@/app/api/maps/place";
import { useEffect, useMemo, useRef, useState } from "react";
import { Prisma } from "@prisma/client";
import { addPin } from "@/app/api/project/add_pin";
import { deletePin } from "@/app/api/project/delete_pin";
import CalendarComponent from "./calendar_component";
import { DateTime, Zone } from "luxon";
import PopupScheduleComponent from "./popup_schedule_component";
import { projectEventReceiver } from "@/app/utils/controllers/project_controller";
import ColorInput from "./color_input";
import PanelIconButton from "./panel_icon_button";
import { userCanEdit } from "@/app/(layout-map)/t/[slug]/content";
import TcButton from "./button";

export default function MapPlacePopup({
  marker,
  onClose,
  onMarkerUpdate,
  // onStyleUpdate,
  project,
}: {
  marker: MapMarker;
  onClose: () => void;
  onMarkerUpdate?: (marker: MapMarker) => void;
  // onStyleUpdate?: (style: PrismaJson.PinStyleType) => void;
  project: MapProject;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToProject, setIsAddingToProject] = useState(false);
  const [place, setPlace] = useState<AppleMapsPlace | null>(null);

  const [tempId, setTempId] = useState<string | null>(null);

  const [iconColor, setIconColor] = useState<string | null>(
    marker.customColor ?? null,
  );

  // const [scheduleWidgetExpanded, setScheduleWidgetExpanded] = useState(false);

  const coordinates = useMemo(() => {
    return place?.coordinate ?? marker.coordinate;
  }, [place, marker]);

  const pin = useMemo(() => {
    return project.pins.find((p) => p.id === (tempId ?? marker.id));
  }, [project.pins, marker.id, tempId]);

  const [pinScheduleTime, setPinScheduleTime] = useState<{
    time?: DateTime | null;
    minutes?: number | null;
    hours?: number | null;
    days?: number | null;
  }>({
    time: null,
    minutes: 0,
    hours: 0,
    days: 0,
  });

  const updatePinScheduleTime = ({
    time,
    minutes,
    hours,
    days,
  }: {
    time?: DateTime | null;
    minutes?: number | null;
    hours?: number | null;
    days?: number | null;
  }) => {
    setPinScheduleTime({
      time: time ?? pinScheduleTime.time,
      minutes: Math.min(
        Math.max(minutes ?? pinScheduleTime.minutes ?? 0, 0),
        59,
      ),
      hours: Math.min(Math.max(hours ?? pinScheduleTime.hours ?? 0, 0), 23),
      days: Math.min(Math.max(days ?? pinScheduleTime.days ?? 0, 0), 99),
    });
  };

  // Prevent setting state with async requests after component has been unmounted
  const isMounted = useRef(false);

  const fetchPlaceInfo = async () => {
    setIsLoading(true);

    if (!marker.appleMapsPlace?.muid || isLoading) {
      return;
    }

    const bounds = await mapController.getMapBounds();

    if (!bounds) {
      return;
    }

    const data = await getPlaceAppleMaps(marker.appleMapsPlace?.muid, {
      lng: bounds.getCenter().lng,
      lat: bounds.getCenter().lat,
      deltaLng: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
      deltaLat: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
    });

    if (!isMounted.current) return;

    console.log(data);
    setPlace(data);

    setIsLoading(false);

    const matchedPin = project.pins.find((p) => p.appleMapsMuid === data?.muid);
    if (matchedPin) {
      setTempId(matchedPin.id);
    }

    if (data) {
      onMarkerUpdate?.({
        ...marker,
        // id: matchedPin?.id ?? marker.id,
        appleMapsPlace: data,
      });
    }
  };

  const isInProject = useMemo(() => {
    return project.pins.some((p) => p.id === (tempId ?? marker.id));
  }, [project.pins, marker.id, tempId]);

  const [wasAddedThisRender, setWasAddedThisRender] = useState(false);

  const categoryName = useMemo(() => {
    return (
      place?.containmentPlace?.text ??
      place?.categoryName ??
      marker.appleMapsPlace?.categoryName
    );
  }, [place, marker]);

  // Prevents multiple requests
  let hasRequested = false;

  useEffect(() => {
    isMounted.current = true;
    if (pin) {
      setPlace({
        name: pin.name,
        coordinate: {
          lat: pin.latitude,
          lng: pin.longitude,
        },
        address: (pin.extendedMetadata as any)["address"],
        categoryId: (pin.extendedMetadata as any)["categoryId"],
        categoryName: (pin.extendedMetadata as any)["categoryName"],
        photos: (pin.extendedMetadata as any)["images"],
        textBlock: (pin.extendedMetadata as any)["text"],
        muid:
          pin.appleMapsMuid ?? marker.appleMapsPlace?.muid ?? "mapbox-feature",
      });
    } else if (!hasRequested) {
      fetchPlaceInfo();
    }

    hasRequested = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // This is not great
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

    console.log("Calling onMarkerUpdate for pin", pin.id, data);

    // if (!wasAddedThisRender) return;

    // This is only necessary if the pin being displayed is still the temporary one
    // onMarkerUpdate?.({
    //   ...marker,
    //   customColor: (data.styleData as PrismaJson.PinStyleType)?.['iconColor'],
    // })
    // TODO: Do not cast to any
    // await updatePin(pin.id, data as any);
  };

  const toggleInProject = async () => {
    setIsAddingToProject(true);

    try {
      if (isInProject) {
        // Remove from project
        if (!(tempId ?? marker.id)) {
          throw new Error("No pin ID found");
        }
        console.log("Deleting pin", tempId);
        await deletePin(project.id, tempId ?? marker.id!);

        mapController.setProject({
          ...project,
          pins: project.pins.filter((p) => p.id !== (tempId ?? marker.id)),
        });
        setTempId("deleted-" + self.crypto.randomUUID());
        onClose();
      } else {
        // Add to project
        const pin = await addPin(project.id, {
          ...marker,
          appleMapsPlace: place ?? undefined,
        });
        setTempId(pin.id);
        mapController.setProject({
          ...project,
          pins: [...project.pins, pin],
        });
        mapController.closeMarker(marker);
        console.log("Added to project", pin);
        setWasAddedThisRender(true);
      }
    } catch (error) {
      console.error(error);
    }
    setIsAddingToProject(false);
  };

  const openRoutePlanner = () => {
    projectEventReceiver.didClickRoutePlanner(marker);
  };

  const onPinColorChange = (color: string | null) => {
    if (!pin || pin.styleData?.iconColor === color) {
      return;
    }

    setIconColor(color);

    savePinUpdates({
      styleData: {
        ...(pin.styleData ?? {}),
        iconColor: color ?? undefined,
      },
    });
  };

  const timeZone = useMemo(() => {
    const tzName = place?.timeZone ?? pin?.zoneName;
    if (!tzName) return null
    const now = DateTime.now().setZone(tzName)
    return {
      name: tzName,
      offset: now.get('offsetNameShort'),
      currentTime: now.toLocaleString(DateTime.TIME_SIMPLE)
    }
  }, [place, pin]);

  return (
    <div className="size-full flex flex-col bg-white rounded-lg shadow-lg z-40 relative">
      {/* <button
        onClick={onClose}
        className="absolute z-50 top-4 right-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full p-1 text-gray-500 hover:text-gray-700"
      >
        <XMarkIcon className="size-4" />
      </button> */}
      <PanelIconButton
        className=" absolute z-50 top-4 right-4"
        icon={<XMarkIcon className="size-4" />}
        onClick={onClose}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="pl-4 pt-4 pb-3 border-b border-gray-100 mb-4 pr-14">
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-xl font-display font-semibold leading-6">
              {marker.appleMapsPlace?.name}
            </div>
            <div className="text-sm text-gray-500">{categoryName}</div>
          </div>
        </div>
        {isInProject && pin && (
          <>
            <div className="p-4 pt-0 rounded-lg">
              <ColorInput
                initialColor={iconColor ?? undefined}
                onColorChange={onPinColorChange}
                viewOnly={!userCanEdit}
              />
            </div>
            <PopupScheduleComponent project={project} pin={pin} />
          </>
        )}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center pt-24">
            <RiLoaderFill className="text-gray-400 size-5 animate-spin" />
          </div>
        ) : (
          <div className="fade-in">
            {place?.photos && (
              <div className="flex flex-col gap-1.5 px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {place?.photos.slice(0, 2).map((photo, index) => (
                    <div
                      key={photo.id + index.toString()}
                      className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      <img
                        src={photo.url}
                        alt={photo.category}
                        className="size-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {place?.textBlock && (
              <div className="flex flex-col gap-1.5 px-4 pb-4">
                <div className="flex justify-between gap-2">
                  <span>About</span>
                  <a
                    href={place?.textBlock?.attributionUrl}
                    target="_blank"
                    className="flex text-xs font-medium text-gray-400 items-center gap-1"
                  >
                    <span>Wikipedia</span>
                    <ArrowUpRightIcon className="size-3 mt-px" />
                  </a>
                </div>
                <div className="text-sm text-gray-500 line-clamp-5">
                  {place?.textBlock?.text}
                </div>
              </div>
            )}
            {place?.address && (
              <div className="flex flex-col gap-1.5 px-4 pb-4">
                <div className="">Address</div>
                <div className="flex gap-2 items-start">
                  <div className="text-sm text-gray-500 line-clamp-5 flex-1">
                    {place?.address}
                  </div>
                  <button
                    className="text-sm cursor-pointer text-gray-300 hover:bg-gray-100 hover:text-gray-400 rounded-full -mt-1 p-1.5"
                    onClick={() =>
                      navigator.clipboard.writeText(place?.address ?? "")
                    }
                  >
                    <DocumentDuplicateIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1.5 px-4 pb-4">
              <div className="">Coordinates</div>
              <div className="flex gap-2 items-start">
                <div className="text-sm text-gray-500 line-clamp-5 flex-1">
                  {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </div>
                <button
                  className="text-sm cursor-pointer text-gray-300 hover:bg-gray-100 hover:text-gray-400 rounded-full -mt-1 p-1.5"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      coordinates.lat + ", " + coordinates.lng,
                    )
                  }
                >
                  <DocumentDuplicateIcon className="size-4" />
                </button>
              </div>
            </div>
            {timeZone && (
              <div className="flex flex-col gap-1.5 px-4 pb-4">
                <div className="">Time Zone</div>
                <div className="text-sm text-gray-500">
                  <div>{timeZone.name} ({timeZone.offset})</div>
                  <div>Current Time: {timeZone.currentTime}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="py-2 px-4 grid grid-cols-2 gap-2 border-t border-gray-100">
        <TcButton
        destructive={isInProject}
        primary={!isInProject}
          className="dense"
          onClick={toggleInProject}
          disabled={isAddingToProject || !userCanEdit}
        >
          {isAddingToProject ? (
            <RiLoaderFill className="size-4 animate-spin" />
          ) : isInProject ? (
            <TrashIcon className="size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          {isInProject ? "Remove" : "Add to Trip"}
        </TcButton>
        <button className="tc-button dense" onClick={openRoutePlanner}>
          <MdRoute className="size-4" />
          Create Route
        </button>
      </div>
    </div>
  );
}
