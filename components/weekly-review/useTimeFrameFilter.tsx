import { createContext, FC, useContext, useState } from "react";

export const TIME_FRAME_OPTIONS = ["1 Week", "2 Weeks", "4 Weeks", "8 Weeks"];
const TIME_FRAME_OPTIONS_CONST = [
  "1 Week",
  "2 Weeks",
  "4 Weeks",
  "8 Weeks",
] as const;
export type TimeFrameOptions = (typeof TIME_FRAME_OPTIONS_CONST)[number];

const TIME_FRAME_TO_WEEKS: Record<TimeFrameOptions, number> = {
  "1 Week": 1,
  "2 Weeks": 2,
  "4 Weeks": 4,
  "8 Weeks": 8,
};

const isValidTimeFrame = (frame: string): frame is TimeFrameOptions =>
  TIME_FRAME_OPTIONS_CONST.includes(frame as TimeFrameOptions);

interface TimeFrameFilterType {
  timeFrame: TimeFrameOptions;
  weeksToReview: number;
  setTimeFrame: (frame: string) => void;
}

const TimeFrameFilter = createContext<TimeFrameFilterType | null>(null);

export const useTimeFrameFilter = () => {
  const context = useContext(TimeFrameFilter);
  if (!context)
    throw new Error(
      "useTimeFrameFilter must be used within TimeFrameFilterProvider"
    );
  return context;
};

interface TimeFrameFilterProviderProps {
  children: React.ReactNode;
}

export const TimeFrameFilterProvider: FC<TimeFrameFilterProviderProps> = ({
  children,
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrameOptions>("1 Week");

  const onTimeFrameChange = (newFrame: string) => {
    if (isValidTimeFrame(newFrame)) {
      setTimeFrame(newFrame);
    }
  };

  const weeksToReview = TIME_FRAME_TO_WEEKS[timeFrame];

  return (
    <TimeFrameFilter.Provider
      value={{
        timeFrame,
        weeksToReview,
        setTimeFrame: onTimeFrameChange,
      }}
    >
      {children}
    </TimeFrameFilter.Provider>
  );
};
