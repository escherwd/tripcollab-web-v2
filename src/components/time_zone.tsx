import { DateTime } from "luxon";

export default function TimeZoneAbbreviation({
  timeZone,
}: {
  timeZone: string;
}) {
  return (
    <>
      {
        DateTime.now()
          .setZone(timeZone)
          .toLocaleString({ timeZoneName: "short" })
          .split(", ")[1]
      }
    </>
  );
}
