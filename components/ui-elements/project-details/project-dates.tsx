import { Project } from "@/api/ContextProjects";
import DateSelector from "@/components/ui-elements/selectors/date-selector";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";

type ProjectDatesHelperProps = {
  date?: Date;
  title: string;
  updateDateFn: (date: Date) => Promise<string | undefined>;
};

const ProjectDatesHelper: FC<ProjectDatesHelperProps> = ({
  date,
  title,
  updateDateFn,
}) => {
  return (
    <div>
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <DateSelector date={date} setDate={updateDateFn} />
    </div>
  );
};

type ProjectDatesProps = {
  project: Project;
  updateDatesFn: (props: {
    dueOn?: Date;
    onHoldTill?: Date;
    doneOn?: Date;
  }) => Promise<string | undefined>;
  accordionSelectedValue?: string;
};

const ProjectDates: FC<ProjectDatesProps> = ({
  project: { dueOn, doneOn, onHoldTill },
  updateDatesFn,
  accordionSelectedValue,
}) => (
  <DefaultAccordionItem
    value="project-dates"
    title="Project Dates"
    accordionSelectedValue={accordionSelectedValue}
    isVisible
    subTitle={
      <>
        {doneOn ? (
          <small>Done on: {format(doneOn, "PPP")}</small>
        ) : (
          <>
            {dueOn && <small>Due: {format(dueOn, "PPP")}</small>}
            {onHoldTill && (
              <small>On hold till: {format(onHoldTill, "PPP")}</small>
            )}
          </>
        )}
      </>
    }
  >
    <div className="space-y-4">
      <ProjectDatesHelper
        title="Due on"
        date={dueOn}
        updateDateFn={(date: Date) => updateDatesFn({ dueOn: date })}
      />
      <ProjectDatesHelper
        title="On hold till"
        date={onHoldTill}
        updateDateFn={(date: Date) => updateDatesFn({ onHoldTill: date })}
      />
      {doneOn && (
        <ProjectDatesHelper
          title="Done on"
          date={doneOn}
          updateDateFn={(date: Date) => updateDatesFn({ doneOn: date })}
        />
      )}
    </div>
  </DefaultAccordionItem>
);

export default ProjectDates;
