import { FC } from "react";

type Activity = {
  id: string;
  updatedAt: Date;
  finishedOn: Date;
};

type ActivityMetaDataProps = {
  activity: Activity;
};

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

const makeLocaleString = (date: Date) =>
  date.toLocaleDateString(undefined, dateTimeOptions);

const ActivityMetaData: FC<ActivityMetaDataProps> = ({ activity }) => {
  return (
    <div style={{ color: "gray", fontSize: "var(--font-size-small)" }}>
      Created: {makeLocaleString(activity.finishedOn)}{" "}
      {activity.updatedAt.getTime() - activity.finishedOn.getTime() < 1000 * 60
        ? ""
        : ` – Updated on: ${makeLocaleString(activity.updatedAt)}`}
    </div>
  );
};

export default ActivityMetaData;
