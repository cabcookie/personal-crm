import { FC } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const prayerStatus = [
  { value: "NONE", label: "No" },
  { value: "PRAYING", label: "Praying" },
  { value: "ANSWERED", label: "Answered" },
  { value: "NOTANSWERED", label: "Not Answered" },
] as const;

export type TPrayerStatus = (typeof prayerStatus)[number]["value"];

type PrayerStatusProps = {
  status: TPrayerStatus;
  onChange: (status: TPrayerStatus) => void;
  editable: boolean;
};

const PrayerStatus: FC<PrayerStatusProps> = ({
  status,
  onChange,
  editable,
}) => {
  return (
    <div
      className={cn(
        "inline-flex rounded-md py-1 items-center transition-all duration-500 ease-in-out text-muted-foreground",
        editable && "px-1 bg-muted"
      )}
    >
      {prayerStatus.map(({ value, label }) => (
        <Button
          key={value}
          disabled={!editable}
          variant={
            value === status ? (editable ? "contextColor" : "outline") : "ghost"
          }
          className={cn(
            "h-7 px-2 text-xs opacity-100 transition-all duration-500 ease-in-out",
            value === status && "z-30 text-primary",
            !editable && value !== status && "hidden"
          )}
          onClick={() => onChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default PrayerStatus;
