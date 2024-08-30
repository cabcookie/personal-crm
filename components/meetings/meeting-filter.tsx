import ButtonGroup from "../ui-elements/btn-group/btn-group";
import { useMeetingFilter } from "./useMeetingFilter";

const MeetingFilter = () => {
  const { availableFilters, onSelectFilter, selectedFilter } =
    useMeetingFilter();
  return (
    <ButtonGroup
      values={availableFilters}
      selectedValue={selectedFilter}
      onSelect={onSelectFilter}
    />
  );
};

export default MeetingFilter;
