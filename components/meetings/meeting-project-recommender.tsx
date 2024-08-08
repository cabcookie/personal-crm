import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { Meeting } from "@/api/useMeetings";
import usePersonActivities from "@/api/usePersonActivities";
import { compact, filter, flatMap, flow, get, map, uniq } from "lodash/fp";
import { FC, useEffect, useState } from "react";

const filterOutProjectIds = (avoidIds: string[] | undefined) => (id: string) =>
  !avoidIds?.includes(id);

const MeetingPersonActivities = (personId: string) => {
  const { activities } = usePersonActivities(personId);
  return activities;
};

const useMeetingActivities = (participantIds: string[] | undefined) => {
  if (!participantIds) return undefined;
  return flow(
    flatMap(MeetingPersonActivities),
    compact,
    flatMap(get("projectIds")),
    uniq
  )(participantIds);
};

type MeetingProjectRecommenderProps = {
  meeting?: Meeting | undefined;
  addProjectToMeeting: (projectId: string) => void;
};

const MeetingProjectRecommender: FC<MeetingProjectRecommenderProps> = ({
  meeting,
  addProjectToMeeting,
}) => {
  const projectIds = useMeetingActivities(meeting?.participantIds);
  const { getProjectById } = useProjectsContext();
  const { getAccountNamesByIds } = useAccountsContext();
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);

  useEffect(() => {
    {
      flow(
        compact,
        filter(
          filterOutProjectIds(
            flow(get("activities"), flatMap(get("projectIds")))(meeting)
          )
        ),
        map(getProjectById),
        compact,
        filter((p) => !p.done),
        setProjects
      )(projectIds);
    }
  }, [getProjectById, meeting, projectIds]);

  return (
    <div className="px-1 md:px-2 text-sm text-muted-foreground">
      <span className="font-semibold">
        Add these projects where participants contributed:
      </span>
      {projects?.map((p) => (
        <span key={p.id}>
          <span
            className="pl-1 md:pl-2 hover:text-primary hover:underline hover:underline-offset-2 hover:cursor-pointer"
            onClick={() => addProjectToMeeting(p.id)}
          >
            {p.project}
            {p.accountIds && ` (${getAccountNamesByIds(p.accountIds)})`}
          </span>
        </span>
      ))}
    </div>
  );
};

export default MeetingProjectRecommender;
