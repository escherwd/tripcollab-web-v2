"use client";

import { AppUser } from "@/backend/auth/get_user";
import Link from "next/link";
import MenuListEntry from "./menu_list_entry";



export default function NavBarProfileComponent({ user }: { user: AppUser }) {
  return (
    <div className="hover:[&>#nav-menu]:block relative w-min">
      <Link
        href={`/${user.username}`}
        className="tc-nav-button flex items-center gap-4 relative z-20"
      >
        <span className="whitespace-nowrap">Hello, {user.firstName}</span>
        <div
          id="profile-photo"
          className="size-6 shrink-0 block rounded-full bg-gray-200 overflow-hidden"
        >
          {user.profilePictureUrl && (
            <img
              src={user.profilePictureUrl}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>
      </Link>
      <div
        id="nav-menu"
        className="hover:block hidden absolute -right-[4px] w-54 -top-2 pt-[calc(var(--spacing-navbar)-4px)] -z-0"
      >
        <div className="fade-in absolute top-navbar -mt-[10px] -right-4 w-2/1 h-2/1 z-0 bg-gradient-to-tr from-transparent via-transparent to-[var(--page-bg-color)]/60 pointer-events-none"></div>
        <div className="bg-white z-10 relative tc-panel h-min w-full rounded-lg !shadow-xl overflow-hidden origin-top-right divide-y divide-gray-100">
          <div className="p-1">
            <MenuListEntry chevron title="Profile" link={`/${user.username}`} />
            <MenuListEntry chevron title="Projects" link="/projects">
              13
            </MenuListEntry>
            <MenuListEntry chevron title="Shared With Me" link="/projects/shared">
              3
            </MenuListEntry>
          </div>
          <div className="p-1 ">
            <div className="py-1 px-2 text-sm flex justify-between items-center">
              <span>Appearance</span>
              <span className="text-xs text-gray-400">WIP</span>
            </div>
          </div>
          <div className="p-1">
            <MenuListEntry
              title="Changelog"
              link="/changelog"
              chevron
            >
              <div className="text-xs font-mono font-medium rounded-full px-2 py-0.5 bg-gray-100 text-gray-400">v0.1</div>
            </MenuListEntry>
            <MenuListEntry
              title="Submit Feedback"
              link="/feedback"
              chevron
            />
            <MenuListEntry
              title="Settings"
              link="/settings"
              chevron
            />
            <MenuListEntry
              title="Sign Out"
              link="/logout"
              className="text-red-500 hover:bg-red-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
