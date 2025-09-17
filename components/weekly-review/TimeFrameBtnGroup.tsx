import { cn } from "@/lib/utils";
import { FC } from "react";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import {
  TIME_FRAME_OPTIONS,
  TimeFrameOptions,
  useTimeFrameFilter,
} from "./useTimeFrameFilter";

type TimeFrameBtnGroupProps = {
  className?: string;
};

const TimeFrameBtnGroup: FC<TimeFrameBtnGroupProps> = ({ className }) => {
  const { timeFrame, setTimeFrame } = useTimeFrameFilter();

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      <ButtonGroup
        values={TIME_FRAME_OPTIONS as TimeFrameOptions[]}
        selectedValue={timeFrame}
        onSelect={setTimeFrame}
      />
    </div>
  );
};

export default TimeFrameBtnGroup;
