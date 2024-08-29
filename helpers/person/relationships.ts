import { PersonData } from "@/api/usePerson";
import { getDate, getMonth, getYear } from "date-fns";
import { indexOf } from "lodash";
import { compact, filter, flow, get, map, sortBy, union } from "lodash/fp";
import { getDateOrUndefined } from "../functional";

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
  direction: Directions;
  subRelations?: PersonSubRelationship[];
};

export type PersonSubRelationship = {
  label: TSubRelationshipTypes;
  personName: string;
  personId: string;
  birthday?: Date;
};

type Directions = "from" | "to";

export const RELATIONSHIP_TYPES = [
  "spouse",
  "fiance",
  "partner",
  "child",
  "parent",
  "smallgroup",
  "friend",
] as const;

export const SUB_RELATIONSHIP_TYPES = [
  "child of spouse",
  "grand child",
  "sibling",
  "grand parent",
] as const;

export type TRelationshipTypes = (typeof RELATIONSHIP_TYPES)[number];
export type TSubRelationshipTypes = (typeof SUB_RELATIONSHIP_TYPES)[number];

export const MAX_ORDER_RELATIONSHIP_TYPE = 2000000000 as const;

const orderRelationShip = (relationType: TRelationshipTypes | undefined) =>
  !relationType
    ? MAX_ORDER_RELATIONSHIP_TYPE
    : indexOf(RELATIONSHIP_TYPES, relationType);

type RelationshipType = {
  name: TRelationshipTypes;
  nameOfOtherDirection: TRelationshipTypes;
  hasAnniversary: boolean;
  nameOfAnniversary?: string;
  hasEndDate: boolean;
};

export const RELATIONSHIPS: RelationshipType[] = [
  {
    name: "parent",
    nameOfOtherDirection: "child",
    hasAnniversary: false,
    hasEndDate: false,
  },
  {
    name: "spouse",
    nameOfOtherDirection: "spouse",
    hasAnniversary: true,
    nameOfAnniversary: "Wedding",
    hasEndDate: true,
  },
  {
    name: "fiance",
    nameOfOtherDirection: "fiance",
    hasAnniversary: true,
    nameOfAnniversary: "Engagement",
    hasEndDate: true,
  },
  {
    name: "partner",
    nameOfOtherDirection: "partner",
    hasAnniversary: true,
    nameOfAnniversary: "Anniversary",
    hasEndDate: true,
  },
  {
    name: "friend",
    nameOfOtherDirection: "friend",
    hasAnniversary: true,
    nameOfAnniversary: "Friendship",
    hasEndDate: true,
  },
  {
    name: "smallgroup",
    nameOfOtherDirection: "smallgroup",
    hasAnniversary: true,
    nameOfAnniversary: "Membership",
    hasEndDate: true,
  },
] as const;

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
  direction: Directions,
  typeName: TRelationshipTypes | undefined | null
): RelationshipType | undefined => {
  if (!typeName) return;
  const relationType = findRelationType(typeName);
  if (!relationType) return;
  const { name, nameOfOtherDirection, ...rest } = relationType;
  return {
    name: getRelationTypeName(
      direction === "from",
      name,
      nameOfOtherDirection,
      typeName
    ),
    nameOfOtherDirection: getRelationTypeName(
      direction === "to",
      name,
      nameOfOtherDirection,
      typeName
    ),
    ...rest,
  } as RelationshipType;
};

const getRelationDate = (
  direction: Directions,
  dateName: "birthday" | "dateOfDeath",
  typeName: TRelationshipTypes | undefined | null,
  date: string | undefined | null,
  person: PersonRelationshipPersonData | undefined,
  relatedPerson: PersonRelationshipPersonData | undefined
) =>
  typeName === "child" || typeName === "parent"
    ? direction === "from"
      ? getDateOrUndefined(get(dateName)(relatedPerson))
      : getDateOrUndefined(get(dateName)(person))
    : getDateOrUndefined(date);

const mapRelation = (
  direction: Directions,
  id: string,
  typeName: TRelationshipTypes | null,
  relatedPerson: PersonRelationshipPersonData | undefined
): Pick<
  PersonRelationship,
  | "direction"
  | "id"
  | "nameOfAnniversary"
  | "nameOfRelationship"
  | "relatedPerson"
> => ({
  direction,
  id,
  nameOfAnniversary: findRelationType(typeName)?.nameOfAnniversary,
  nameOfRelationship: getRelationType(direction, typeName)?.name,
  relatedPerson,
});

