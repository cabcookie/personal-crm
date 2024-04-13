import useProjects from "@/api/useProjects";
import { useContextContext } from "@/contexts/ContextContext";
import { FC, ReactNode, useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ProjectName from "./tokens/project-name";
import { Project } from "@/api/useProject";

type ProjectSelectorProps = {
  allowCreateProjects?: boolean;
  clearAfterSelection?: boolean;
  onChange: (project: Project) => void;
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
  const { context } = useContextContext();
  const { projects, loadingProjects, createProject } = useProjects(context);
  const [mappedOptions, setMappedOptions] = useState<
    ProjectListOption[] | undefined
  >();
  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    setMappedOptions(
      projects?.map((project) => ({
        value: project.id,
        label: <ProjectName noLinks project={project} />,
      }))
    );
  }, [projects]);

  const selectProject = async (selectedOption: any) => {
    if (!(allowCreateProjects && selectedOption.__isNew__)) {
      const selectedProject = projects?.find(
        ({ id }) => id === selectedOption.value
      );
      if (!selectedProject) return;
      onChange(selectedProject);
      if (clearAfterSelection) setSelectedOption(null);
      return;
    }
    const project = await createProject(selectedOption.label);
    if (project) onChange(project);
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
