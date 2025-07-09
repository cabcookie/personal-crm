import { WeeklyReviewEntry, useWeeklyReview } from "@/api/useWeeklyReview";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { getCategoryIcon } from "./ShowProjectNotes";
import { EntryEditor } from "../ui-elements/editors/weekly-review/EntryEditor";
import { Trash2, X } from "lucide-react";
import { ButtonInAccordion } from "./ButtonInAccordion";

interface AccordionWeeklyReviewEntryProps {
  weeklyReviewEntry: WeeklyReviewEntry;
}

export const AccordionWeeklyReviewEntry: FC<
  AccordionWeeklyReviewEntryProps
> = ({ weeklyReviewEntry }) => {
  const { projects } = useProjectsContext();
  const { updateWeeklyReviewEntryCategory, deleteWeeklyReviewEntry } =
    useWeeklyReview();
  const [project, setProject] = useState<Project>();
  const [content, setContent] = useState(weeklyReviewEntry.content || "");

  useEffect(() => {
    setProject(projects?.find((p) => p.id === weeklyReviewEntry.projectId));
  }, [projects, weeklyReviewEntry.projectId]);
  useEffect(() => {
    setContent(weeklyReviewEntry.content || "");
  }, [weeklyReviewEntry.content]);

  const handleIgnore = async () => {
    await updateWeeklyReviewEntryCategory(weeklyReviewEntry.id, "none");
  };

  const handleDelete = async () => {
    await deleteWeeklyReviewEntry(weeklyReviewEntry.id);
  };

  if (!project)
    return (
      <LoadingAccordionItem
        value={`loading-${weeklyReviewEntry.id}`}
        sizeTitle="xl"
        sizeSubtitle="3xl"
      />
    );

  return (
    <DefaultAccordionItem
      value={weeklyReviewEntry.id}
      triggerTitle={
        <div className="flex items-center gap-2">
          <span>{project.project}</span>
          {weeklyReviewEntry.category &&
            getCategoryIcon(weeklyReviewEntry.category)}
          <div className="flex items-center gap-2">
            <ButtonInAccordion onClick={handleIgnore} label="Ignore" Icon={X} />
            <ButtonInAccordion
              onClick={handleDelete}
              label="Delete"
              Icon={Trash2}
            />
          </div>
        </div>
      }
      triggerSubTitle={weeklyReviewEntry.content}
    >
      <EntryEditor {...{ content, entryId: weeklyReviewEntry.id }} />
    </DefaultAccordionItem>
  );
};
