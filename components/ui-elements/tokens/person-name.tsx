import usePerson from "@/api/usePerson";
import { FC } from "react";

type PersonNameProps = {
  personId: string;
  noLinks?: boolean;
  className?: string;
};

const PersonName: FC<PersonNameProps> = ({ personId, noLinks, className }) => {
  const { person } = usePerson(personId);
  return !person ? (
    "…"
  ) : (
    <div className={className}>
      {noLinks ? (
        person.name
      ) : (
        <a
          href={`/people/${personId}`}
          className="hover:underline hover:underline-offset-2"
        >
          {person.name}
        </a>
      )}
    </div>
  );
};
export default PersonName;
