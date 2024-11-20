import ButtonGroup from "@/components/ui-elements/btn-group/btn-group";
import { Label } from "@/components/ui/label";
import { projectFilters, ProjectFilters } from "@/helpers/planning";
import { usePlanningProjectFilter } from "../usePlanningProjectFilter";

const PlanWeekFilter = () => {
  const { projectFilter, setProjectFilter } = usePlanningProjectFilter();

  return (
    <div className="space-y-2">
      <Label htmlFor="project-filter" className="mx-2 font-semibold">
        Filter projects
      </Label>
      <ButtonGroup
        elementId="project-filter"
        values={["Open", "In Focus", "On Hold"]}
        selectedValue={projectFilter}
        onSelect={(val: string) =>
          projectFilters.includes(val as ProjectFilters) &&
          setProjectFilter(val as ProjectFilters)
        }
      />
    </div>
  );
};

export default PlanWeekFilter;
