import {
  MapRightClickEvent,
  projectEmitter,
  projectEventReceiver,
} from "@/app/utils/controllers/project_controller";
import { mapController, MapMarker, MapProject } from "./global_map";
import ContextMenu from "./context_menu";
import MenuListEntry from "./menu_list_entry";
import { MdContentCopy } from "react-icons/md";
import { useMemo } from "react";

export default function ProjectMapContextMenu({
  project,
  rightClickEvent,
  setRightClickEvent,
}: {
  project: MapProject;
  rightClickEvent: MapRightClickEvent;
  setRightClickEvent: (e: MapRightClickEvent | undefined) => void;
}) {
  const mapMarker = useMemo(
    () => ({
      coordinate: {
        lat: rightClickEvent.lat,
        lng: rightClickEvent.lng,
      },
      ephemeralId: `dropped-pin-${rightClickEvent.lat}-${rightClickEvent.lng}`,
      appleMapsPlace: {
        name: "Dropped Pin",
        muid: `needs-reverse-geocode:${rightClickEvent.lat},${rightClickEvent.lng}`,
        coordinate: {
          lat: rightClickEvent.lat,
          lng: rightClickEvent.lng,
        },
      },
    }),
    [rightClickEvent],
  );

  const addPin = async () => {
    await mapController.openMarker(mapMarker);
  };

  const createRoute = async (toHere: boolean) => {

    projectEventReceiver.didClickRoutePlanner(toHere ? null : mapMarker, toHere ? mapMarker : null);
  };

  const copyCoords = () => {
    navigator.clipboard.writeText(`${rightClickEvent.lat}, ${rightClickEvent.lng}`)
  }

  return (
    <div
      className="z-40 fixed h-screen w-screen"
      onClick={(e) => {
        e.preventDefault();
        setRightClickEvent(undefined);
      }}
    >
      <div
        className="absolute w-44 bg-white rounded-lg"
        style={{
          top: rightClickEvent?.y,
          left: rightClickEvent?.x,
        }}
      >
        <ContextMenu>
          <div>
            <MenuListEntry title="Add Pin" onClick={addPin} />
          </div>
          <div>
            <MenuListEntry
              title="Route from here"
              onClick={() => createRoute(false)}
            />
            <MenuListEntry
              title="Route to here"
              onClick={() => createRoute(true)}
            />
          </div>
          <div>
            <MenuListEntry
              title={`${rightClickEvent.lat.toFixed(4)}, ${rightClickEvent.lng.toFixed(4)}`}
              onClick={copyCoords}
            >
              <MdContentCopy className="text-gray-400 size-4" />
            </MenuListEntry>
          </div>
        </ContextMenu>
      </div>
    </div>
  );
}
