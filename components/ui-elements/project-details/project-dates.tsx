import { FC } from "react";
import styles from "./ProjectDetails.module.css";
import { toLocaleDateString } from "@/helpers/functional";

type ProjectDatesProps = {
  dueOn?: Date;
  doneOn?: Date;
};

type ProjectDatesHelperProps = {
  date?: Date;
  title: string;
};

const ProjectDatesHelper: FC<ProjectDatesHelperProps> = ({ date, title }) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.text}>{toLocaleDateString(date)}</div>
    </div>
  );
};

const ProjectDates: FC<ProjectDatesProps> = ({ dueOn, doneOn }) => {
  return (
    <div className={styles.oneRow}>
      {dueOn && <ProjectDatesHelper title="Due on" date={dueOn} />}
      {doneOn && <ProjectDatesHelper title="Done on" date={doneOn} />}
    </div>
  );
};

export default ProjectDates;
