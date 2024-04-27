import { FC } from "react";
import styles from "./ProjectDetails.module.css";
import { Project } from "@/api/ContextProjects";
import DateSelector from "../date-selector";

type ProjectDatesProps = {
  project: Project;
  updateDatesFn: (props: {
    dueOn?: Date;
    onHoldTill?: Date;
    doneOn?: Date;
  }) => Promise<string | undefined>;
};

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
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.text}>
        <DateSelector date={date} setDate={updateDateFn} />
      </div>
    </div>
  );
};

const ProjectDates: FC<ProjectDatesProps> = ({
  project: { dueOn, doneOn, onHoldTill },
  updateDatesFn,
}) => {
  return (
    <div className={styles.oneRow}>
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
  );
};

export default ProjectDates;
