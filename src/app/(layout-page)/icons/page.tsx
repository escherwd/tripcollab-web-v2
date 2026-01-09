'use client';

import MapPlaceIcon, { mapIcons } from "@/components/map_place_icon";

export default function IconsViewingPage() {
  return (
    <div className="tc-page-padding">
      <h1>Icons</h1>
      <div className="grid grid-cols-4 gap-2 max-w-sm">
        {Object.values(mapIcons).sort((a, b) => a.color > b.color ? 1 : -1).map((icon) => (
          <div key={icon.categoryId}>
            <MapPlaceIcon tcCategoryId={icon.categoryId} />
          </div>
        ))}
      </div>
    </div>
  );
}
