import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import useMeetingProjectRecommendation from "@/api/useMeetingProjectRecommendation";
import { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { Person } from "@/api/usePerson";
import useCurrentUser, { User } from "@/api/useUser";
import { compact, filter, flatMap, flow, get, map, uniq } from "lodash/fp";
import { FC, useEffect, useState } from "react";

const filterOutProjectIds = (avoidIds: string[] | undefined) => (id: string) =>
  !avoidIds?.includes(id);

const getPersonById = (people: Person[] | undefined) => (personId: string) =>
  people?.find((p) => p.id === personId);

const getUniqAccountIds =
  (people: Person[] | undefined) =>
  (meeting: Meeting | undefined): string[] | undefined =>
    flow(
      get("participantIds"),
      map(getPersonById(people)),
      flatMap(get("accounts")),
      map(get("accountId")),
      uniq
    )(meeting);

const getNonInternalAccountIds =
  (user: User | undefined, people: Person[] | undefined) =>
  (meeting: Meeting | undefined): string[] | undefined =>
    flow(
      getUniqAccountIds(people),
      filter((id) => !!id && id !== user?.currentAccountId)
    )(meeting);

const filterProjecsByAccountIds =
  (projects: Project[] | undefined) =>
  (accountIds: string[] | undefined): Project[] | undefined =>
    flow(
      filter(
        (p: Project) =>
          !accountIds ||
          accountIds.length === 0 ||
          p.accountIds.some((accountId) => accountIds.includes(accountId))
      )
    )(projects);

const filterInternalProjects =
  (
    meeting: Meeting | undefined,
    user: User | undefined,
    people: Person[] | undefined
  ) =>
  (projects: Project[]): Project[] | undefined =>
    flow(
      getNonInternalAccountIds(user, people),
      filterProjecsByAccountIds(projects)
    )(meeting);

type MeetingProjectRecommenderProps = {
  meeting?: Meeting | undefined;
  addProjectToMeeting: (projectId: string) => void;
};

const MeetingProjectRecommender: FC<MeetingProjectRecommenderProps> = ({
  meeting,
  addProjectToMeeting,
}) => {
  const { projectIds } = useMeetingProjectRecommendation(meeting);
  const { getProjectById } = useProjectsContext();
  const { getAccountNamesByIds } = useAccountsContext();
  const [projects, setProjects] = useState<Project[] | undefined>();
  const { people } = usePeople();
  const { user } = useCurrentUser();

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
      filterInternalProjects(meeting, user, people),
      setProjects
    )(projectIds);
  }, [meeting, projectIds, user, people, getProjectById]);

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
