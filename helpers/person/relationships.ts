import { PersonData } from "@/api/usePerson";
import { getDate, getMonth, getYear } from "date-fns";
import { get, indexOf } from "lodash";
import { flow, sortBy, union } from "lodash/fp";
import { getDateOrUndefined } from "../functional";

type MinimalPersonData = {
  id: string;
  name: string;
  birthday?: string | null;
  dateOfDeath?: string | null;
};

export const RELATIONSHIP_TYPES = [
  "spouse",
  "fiance",
  "partner",
  "child",
  "parent",
  "smallgroup",
  "friend",
] as const;
export type TRelationshipTypes = (typeof RELATIONSHIP_TYPES)[number];

const MAX_ORDER_RELATIONSHIP_TYPE = 20 as const;

const orderRelationShip = (relationType: TRelationshipTypes | undefined) =>
  !relationType
    ? MAX_ORDER_RELATIONSHIP_TYPE
    : indexOf(RELATIONSHIP_TYPES, relationType);

type OtherInterestingRelation = {
  relationName: TRelationshipTypes;
  label?: string;
  labelOfOtherDirection?: string;
};

type RelationshipType = {
  name: TRelationshipTypes;
  nameOfOtherDirection: TRelationshipTypes;
  hasAnniversary: boolean;
  nameOfAnniversary?: string;
  hasEndDate: boolean;
  otherInterestingRelation: OtherInterestingRelation[];
};

const makeOtherInterestingRelation = (
  relationName: TRelationshipTypes,
  label: string | undefined,
  labelOfOtherDirection: string | undefined
): OtherInterestingRelation => ({
  relationName,
  label,
  labelOfOtherDirection,
});

export const RELATIONSHIPS: RelationshipType[] = [
  {
    name: "parent",
    nameOfOtherDirection: "child",
    hasAnniversary: false,
    hasEndDate: false,
    otherInterestingRelation: [
      makeOtherInterestingRelation("parent", undefined, "Grand-parent"),
      makeOtherInterestingRelation("child", "Grand-child", "Sibling"),
    ],
  },
  {
    name: "spouse",
    nameOfOtherDirection: "spouse",
    hasAnniversary: true,
    nameOfAnniversary: "Wedding",
    hasEndDate: true,
    otherInterestingRelation: [],
  },
  {
    name: "fiance",
    nameOfOtherDirection: "fiance",
    hasAnniversary: true,
    nameOfAnniversary: "Engagement",
    hasEndDate: true,
    otherInterestingRelation: [],
  },
  {
    name: "partner",
    nameOfOtherDirection: "partner",
    hasAnniversary: true,
    nameOfAnniversary: "Anniversary",
    hasEndDate: true,
    otherInterestingRelation: [],
  },
  {
    name: "friend",
    nameOfOtherDirection: "friend",
    hasAnniversary: true,
    nameOfAnniversary: "Friendship",
    hasEndDate: true,
    otherInterestingRelation: [],
  },
  {
    name: "smallgroup",
    nameOfOtherDirection: "smallgroup",
    hasAnniversary: true,
    nameOfAnniversary: "Membership",
    hasEndDate: true,
    otherInterestingRelation: [],
  },
] as const;

export type PersonRelationship = {
  id: string;
  relatedPerson?: {
    id: string;
    name: string;
  };
  nameOfRelationship?: TRelationshipTypes;
  nameOfAnniversary?: string;
  anniversary?: Date;
  endDate?: Date;
  direction: "from" | "to";
};

const getRelationTypeName = (
  fromDirection: boolean,
  name: TRelationshipTypes,
  nameOfOtherDirection: TRelationshipTypes,
  relationTypeName: TRelationshipTypes
): TRelationshipTypes =>
  (fromDirection && relationTypeName === name) ||
  (!fromDirection && relationTypeName === nameOfOtherDirection)
    ? name
    : nameOfOtherDirection;

const findRelationType = (name: TRelationshipTypes | undefined | null) =>
  RELATIONSHIPS.find((r) => r.name === name || r.nameOfOtherDirection === name);

export const getRelationType = (
  direction: "from" | "to",
  name: TRelationshipTypes | undefined | null
): RelationshipType | undefined => {
  if (!name) return;
  const relationType = findRelationType(name);
  if (!relationType) return;
  return {
    name: getRelationTypeName(
      direction === "from",
      relationType.name,
      relationType.nameOfOtherDirection,
      name
    ),
    nameOfOtherDirection: getRelationTypeName(
      direction === "from",
      relationType.nameOfOtherDirection,
      relationType.name,
      name
    ),
    nameOfAnniversary: relationType.nameOfAnniversary,
    hasAnniversary: relationType.hasAnniversary,
    hasEndDate: relationType.hasEndDate,
  } as RelationshipType;
};

type MinimalRelationData = {
  id: string;
  typeName?: TRelationshipTypes | null;
  date?: string | null;
  endDate?: string | null;
};

type MapRelationship =
  | {
      direction: "from";
      relationship: MinimalRelationData & {
        relatedPerson?: MinimalPersonData;
        person?: never;
      };
    }
  | {
      direction: "to";
      relationship: MinimalRelationData & {
        person?: MinimalPersonData;
        relatedPerson?: never;
      };
    };

const getRelationDate = (
  direction: "from" | "to",
  dateName: "birthday" | "dateOfDeath",
  typeName: TRelationshipTypes | undefined | null,
  date: string | undefined | null,
  person: MinimalPersonData | undefined,
  relatedPerson: MinimalPersonData | undefined
) =>
  typeName === "child" || typeName === "parent"
    ? direction === "from"
      ? getDateOrUndefined(get(relatedPerson, dateName))
      : getDateOrUndefined(get(person, dateName))
    : getDateOrUndefined(date);

const mapRelationship = ({
  direction,
  relationship: { id, typeName, date, endDate, person, relatedPerson },
}: MapRelationship): PersonRelationship => ({
  direction,
  id,
  anniversary: getRelationDate(
    direction,
    "birthday",
    typeName,
    date,
    person,
    relatedPerson
  ),
  endDate: getRelationDate(
    direction,
    "dateOfDeath",
    typeName,
    endDate,
    person,
    relatedPerson
  ),
  nameOfAnniversary: findRelationType(typeName)?.nameOfAnniversary,
  nameOfRelationship: getRelationType(direction, typeName)?.name,
  relatedPerson: person ?? relatedPerson,
});

export const getRelationships = (
  relationshipsFrom: PersonData["relationshipsFrom"],
  relationshipsTo: PersonData["relationshipsTo"]
) =>
  flow(
    union(
      relationshipsFrom.map((relationship) =>
        mapRelationship({ direction: "from", relationship })
      )
    ),
    union(
      relationshipsTo.map((relationship) =>
        mapRelationship({ direction: "to", relationship })
      )
    ),
    sortBy(({ nameOfRelationship, anniversary }) =>
      !nameOfRelationship
        ? MAX_ORDER_RELATIONSHIP_TYPE
        : [
            [orderRelationShip(nameOfRelationship), 1],
            [!anniversary ? 0 : getYear(anniversary), 10000],
            [!anniversary ? 0 : getMonth(anniversary), 100],
            [!anniversary ? 0 : getDate(anniversary), 100],
          ].reduce((acc, cur) => acc * cur[1] + cur[0], 0)
    )
  )([]);
