import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import useActivity from "@/api/useActivity";
import { getRevenue2Years } from "@/api/useCrmProjects";
import { Accordion } from "@/components/ui/accordion";
import Link from "next/link";
import { FC, useState } from "react";
import { debouncedUpdateNotes } from "../../activities/activity-helper";
import ActivityMetaData from "../../activities/activity-meta-data";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import NotesWriter, { SerializerOutput } from "../notes-writer/NotesWriter";
import ProjectDetails from "../project-details/project-details";
import RecordDetails from "../record-details/record-details";

type ProjectItemProps = {
  project?: Project;
  accordionSelectedValue?: string;
};

const ProjectItem: FC<ProjectItemProps> = ({
  project,
  accordionSelectedValue,
}) => {
  const { getAccountById } = useAccountsContext();

  return (
    project && (
      <DefaultAccordionItem
        value={project.id}
        triggerTitle={project.project}
        accordionSelectedValue={accordionSelectedValue}
        link={`/projects/${project.id}`}
        isVisible
        triggerSubTitle={
          <>
            {project.accountIds.map((id: string) => (
              <Link
                key={id}
                className="hover:underline"
                href={`/accounts/${id}`}
              >
                {getAccountById(id)?.name}
              </Link>
            ))}
            {project.crmProjects.length > 0 &&
              getRevenue2Years(project.crmProjects)}
          </>
        }
      >
        <ProjectDetails projectId={project.id} showCrmDetails includeAccounts />
      </DefaultAccordionItem>
    )
  );
};

type ProjectNotesFormProps = {
  className?: string;
  activityId: string;
};

const ProjectNotesForm: FC<ProjectNotesFormProps> = ({
  activityId,
  className,
}) => {
  const { getProjectById } = useProjectsContext();
  const { activity, updateNotes } = useActivity(activityId);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const handleNotesUpdate = (serializer: () => SerializerOutput) => {
    if (!updateNotes) return;
    debouncedUpdateNotes({
      serializer,
      updateNotes,
    });
  };

  return !activity ? (
    "Loading…"
  ) : (
    <div className={className}>
      <RecordDetails title="Notes for project:">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={(val) =>
            setAccordionValue(val === accordionValue ? undefined : val)
          }
        >
          {activity.projectIds.map((id) => (
            <ProjectItem
              key={id}
              project={getProjectById(id)}
              accordionSelectedValue={accordionValue}
            />
          ))}
        </Accordion>

        <div className="my-2">
          <NotesWriter
            notes={activity?.notes || {}}
            saveNotes={handleNotesUpdate}
          />
        </div>
      </RecordDetails>

      <div style={{ padding: "0.3rem 1rem" }}>
        <ActivityMetaData activity={activity} />
      </div>
    </div>
  );
};

export default ProjectNotesForm;
