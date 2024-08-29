import {
  MAX_ORDER_RELATIONSHIP_TYPE,
  PersonRelationship,
  PersonSubRelationship,
  SUB_RELATIONSHIP_TYPES,
  TSubRelationshipTypes,
} from "@/helpers/person/relationships";
import {
  differenceInYears,
  format,
  getDate,
  getMonth,
  getYear,
} from "date-fns";
import { capitalize, indexOf } from "lodash";
import {
  compact,
  filter,
  flatMap,
  flow,
  get,
  map,
  sortBy,
  uniqBy,
} from "lodash/fp";
import Link from "next/link";
import { FC } from "react";

type SubRelationshipsProps = {
  ownPersonId: string;
  relations: PersonRelationship[];
  updateRelationship: (
    relationship: Partial<PersonRelationship> & { id: string }
  ) => Promise<string | undefined>;
};

const notSelf = (personId: string) => (relation: PersonSubRelationship) =>
  relation.personId !== personId;

const orderRelationShip = (relationType: TSubRelationshipTypes | undefined) =>
  !relationType
    ? MAX_ORDER_RELATIONSHIP_TYPE
    : indexOf(SUB_RELATIONSHIP_TYPES, relationType);

const getRelationValue = ({ label, birthday }: PersonSubRelationship) =>
  !label
    ? MAX_ORDER_RELATIONSHIP_TYPE
    : [
        [orderRelationShip(label), 1],
        [!birthday ? 0 : getYear(birthday), 10000],
        [!birthday ? 0 : getMonth(birthday), 100],
        [!birthday ? 0 : getDate(birthday), 100],
      ].reduce((acc, cur) => acc * cur[1] + cur[0], 0);

const SubRelationships: FC<SubRelationshipsProps> = ({
  ownPersonId,
  relations,
  updateRelationship,
}) => {
  return flow(
    (input: PersonRelationship[]) => input,
    flatMap(get("subRelations")),
    compact,
    uniqBy(get("personId")),
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
        {label === "child of spouse" && (
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
            make own
          </span>
        )}
      </div>
    ))
  )(relations);
};

export default SubRelationships;
