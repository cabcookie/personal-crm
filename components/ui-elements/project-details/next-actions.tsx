import { useProjectsContext } from "@/api/ContextProjects";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import LegacyNextActions from "./legacy-next-actions";

type NextActionsProps = {
  projectId: string;
};

const NextActions: FC<NextActionsProps> = ({ projectId }) => {
  const { projects } = useProjectsContext();
  const [project, setProject] = useState(
    projects?.find((p) => p.id === projectId)
  );

  useEffect(() => {
    setProject(projects?.find((p) => p.id === projectId));
  }, [projects, projectId]);

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Next Actions"
      isVisible={!!project?.myNextActions || !!project?.othersNextActions}
    >
      <LegacyNextActions projectId={projectId} />
    </DefaultAccordionItem>
  );
};

export default NextActions;
