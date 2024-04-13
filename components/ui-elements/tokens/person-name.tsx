import { FC } from "react";
import styles from "./Tokens.module.css";

type PersonNameProps = {
  person: { id: string; name: string };
  noLinks?: boolean;
};

const PersonName: FC<PersonNameProps> = ({ person, noLinks }) => {
  return noLinks ? (
    <span className={styles.personName}>{person.name}</span>
  ) : (
    <a href={`/people/${person.id}`} className={styles.personName}>
      {person.name}
    </a>
  );
};

export default PersonName;
