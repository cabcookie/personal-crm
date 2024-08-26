import { useProjectsContext } from "@/api/ContextProjects";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import ProjectInformation from "./ProjectInformation";
import ProjectTitleAndLink from "./ProjectTitleAndLink";

type TodoProjectInfosProps = {
  projectIds: string[];
};

const TodoProjectInfos: FC<TodoProjectInfosProps> = ({ projectIds }) => {
  const { projects } = useProjectsContext();
  return (
    <div className="space-y-2 mt-4">
      <div className="font-bold">Project Infos:</div>
      {flow(
        map((id: string) => projects?.find((p) => p.id === id)),
        filter((p) => !!p),
        map((p) => (
          <div key={p.id}>
            <ProjectTitleAndLink
              projectId={p.id}
              projectName={p.project}
              as="div"
            />
            <ProjectInformation project={p} />
          </div>
        ))
      )(projectIds)}
    </div>
  );
};

export default TodoProjectInfos;
