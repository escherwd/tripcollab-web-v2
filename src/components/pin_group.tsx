import { RiAddFill, RiAddLine } from "@remixicon/react";
import { MapPin } from "./global_map";
import MapPlaceIcon from "./map_place_icon";

export default function PinGroup({
  pins,
  onClick,
}: {
  pins: MapPin[];
  onClick?: () => void;
}) {
  const onClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="flex flex-col w-min justify-center items-center cursor-pointer"
      onClick={onClickWrapper}
    >
      <div className="flex items-center w-min">
        {pins.slice(0, 3).map((pin, idx) => (
          <div
            key={idx}
            className="scale-75 -ml-5 first:ml-0 rounded-full inline-block shadow-md"
          >
            <MapPlaceIcon
              customColor={pin.styleData?.iconColor}
              tcCategoryId={pin.styleData?.iconId}
              border={true}
            />
          </div>
        ))}
      </div>
      {pins.length > 3 && (
        <span className="z-20 text-gray-700 font-medium pl-1 pr-2 py-0.5 flex items-center whitespace-nowrap bg-linear-to-b from-white to-gray-50 rounded-full shadow-lg">
          <RiAddFill className="inline-block" size={14} />
          <span className="text-xs">{pins.length - 3}</span>
        </span>
      )}
    </div>
  );
}
