import { Project, useProjectsContext } from "@/api/ContextProjects";
import { cn } from "@/lib/utils";
import { find, flow, identity } from "lodash/fp";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import PersonNoteAccount from "./PersonNoteAccount";

type PersonNoteProjectProps = {
  projectId: string;
  className?: string;
};

const PersonNoteProject: FC<PersonNoteProjectProps> = ({
  projectId,
  className,
}) => {
  const { projects } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    flow(
      identity<Project[] | undefined>,
      find((project: Project) => project.id === projectId),
      setProject
    )(projects);
  }, [projectId, projects]);

  return (
    <div className={cn(className)}>
      Project:{" "}
      <Link
        href={`/projects/${project?.id}`}
        className="hover:text-blue-600 font-semibold"
      >
        {project?.project}
      </Link>
      {project?.accountIds && project.accountIds.length > 0 && (
        <div className="flex flex-row gap-1">
          Accounts:
          {project.accountIds.map((aId) => (
            <PersonNoteAccount key={aId} accountId={aId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonNoteProject;
