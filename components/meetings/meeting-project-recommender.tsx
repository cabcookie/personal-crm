import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import useMeetingProjectRecommendation from "@/api/useMeetingProjectRecommendation";
import { Meeting } from "@/api/useMeetings";
import { compact, filter, flatMap, flow, get, map } from "lodash/fp";
import { FC } from "react";

const filterOutProjectIds = (avoidIds: string[] | undefined) => (id: string) =>
  !avoidIds?.includes(id);

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

  return (
    <div className="px-1 md:px-2 text-sm text-muted-foreground">
      <span className="font-semibold">
        Add these projects where participants contributed:
      </span>
      {flow(
        filter(
          filterOutProjectIds(
            flow(get("activities"), flatMap(get("projectIds")))(meeting)
          )
        ),
        map(getProjectById),
        compact,
        filter((p) => !p.done),
        map(({ id, project, accountIds }) => (
          <span
            key={id}
            className="pl-1 md:pl-2 hover:text-primary hover:underline hover:underline-offset-2 hover:cursor-pointer"
            onClick={() => addProjectToMeeting(id)}
          >
            {project}
            {accountIds && ` (${getAccountNamesByIds(accountIds)})`}
          </span>
        ))
      )(projectIds)}
    </div>
  );
};

export default MeetingProjectRecommender;
