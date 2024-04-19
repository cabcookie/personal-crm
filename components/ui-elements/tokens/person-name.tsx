import { FC, useState } from "react";
import styles from "./Tokens.module.css";
import { usePeopleContext } from "@/api/ContextPeople";

type PersonNameProps = {
  personId: string;
  noLinks?: boolean;
};

const PersonName: FC<PersonNameProps> = ({ personId, noLinks }) => {
  const { getPersonById } = usePeopleContext();
  const [person] = useState(getPersonById(personId));

  return noLinks ? (
    <span className={styles.personName}>{person?.name}</span>
  ) : (
    <a href={`/people/${personId}`} className={styles.personName}>
      {person?.name}
    </a>
  );
};

export default PersonName;
