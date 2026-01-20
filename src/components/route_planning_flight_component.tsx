import { MdWarning } from "react-icons/md";

export default function RoutePlanningFlightComponent() {
    return (
        <div className="px-4 pt-4 pb-4 border-b border-gray-100">
            <div className="bg-amber-100 text-amber-500 flex items-center px-3 py-2 gap-3 text-xs rounded-lg">
                <MdWarning className="shrink-0 size-4" />
                <span className="flex-1"><span className="font-semibold">Approximation</span><br />Does not reflect actual availability or flight duration.</span>
            </div>
        </div>
    );
}