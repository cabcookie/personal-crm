import useDayPlans from "@/api/useDayplans";
import DayPlanForm from "@/components/dayplan/dayplan-form";
import Task from "@/components/dayplan/task";
import MainLayout from "@/components/layouts/MainLayout";
import SubmitButton from "@/components/ui-elements/buttons/submit-button";
import { useContextContext } from "@/contexts/ContextContext";
import { isTodayOrFuture } from "@/helpers/functional";
import { useState } from "react";
import styles from "./Today.module.css";

const TodayPage = () => {
  const { context } = useContextContext();
  const {
    dayPlans,
    errorDayPlans,
    loadingDayPlans,
    createDayPlan,
    completeDayPlan,
    createTodo,
    switchTodoDone,
    migrateLegacyTasks,
    countLegacyTasks,
  } = useDayPlans(context);
  const [showCreateDayPlan, setShowCreateDayPlan] = useState(false);

  return (
    <MainLayout
      title="Today's Tasks"
      sectionName="Today's Tasks"
      addButton={
        showCreateDayPlan
          ? undefined
          : {
              label: "New",
              onClick: () => setShowCreateDayPlan(true),
            }
      }
    >
      {countLegacyTasks > 0 && (
        <div className={styles.migrationWarning}>
          You have {countLegacyTasks} legacy data records. Do you want to
          migrate them to the new format?{" "}
          <SubmitButton
            wrapperClassName={styles.warningBtn}
            onClick={migrateLegacyTasks}
          >
            Yes
          </SubmitButton>
        </div>
      )}

      {showCreateDayPlan && (
        <DayPlanForm
          onSubmit={(goal, date) => {
            createDayPlan(date, goal, context);
            setShowCreateDayPlan(false);
          }}
        />
      )}

      {(!context || loadingDayPlans) && "Loading..."}
      {errorDayPlans && <div>Error: {JSON.stringify(errorDayPlans)}</div>}

      {dayPlans?.map(
        ({
          id: dayplanId,
          day,
          dayGoal,
          todos,
          projectTasks,
          nonprojectTasks,
        }) => (
          <div key={dayplanId}>
            <h2 className={styles.dayGoal}>
              {dayGoal} – {new Date(day).toLocaleDateString()}
              <SubmitButton
                onClick={() => completeDayPlan(dayplanId)}
                wrapperClassName={styles.doneBtn}
              >
                Done
              </SubmitButton>
            </h2>

            <section>
              {[
                ...todos,
                ...(isTodayOrFuture(day)
                  ? [
                      {
                        id: "new",
                        todo: "",
                        done: false,
                        project: undefined,
                        createdAt: new Date(),
                      },
                    ]
                  : []),
              ].map((todo) => (
                <Task
                  key={todo.id}
                  todo={todo}
                  switchTodoDone={switchTodoDone}
                  isNew={todo.id === "new"}
                  createTodo={
                    todo.id === "new"
                      ? (todo, projectId?: string) =>
                          createTodo({ todo, projectId, dayplanId })
                      : undefined
                  }
                />
              ))}
            </section>

            {projectTasks.length > 0 && (
              <div>
                <b>Project Tasks:</b>{" "}
                {projectTasks.map(({ id, todo }) => (
                  <div key={id}>{todo}</div>
                ))}
              </div>
            )}
            {nonprojectTasks.length > 0 && (
              <div>
                <b>Non Project Tasks:</b>{" "}
                {nonprojectTasks.map(({ id, task }) => (
                  <div key={id}>{task}</div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </MainLayout>
  );
};

export default TodayPage;
