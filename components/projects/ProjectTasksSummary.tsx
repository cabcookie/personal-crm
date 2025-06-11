import useProjectTodos from "@/api/useProjectTodos";
import { FC, useEffect, useState } from "react";

type ProjectTasksSummaryProps = {
  projectId: string;
  className?: string;
};

const ProjectTasksSummary: FC<ProjectTasksSummaryProps> = ({
  projectId,
  className,
}) => {
  const { getOrGenerateTasksSummary } = useProjectTodos(projectId);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    const getSummary = async () => {
      const result = await getOrGenerateTasksSummary(projectId);
      setSummary(result);
    };
    getSummary();
  }, [getOrGenerateTasksSummary, projectId]);

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-muted-foreground pb-1">
        {!summary ? "No open tasks." : "Open Tasks"}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
};

export default ProjectTasksSummary;
