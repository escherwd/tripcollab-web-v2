"use client";

import MenuListEntry from "@/components/menu_list_entry";
import { usePathname } from "next/navigation";
import React from "react";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className=" pt-12 pb-6 border-b border-gray-100">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Settings
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-2xl mt-0 flex gap-4 items-stretch min-h-80">
        <div className="flex-none flex flex-col gap-1 w-56 min-h-full pr-2 border-r border-gray-100 pt-4">
          <MenuListEntry
            title="Profile"
            link="/settings"
            active={pathname == "/settings"}
            chevron
            className="text-base! py-1.5"
          />
          <MenuListEntry
            title="Dates & Distances"
            link="/settings/units"
            active={pathname == "/settings/units"}
            chevron
            className="text-base! py-1.5"
          />
        </div>
        <div className="pt-4 flex-1 w-full pb-12 relative">{children}</div>
      </div>
    </>
  );
}
