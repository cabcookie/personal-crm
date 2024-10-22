import { cn } from "@/lib/utils";
import { FC } from "react";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import { useMeetingFilter } from "./useMeetingFilter";

type MeetingFilterBtnGrpProps = {
  className?: string;
};

const MeetingFilterBtnGrp: FC<MeetingFilterBtnGrpProps> = ({ className }) => {
  const { availableFilters, onSelectFilter, selectedFilter, isSearchActive } =
    useMeetingFilter();

  return (
    !isSearchActive && (
      <div className={cn(className)}>
        <ButtonGroup
          values={availableFilters}
          selectedValue={selectedFilter}
          onSelect={onSelectFilter}
        />
      </div>
    )
  );
};

export default MeetingFilterBtnGrp;
