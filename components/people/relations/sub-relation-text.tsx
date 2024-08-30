import { PersonRelationship } from "@/helpers/person/relationships";
import { getRelationValue, notSelf } from "@/helpers/person/sub-relationships";
import { differenceInYears, format } from "date-fns";
import { capitalize } from "lodash";
import { compact, filter, flatMap, flow, map, sortBy, uniqBy } from "lodash/fp";
import Link from "next/link";
import { FC } from "react";

type SubRelationshipsProps = {
  ownPersonId: string;
  relations: PersonRelationship[];
  updateRelationship: (
    relationship: Partial<PersonRelationship> & { id: string }
  ) => Promise<string | undefined>;
};

const SubRelationships: FC<SubRelationshipsProps> = ({
  ownPersonId,
  relations,
  updateRelationship,
}) => {
  return flow(
    (input: PersonRelationship[]) => input,
    flatMap("subRelations"),
    compact,
    uniqBy("personId"),
    filter(notSelf(ownPersonId)),
    sortBy(getRelationValue),
    map(({ label, personId, personName, birthday }) => (
      <div key={personId} className="space-x-1">
        <span className="font-semibold">{capitalize(label)}:</span>
        <Link
          className="text-blue-400 hover:text-blue-600 no-underline hover:underline hover:underline-offset-2"
          href={`/people/${personId}`}
        >
          {personName}
        </Link>
        {birthday && (
          <>
            <span>*{format(birthday, "PPP")}</span>
            <span className="font-semibold">
              {differenceInYears(new Date(), birthday)} years
            </span>
          </>
        )}
        {label === "spouse's child" && (
          <span
            className="text-xs text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2 hover:cursor-pointer"
            onClick={() =>
              updateRelationship({
                id: "NEW",
                relatedPerson: { id: personId, name: personName },
                nameOfRelationship: "child",
              })
            }
          >
            make own child
          </span>
        )}
        {label === "parent's spouse" && (
          <span
            className="text-xs text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2 hover:cursor-pointer"
            onClick={() =>
              updateRelationship({
                id: "NEW",
                relatedPerson: { id: personId, name: personName },
                nameOfRelationship: "parent",
              })
            }
          >
            make own parent
          </span>
        )}
      </div>
    ))
  )(relations);
};

export default SubRelationships;
