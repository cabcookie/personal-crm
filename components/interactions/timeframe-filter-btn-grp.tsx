import { FC } from "react";
import { useInteractionFilter } from "./useInteractionFilter";
import { cn } from "@/lib/utils";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import {
  INTERACTION_TIME_FILTER,
  InteractionTimeFilter,
} from "@/helpers/interactions";

type InteractionTimeFilterBtnGrpProps = {
  className?: string;
};

const InteractionTimeFilterBtnGrp: FC<InteractionTimeFilterBtnGrpProps> = ({
  className,
}) => {
  const { weeks, setWeeks } = useInteractionFilter();

  return (
    <div className={cn(className)}>
      <div className="font-semibold">Weeks:</div>
      <ButtonGroup
        values={INTERACTION_TIME_FILTER as InteractionTimeFilter[]}
        selectedValue={weeks}
        onSelect={setWeeks}
      />
    </div>
  );
};

export default InteractionTimeFilterBtnGrp;
