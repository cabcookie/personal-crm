import { toLocaleDateTimeString } from "@/helpers/functional";
import { FC } from "react";

type Activity = {
  id: string;
  updatedAt: Date;
  finishedOn: Date;
};

type ActivityMetaDataProps = {
  activity?: Activity;
};

const ActivityMetaData: FC<ActivityMetaDataProps> = ({ activity }) => {
  return (
    <div style={{ color: "gray", fontSize: "var(--font-size-small)" }}>
      Created: {toLocaleDateTimeString(activity?.finishedOn)}{" "}
      {(activity?.updatedAt.getTime() || 0) -
        (activity?.finishedOn.getTime() || 0) <
      1000 * 60
        ? ""
        : ` – Updated on: ${toLocaleDateTimeString(activity?.updatedAt)}`}
    </div>
  );
};

export default ActivityMetaData;
