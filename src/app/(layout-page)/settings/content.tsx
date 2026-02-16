"use client";

import { AppUser, getUser } from "@/backend/auth/get_user";
import SettingsPageLayout from "./layout";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import prisma from "@/backend/prisma";
import TcButton from "@/components/button";
import { serverUpdateUser } from "@/app/api/users/update_user";
import { RiLoaderFill } from "@remixicon/react";

export default function UserSettingsContent({ user }: { user: AppUser }) {
  const [
    [firstName, setFirstName],
    [username, setUsername],
    [bio, setBio],
    [location, setLocation],
    [website, setWebsite],
  ] = [
    useState(user.firstName),
    useState(user.username),
    useState(user.bio),
    useState(user.location),
    useState(user.website),
  ];

  const [isUpdating, setIsUpdating] = useState(false)
  

  const clientUpdate = async () => {
    setIsUpdating(true)
    try {
      const newData = await serverUpdateUser({
        firstName,
        username,
        bio,
        location,
        website
      })
      setFirstName(newData.firstName)
      setUsername(newData.username)
      setBio(newData.bio)
      setLocation(newData.location)
      setWebsite(newData.website)
    } catch (e) {
      alert(e)
    }
    setIsUpdating(false)
  }

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="tc-settings-input-group">
        <div>Display Name</div>
        <input
          type="text"
          className="tc-input"
          placeholder={user?.firstName}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="tc-settings-input-group">
        <div>Username</div>
        <input
          type="text"
          className="tc-input"
          placeholder={user?.username}
          value={username}
          onChange={(e) => setUsername(e.target.value.replaceAll(' ', '-'))}
        />
        <span>
          <div className="text-gray-600 mb-1">tripcollab.app/{username}</div>
          Must be 3+ characters and contain no spaces.
        </span>
      </div>
      <div className="tc-settings-input-group">
        <div>Biography</div>
        <textarea
          className="tc-input"
          rows={5}
          placeholder={user?.bio ?? ""}
          value={bio ?? ""}
          onChange={(e) => setBio(e.target.value.slice(0, 400))}
        />
        <span>Maximum 400 characters</span>
      </div>
      <div className="tc-settings-input-group">
        <div>Location</div>
        <input
          type="text"
          className="tc-input"
          placeholder={user?.location ?? ""}
          value={location ?? ""}
          onChange={(e) => setLocation(e.target.value)}
        />
        <span>Visible to all users</span>
      </div>
      <div className="tc-settings-input-group">
        <div>Website</div>
        <input
          type="url"
          className="tc-input"
          placeholder={user?.website ?? ""}
          value={website ?? ""}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <span>Visible to all users</span>
      </div>
      <div className="tc-settings-input-group">
        <div>Email</div>
        <input type="email" readOnly value={user.email} className="tc-input" />
        <span>Your email cannot be changed</span>
      </div>
      <div className="border-t border-gray-100 gap-4 items-center py-4 flex justify-end sticky bottom-0 w-full bg-white">
        {
          isUpdating && <RiLoaderFill className="animate-spin size-6" />
        }
        
        <TcButton primary disabled={isUpdating} onClick={clientUpdate}>Save Changes</TcButton>
      </div>
    </div>
  );
}
