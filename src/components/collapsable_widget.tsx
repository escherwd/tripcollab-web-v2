import { RiArrowRightSLine } from "@remixicon/react";
import { useState } from "react";
import { MdCalendarMonth, MdChevronRight } from "react-icons/md";

export default function CollapsableWidget({
  children,
  expandedHeight,
}: {
  children: React.ReactNode;
  expandedHeight: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg bg-gray-100 cursor-pointer flex flex-col overflow-hidden">
      <div
        onClick={() => setIsExpanded((e) => !e)}
        className="transition-colors px-4 gap-2 text-gray-800 hover:bg-gray-200 py-2.5 flex-0 text-sm flex items-center justify-between"
      >
        <div><MdCalendarMonth className="size-4" /></div>
        <div className="flex-1">Widget Title</div>
        <div>
          <MdChevronRight className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </div>
      </div>
      <div
        className="transition-all"
        style={{ maxHeight: isExpanded ? expandedHeight : 0 }}
      >
        {children}
      </div>
    </div>
  );
}
