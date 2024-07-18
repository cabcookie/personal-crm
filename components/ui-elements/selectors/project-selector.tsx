import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import ComboBox from "@/components/combo-box/combo-box";
import { FC } from "react";

type ProjectSelectorProps = {
  value: string;
  allowCreateProjects?: boolean;
  onChange: (projectId: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

const ProjectSelector: FC<ProjectSelectorProps> = ({
  allowCreateProjects,
  value,
  onChange,
  disabled,
  placeholder = "Search project…",
}) => {
  const { projects, createProject } = useProjectsContext();
  const { accounts } = useAccountsContext();

  const onCreate = async (newProjectName: string) => {
    const project = await createProject(newProjectName);
    if (project) onChange(project.id);
  };

  return (
    <ComboBox
      options={projects
        ?.filter((p) => !p.done)
        .map((project) => ({
          value: project.id,
          label: `${project.project}${
            project.accountIds && project.accountIds.length > 0
              ? ` (${project.accountIds
                  .map(
                    (accountId) =>
                      accounts?.find((a) => a.id === accountId)?.name
                  )
                  .join(", ")})`
              : ""
          }`,
        }))}
      currentValue={value}
      placeholder={placeholder}
      noSearchResultMsg="No project found."
      onChange={onChange}
      onCreate={allowCreateProjects ? onCreate : undefined}
      disabled={disabled}
    />
  );
};

export default ProjectSelector;
