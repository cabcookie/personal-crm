import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import useMeetingProjectRecommendation from "@/api/useMeetingProjectRecommendation";
import { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { Person } from "@/api/usePerson";
import useCurrentUser, { User } from "@/api/useUser";
import { compact, filter, flatMap, flow, get, map } from "lodash/fp";
import { FC, useEffect, useState } from "react";

const filterOutProjectIds = (avoidIds: string[] | undefined) => (id: string) =>
  !avoidIds?.includes(id);

const filterInternalParticipants =
  (user: User | undefined, people: Person[] | undefined) =>
  (participantIds: string[] | undefined): string[] | undefined => {
    if (!user?.currentAccountId) return participantIds;
    const externalIds = participantIds?.filter((id) =>
      people
        ?.find((p) => p.id === id)
        ?.accounts.some((a) => a.accountId !== user.currentAccountId)
    );
    if (!externalIds?.length) return participantIds;
    return externalIds;
  };

type MeetingProjectRecommenderProps = {
  meeting?: Meeting | undefined;
  addProjectToMeeting: (projectId: string) => void;
};

const MeetingProjectRecommender: FC<MeetingProjectRecommenderProps> = ({
  meeting,
  addProjectToMeeting,
}) => {
  const { user } = useCurrentUser();
  const [relevantParticipantIds, setRelevantParticipantIds] = useState<
    string[] | undefined
  >();
  const { projectIds } = useMeetingProjectRecommendation(
    relevantParticipantIds
  );
  const { getProjectById } = useProjectsContext();
  const { getAccountNamesByIds } = useAccountsContext();
  const [projects, setProjects] = useState<Project[] | undefined>();
  const { people } = usePeople();

  useEffect(() => {
    flow(
      filterInternalParticipants(user, people),
      setRelevantParticipantIds
    )(meeting?.participantIds);
  }, [meeting?.participantIds, people, user]);

  useEffect(() => {
    flow(
      filter(
        filterOutProjectIds(
          flow(get("activities"), flatMap(get("projectIds")))(meeting)
        )
      ),
      map(getProjectById),
      compact,
      filter((p: Project) => !p.done),
      setProjects
    )(projectIds);
  }, [getProjectById, meeting, projectIds]);

  return (
    <div className="px-1 md:px-2 text-sm text-muted-foreground">
      <div>
        <span className="font-semibold">
          Add these projects where participants contributed:
        </span>
        {projects?.map(({ id, project, accountIds }) => (
          <span
            key={id}
            className="pl-1 md:pl-2 hover:text-primary hover:underline hover:underline-offset-2 hover:cursor-pointer"
            onClick={() => addProjectToMeeting(id)}
          >
            {project}
            {accountIds && ` (${getAccountNamesByIds(accountIds)})`}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MeetingProjectRecommender;
