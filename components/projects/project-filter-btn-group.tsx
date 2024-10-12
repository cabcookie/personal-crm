import { cn } from "@/lib/utils";
import { FC } from "react";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import {
  PROJECT_FILTERS,
  ProjectFilters,
  useProjectFilter,
} from "./useProjectFilter";

type ProjectFilterBtnGrpProps = {
  className?: string;
};

const ProjectFilterBtnGrp: FC<ProjectFilterBtnGrpProps> = ({ className }) => {
  const { isSearchActive, projectFilter, setProjectFilter } =
    useProjectFilter();

  return (
    !isSearchActive && (
      <div className={cn(className)}>
        <ButtonGroup
          values={PROJECT_FILTERS as ProjectFilters[]}
          selectedValue={projectFilter}
          onSelect={setProjectFilter}
        />
      </div>
    )
  );
};

export default ProjectFilterBtnGrp;
