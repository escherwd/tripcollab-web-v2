'use client'

import { serverUpdateUser } from "@/app/api/users/update_user";
import { AppUser } from "@/backend/auth/get_user";
import TcButton from "@/components/button";
import { RiLoaderFill } from "@remixicon/react";
import { useState } from "react";

export default function UnitSettingsContent({ user }: { user: AppUser }) {
  const [
    [distanceUnits, setDistanceUnits],
    [timeType, setTimeType],
  ] = [
    useState(user.localeSettings.distance),
    useState(user.localeSettings.time),
  ];

  const [isUpdating, setIsUpdating] = useState(false);

  const clientUpdate = async () => {
    setIsUpdating(true);
    try {
      const newData = await serverUpdateUser({
        localeSettings: {
          distance: distanceUnits,
          time: timeType
        }
      });
      setTimeType(newData.localeSettings.time);
      setDistanceUnits(newData.localeSettings.distance);
    } catch (e) {
      alert(e);
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="tc-settings-input-group">
        <div>Distance Units</div>
        <select className="tc-input" value={distanceUnits} onChange={(e) => setDistanceUnits(e.target.value === "miles" ? 'miles' : 'km')}>
          <option value={'km'}>Kilometers, meters</option>
          <option value={'miles'}>Miles, feet</option>
        </select>
      </div>
      <div className="tc-settings-input-group">
        <div>Date & Time Format</div>
        <select className="tc-input" value={timeType} onChange={(e) => setTimeType(Number.parseInt(e.target.value) === 24 ? 24 : 12)}>
          <option value={24}>24 Hour – DD/MM/YYYY</option>
          <option value={12}>12 Hour (am/pm) – MM/DD/YYYY</option>
        </select>
        <span>Time input fields will follow system settings.</span>
      </div>
      <div className="border-t border-gray-100 gap-4 items-center py-4 flex justify-end sticky bottom-0 w-full bg-white">
        {isUpdating && <RiLoaderFill className="animate-spin size-6" />}

        <TcButton primary disabled={isUpdating} onClick={clientUpdate}>
          Save Changes
        </TcButton>
      </div>
    </div>
  );
}
