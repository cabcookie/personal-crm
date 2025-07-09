import { ProjectForReview } from "@/helpers/weeklyReviewHelpers";
import { Dispatch, FC, SetStateAction } from "react";
import { PasteResultBase } from "./PasteResultBase";
import { compact, flow, identity, map } from "lodash/fp";
import { uniqueId } from "lodash";

interface PasteCategorizationResultProps {
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  createWeeklyReview: (projects: ProjectForReview[]) => Promise<void>;
}

export const PasteCategorizationResult: FC<PasteCategorizationResultProps> = ({
  setProjectNotes,
  createWeeklyReview,
}) => {
  const processCategorizationJson = async (
    jsonData: any[],
    setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>
  ) => {
    let updatedProjects: ProjectForReview[] = [];

    setProjectNotes((current) => {
      updatedProjects = [
        ...current.filter(projectIsNotInJsonData(jsonData)),
        ...flow(
          identity<typeof jsonData>,
          map(updateProjectCategory(current)),
          compact
        )(jsonData),
      ];
      return updatedProjects;
    });

    // Check if all projects now have category "none"
    const allProjectsNone = updatedProjects.every((p) => p.category === "none");
    if (allProjectsNone && updatedProjects.length > 0) {
      await createWeeklyReview(updatedProjects);
      setProjectNotes([]);
    }
  };

  return (
    <PasteResultBase
      setProjectNotes={setProjectNotes}
      label="Paste categorization result:"
      placeholder="Paste the Amazon Q categorization result here..."
      inputId="categorization-input"
      onProcessJson={processCategorizationJson}
    />
  );
};

const projectIsNotInJsonData =
  (jsonData: any[]) => (project: ProjectForReview) =>
    !jsonData.some((item) => item.projectId === project.projectId);

const updateProjectCategory =
  (projects: ProjectForReview[]) =>
  (jsonItem: any): ProjectForReview | undefined => {
    const project = projects.find((c) => c.projectId === jsonItem.projectId);
    if (!project) return;
    return {
      ...project,
      id: uniqueId(),
      category: jsonItem.category,
    };
  };
