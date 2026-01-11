import { RiAddFill, RiArrowUpLine, RiLayoutRight2Line, RiSideBarFill, RiSideBarLine, RiSubtractFill } from "@remixicon/react";
import { mapController } from "./global_map";

export default function MapControlsComponent({ mapRotation, setSidebarOpen, sidebarOpen }: { mapRotation?: number, setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>, sidebarOpen: boolean }) {


    const resetRotation = () => {
        mapController.resetMapRotation();
    }

    const zoomIn = () => {
        mapController.zoomIn();
    }

    const zoomOut = () => {
        mapController.zoomOut();
    }

  return (
    <div className="absolute pointer-events-auto top-navbar text-gray-700 right-72 flex flex-col gap-2">
      <div className="tc-panel">
        <button className="tc-map-control-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {
            sidebarOpen ? <RiSideBarFill className="rotate-180" size={16} /> : <RiSideBarLine className="rotate-180" size={16} />
            }
          
        </button>
      </div>
      <div className="tc-panel flex flex-col divide-y divide-gray-100">
        <button  className="tc-map-control-button" onClick={zoomIn}>
          <RiAddFill size={16} />
        </button>
        <button className="tc-map-control-button" onClick={zoomOut}>
          <RiSubtractFill size={16} />
        </button>
      </div>
      <div className="tc-panel">
        <button className="tc-map-control-button flex flex-col gap-2" onClick={resetRotation}>
          <RiArrowUpLine  size={16} style={{ transform: `rotate(${mapRotation}deg)`}} />
          <span className="text-xs font-display font-medium">N</span>
        </button>
      </div>
    </div>
  );
}
