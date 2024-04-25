import { FC, ReactNode, useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ProjectName from "./tokens/project-name";
import { useProjectsContext } from "@/api/ContextProjects";

type ProjectSelectorProps = {
  allowCreateProjects?: boolean;
  clearAfterSelection?: boolean;
  onChange: (projectId: string | null) => void;
};

type ProjectListOption = {
  value: string;
  label: ReactNode;
};

const ProjectSelector: FC<ProjectSelectorProps> = ({
  allowCreateProjects,
  onChange,
  clearAfterSelection,
}) => {
  const { projects, createProject, loadingProjects } = useProjectsContext();
  const [mappedOptions, setMappedOptions] = useState<
    ProjectListOption[] | undefined
  >();
  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    setMappedOptions(
      projects?.map((project) => ({
        value: project.id,
        label: <ProjectName noLinks projectId={project.id} />,
      }))
    );
  }, [projects]);

  const selectProject = async (selectedOption: any) => {
    if (!(allowCreateProjects && selectedOption.__isNew__)) {
      onChange(selectedOption.value);
      if (clearAfterSelection) setSelectedOption(null);
      return;
    }
    const project = await createProject(selectedOption.label);
    if (project) onChange(project.id);
    if (clearAfterSelection) setSelectedOption(null);
  };

  const filterProjects = (projectId: string, input: string) =>
    !!projects
      ?.find(({ id }) => id === projectId)
      ?.project.toLowerCase()
      .includes(input.toLowerCase());

  return (
    <div>
      {!allowCreateProjects ? (
        <Select
          options={mappedOptions}
          onChange={selectProject}
          value={selectedOption}
          isClearable
          isSearchable
          filterOption={(candidate, input) =>
            filterProjects(candidate.value, input)
          }
          placeholder={
            loadingProjects ? "Loading projects..." : "Add project..."
          }
        />
      ) : (
        <CreatableSelect
          options={mappedOptions}
          onChange={selectProject}
          value={selectedOption}
          isClearable
          isSearchable
          filterOption={(candidate, input) =>
            candidate.data.__isNew__ || filterProjects(candidate.value, input)
          }
          placeholder={
            loadingProjects ? "Loading projects..." : "Add project..."
          }
          formatCreateLabel={(input) => `Create "${input}"`}
        />
      )}
    </div>
  );
};

export default ProjectSelector;