type PersonRelationshipPersonData = {
  id: string;
  name: string;
  birthday?: string | null;
  dateOfDeath?: string | null;
};

const mapRelationDates = (
  direction: Directions,
  date: string | undefined | null,
  endDate: string | undefined | null,
  typeName: TRelationshipTypes | null,
  person: PersonData["relationshipsTo"][number]["person"] | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined
): Pick<PersonRelationship, "anniversary" | "endDate" | "subRelations"> => ({
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
});

type PersonDataRelationRelatedPerson =
  PersonData["relationshipsFrom"][number]["relatedPerson"];
type PersonDataRelationPerson = PersonData["relationshipsTo"][number]["person"];

const mapRelatedPersonData =
  (label: TSubRelationshipTypes) =>
  ({
    id,
    name,
    birthday,
  }: PersonRelationshipPersonData): PersonSubRelationship => ({
    label,
    personId: id,
    personName: name,
    birthday: getDateOrUndefined(birthday),
  });

const filterChild = <T extends { typeName: TRelationshipTypes | null }>(
  relation: T
) => relation.typeName === "child";

const filterParent = <T extends { typeName: TRelationshipTypes | null }>(
  relation: T
) => relation.typeName === "parent";

const filterAlivePerson = <T extends { dateOfDeath?: Date }>({
  dateOfDeath,
}: T) => !dateOfDeath;

const getGrandChilds = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "child"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand child"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand child"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "parent"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand child"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand child"))
        )(person) ?? []),
      ]
    : [];

const getSpousesChilds = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "spouse"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("child of spouse"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("child of spouse"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "spouse"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("child of spouse"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("child of spouse"))
        )(person) ?? []),
      ]
    : [];

const getGrandParents = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "parent"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterParent),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand parent"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterChild),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand parent"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "child"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterParent),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand parent"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterChild),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("grand parent"))
        )(person) ?? []),
      ]
    : [];

const getSiblings = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "parent"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("sibling"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("sibling"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "child"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("sibling"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("sibling"))
        )(person) ?? []),
      ]
    : [];

const mapRelationshipFrom = ({
  date,
  endDate,
  id,
  relatedPerson,
  typeName,
}: PersonData["relationshipsFrom"][number]): PersonRelationship => ({
  ...mapRelation("from", id, typeName, relatedPerson),
  ...mapRelationDates(
    "from",
    date,
    endDate,
    typeName,
    undefined,
    relatedPerson
  ),
  subRelations: [
    ...getSpousesChilds(undefined, relatedPerson, typeName),
    ...getGrandChilds(undefined, relatedPerson, typeName),
    ...getGrandParents(undefined, relatedPerson, typeName),
    ...getSiblings(undefined, relatedPerson, typeName),
  ],
});

const mapRelationshipTo = ({
  date,
  endDate,
  id,
  person,
  typeName,
}: PersonData["relationshipsTo"][number]): PersonRelationship => ({
  ...mapRelation("to", id, typeName, person),
  ...mapRelationDates("to", date, endDate, typeName, person, undefined),
  subRelations: [
    ...getSpousesChilds(person, undefined, typeName),
    ...getGrandChilds(person, undefined, typeName),
    ...getGrandParents(person, undefined, typeName),
    ...getSiblings(person, undefined, typeName),
  ],
});

const filterDuplicateSubRelations = (relations: PersonRelationship[]) =>
  relations.map((relation) => ({
    ...relation,
    subRelations: relation.subRelations?.filter((sub) =>
      relations.every((rel) => rel.relatedPerson?.id !== sub.personId)
    ),
  }));

const getRelationValue = ({
  nameOfRelationship,
  anniversary,
}: PersonRelationship) =>
  !nameOfRelationship
    ? MAX_ORDER_RELATIONSHIP_TYPE
    : [
        [orderRelationShip(nameOfRelationship), 1],
        [!anniversary ? 0 : getYear(anniversary), 10000],
        [!anniversary ? 0 : getMonth(anniversary), 100],
        [!anniversary ? 0 : getDate(anniversary), 100],
      ].reduce((acc, cur) => acc * cur[1] + cur[0], 0);

export const getRelationships = (
  relationshipsFrom: PersonData["relationshipsFrom"],
  relationshipsTo: PersonData["relationshipsTo"]
) =>
  flow(
    union(relationshipsFrom.map(mapRelationshipFrom)),
    union(relationshipsTo.map(mapRelationshipTo)),
    filterDuplicateSubRelations,
    sortBy(getRelationValue)
  )([]);
