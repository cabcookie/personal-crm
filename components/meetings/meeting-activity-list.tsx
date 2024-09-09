import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { Meeting } from "@/api/useMeetings";
import useMeetingTodos, { MeetingTodo } from "@/api/useMeetingTodos";
import { filter, flow, identity, map } from "lodash/fp";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
import ActivityFormatBadge from "../activities/activity-format-badge";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTodoText } from "../ui-elements/editors/helpers/text-generation";

type MeetingActivityListProps = {
  meeting: Meeting;
};

const MeetingActivityList: FC<MeetingActivityListProps> = ({ meeting }) => {
  const { projects } = useProjectsContext();
  const { getAccountNamesByIds } = useAccountsContext();
  const { meetingTodos } = useMeetingTodos(meeting.id);

  return meeting.activities.length === 0 ? (
    <div className="mx-2 md:mx-4 mt-8 font-semibold text-sm text-muted-foreground md:text-center">
      Select a project to start taking notes!
    </div>
  ) : (
    meeting.activities.map((a, idx) => (
      <DefaultAccordionItem
        value={a.id}
        key={a.id}
        badge={
          <>
            <TaskBadge
              hasOpenTasks={a.hasOpenTodos}
              hasClosedTasks={a.hasClosedTodos}
            />
            {a.oldFormatVersion && <ActivityFormatBadge />}
          </>
        }
        triggerTitle={`Topic ${idx + 1}`}
        triggerSubTitle={[
          ...flow(
            identity<Project[] | undefined>,
            filter((p) => a.projectIds.includes(p.id)),
            map(
              (p) =>
                `${p.project}${
                  !p.accountIds || p.accountIds.length === 0
                    ? ""
                    : ` (${getAccountNamesByIds(p.accountIds)})`
                }`
            )
          )(projects),
          `Next actions: ${
            flow(
              identity<MeetingTodo[] | undefined>,
              filter((t) =>
                t.projectIds.some((id) => a.projectIds.includes(id))
              ),
              getTodoText
            )(meetingTodos) || "none"
          }`,
        ]}
      >
        <ActivityComponent
          activityId={a.id}
          showMeeting={false}
          notesNotInAccordion
        />
      </DefaultAccordionItem>
    ))
  );
};

export default MeetingActivityList;
