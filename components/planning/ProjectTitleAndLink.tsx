import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { BiLinkExternal } from "react-icons/bi";

type ProjectTitleAndLinkProps = {
  projectName: string;
  projectId: string;
  as?: "h3" | "div";
  className?: string;
};

const ProjectTitleAndLink: FC<ProjectTitleAndLinkProps> = ({
  projectId,
  projectName,
  className,
  as = "h3",
}) => {
  return as === "h3" ? (
    <h3
      className={cn(
        "block text-lg md:text-xl font-bold leading-6 tracking-tight",
        className
      )}
    >
      {projectName}
      <Link
        href={`/projects/${projectId}`}
        className="ml-2 text-muted-foreground hover:text-primary"
      >
        <BiLinkExternal className="inline-block" />
      </Link>
    </h3>
  ) : (
    as === "div" && (
      <Link
        className={cn(
          "block tracking-tight text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2",
          className
        )}
        href={`/projects/${projectId}`}
      >
        {projectName}
      </Link>
    )
  );
};

export default ProjectTitleAndLink;
