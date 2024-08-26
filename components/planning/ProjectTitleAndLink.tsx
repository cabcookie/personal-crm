import Link from "next/link";
import { FC } from "react";
import { BiLinkExternal } from "react-icons/bi";

type ProjectTitleAndLinkProps = {
  projectName: string;
  projectId: string;
  as?: "h3" | "div";
};

const ProjectTitleAndLink: FC<ProjectTitleAndLinkProps> = ({
  projectId,
  projectName,
  as = "h3",
}) => {
  return as === "h3" ? (
    <h3 className="block text-lg md:text-xl font-bold leading-6 tracking-tight">
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
      <div className="block tracking-tight">
        {projectName}
        <Link
          href={`/projects/${projectId}`}
          className="ml-2 text-muted-foreground hover:text-primary"
        >
          <BiLinkExternal className="inline-block" />
        </Link>
      </div>
    )
  );
};

export default ProjectTitleAndLink;
