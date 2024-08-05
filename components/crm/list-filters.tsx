import ButtonGroup from "../ui-elements/btn-group/btn-group";
import { useCrmProjectsFilter } from "./list-filter-context";

const CrmProjectsListFilter = () => {
  const { availableFilters, onSelectFilter, selectedFilter } =
    useCrmProjectsFilter();

  return (
    <ButtonGroup
      values={availableFilters}
      selectedValue={selectedFilter}
      onSelect={onSelectFilter}
    />
  );
};

export default CrmProjectsListFilter;
