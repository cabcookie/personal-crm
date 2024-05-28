import { type Schema } from "@/amplify/data/resource";
import useDayPlans from "@/api/useDayplans";
import DayPlanForm from "@/components/dayplan/dayplan-form";
import Task from "@/components/dayplan/task";
import TaskForm from "@/components/dayplan/task-form";
import MainLayout from "@/components/layouts/MainLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useContextContext } from "@/contexts/ContextContext";
import { isTodayOrFuture } from "@/helpers/functional";
import { FileWarning } from "lucide-react";
import { useState } from "react";
import { IoSquareOutline } from "react-icons/io5";

const TodayPage = () => {
  const { context } = useContextContext();
  const {
    dayPlans,
    createDayPlan,
    completeDayPlan,
    undoDayplanCompletion,
    createTodo,
    switchTodoDone,
    migrateLegacyTasks,
    countLegacyTasks,
  } = useDayPlans(context);
  const [showCreateDayPlan, setShowCreateDayPlan] = useState(false);
  const { toast } = useToast();

  const handleUndoDayplanCompletion = async (
    dayplan: Schema["DayPlan"]["type"]
  ) => {
    const newDayplan = await undoDayplanCompletion(dayplan);
    if (!newDayplan) return;
    toast({
      title: "Undo dayplan completion succeeded!",
      description: `You have set the dayplan "${
        newDayplan.dayGoal
      }" for ${new Date(newDayplan.day).toLocaleDateString()} to not done.`,
      action: (
        <ToastAction
          altText="Undo re-opening dayplan"
          onClick={() => handleCompleteDayPlan(newDayplan.id)}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const handleCompleteDayPlan = async (dayplanId: string) => {
    const dayplan = await completeDayPlan(dayplanId);
    if (!dayplan) return;
    toast({
      title: "You have completed a dayplan",
      description: `You have completed the dayplan "${
        dayplan.dayGoal
      }" for ${new Date(dayplan.day).toLocaleDateString()}.`,
      action: (
        <ToastAction
          altText="Undo completing the day"
          onClick={() => handleUndoDayplanCompletion(dayplan)}
        >
          Undo
        </ToastAction>
      ),
    });
  };

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
      {!dayPlans ? (
        "Loading day plans…"
      ) : (
        <>
          {countLegacyTasks > 0 && (
            <Alert>
              <FileWarning className="h-4 w-4" />
              <AlertTitle>
                You have {countLegacyTasks} legacy data records. Do you want to
                migrate them to the new format?
              </AlertTitle>
              <AlertDescription>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={migrateLegacyTasks}
                >
                  Yes
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {showCreateDayPlan && (
            <DayPlanForm
              onSubmit={(goal, date) => {
                createDayPlan(date, goal, context);
                setShowCreateDayPlan(false);
              }}
              onCancel={() => setShowCreateDayPlan(false)}
              className="mt-4"
            />
          )}

          <div className="mt-4" />

          {dayPlans.map(({ id: dayplanId, day, dayGoal, todos }) => (
            <div key={dayplanId} className="mb-4">
              <div className="flex flex-row gap-2 items-center sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent text-lg md:text-xl tracking-tight">
                <IoSquareOutline
                  onClick={() => handleCompleteDayPlan(dayplanId)}
                />
                <h2 className="font-bold">
                  {dayGoal} – {day.toLocaleDateString()}
                </h2>
              </div>

              <section className="mt-1">
                {todos.length === 0 ? (
                  <div className="text-secondary-foreground ml-7">
                    No open todos
                  </div>
                ) : (
                  todos.map((todo) => (
                    <Task
                      key={todo.id}
                      todo={todo}
                      switchTodoDone={switchTodoDone}
                    />
                  ))
                )}
                {isTodayOrFuture(day) && (
                  <article className="flex flex-row mt-2 text-base md-text-lg ml-6 gap-2">
                    <IoSquareOutline className="mt-1" />
                    <TaskForm
                      createTodo={(todo, projectId?: string) =>
                        createTodo({ todo, projectId, dayplanId })
                      }
                    />
                  </article>
                )}
              </section>
            </div>
          ))}
        </>
      )}
    </MainLayout>
  );
};

export default TodayPage;
