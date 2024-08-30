import { PersonData } from "@/api/usePerson";
import { getDate, getMonth, getYear } from "date-fns";
import { indexOf } from "lodash";
import { compact, filter, flow, get, map } from "lodash/fp";
import { getDateOrUndefined } from "../functional";
import {
  MAX_ORDER_RELATIONSHIP_TYPE,
  TRelationshipTypes,
} from "./relationships";

export type PersonSubRelationship = {
  label: TSubRelationshipTypes;
  personName: string;
  personId: string;
  birthday?: Date;
};

export type PersonRelationshipPersonData = {
  id: string;
  name: string;
  birthday?: string | null;
  dateOfDeath?: string | null;
};

export type PersonDataRelationRelatedPerson =
  PersonData["relationshipsFrom"][number]["relatedPerson"];
type PersonDataRelationPerson = PersonData["relationshipsTo"][number]["person"];

export const SUB_RELATIONSHIP_TYPES = [
  "spouse's child",
  "grand child",
  "spouse's friend",
  "friend's spouse",
  "friend's child",
  "sibling",
  "parent's spouse",
  "grand parent",
] as const;

export type TSubRelationshipTypes = (typeof SUB_RELATIONSHIP_TYPES)[number];

export const notSelf =
  (personId: string) => (relation: PersonSubRelationship) =>
    relation.personId !== personId;

const orderRelationShip = (relationType: TSubRelationshipTypes | undefined) =>
  !relationType
    ? MAX_ORDER_RELATIONSHIP_TYPE
    : indexOf(SUB_RELATIONSHIP_TYPES, relationType);

export const getRelationValue = ({ label, birthday }: PersonSubRelationship) =>
  !label
    ? MAX_ORDER_RELATIONSHIP_TYPE
    : [
        [orderRelationShip(label), 1],
        [!birthday ? 0 : getYear(birthday), 10000],
        [!birthday ? 0 : getMonth(birthday), 100],
        [!birthday ? 0 : getDate(birthday), 100],
      ].reduce((acc, cur) => acc * cur[1] + cur[0], 0);

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

const filterSpouse = <T extends { typeName: TRelationshipTypes | null }>(
  relation: T
) => relation.typeName === "spouse";

const filterFriend = <T extends { typeName: TRelationshipTypes | null }>(
  relation: T
) => relation.typeName === "friend";

const filterAlivePerson = <T extends { dateOfDeath?: Date }>({
  dateOfDeath,
}: T) => !dateOfDeath;

export const getGrandChilds = (
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

export const getFriendSpouse = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "friend"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterSpouse),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's spouse"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterSpouse),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's spouse"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "friend"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterSpouse),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's spouse"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterSpouse),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's spouse"))
        )(person) ?? []),
      ]
    : [];

export const getSpousesFriends = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "spouse"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterFriend),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("spouse's friend"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterFriend),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("spouse's friend"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "spouse"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterFriend),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("spouse's friend"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterFriend),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("spouse's friend"))
        )(person) ?? []),
      ]
    : [];

export const getFriendsChilds = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "friend"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's child"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's child"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "friend"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterChild),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's child"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("friend's child"))
        )(person) ?? []),
      ]
    : [];

export const getParentsSpouse = (
  person: PersonDataRelationPerson | undefined,
  relatedPerson: PersonDataRelationRelatedPerson | undefined,
  typeName: TRelationshipTypes | null
): PersonSubRelationship[] =>
  relatedPerson && typeName === "parent"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterSpouse),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("parent's spouse"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterSpouse),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("parent's spouse"))
        )(relatedPerson) ?? []),
      ]
    : person && typeName === "child"
    ? [
        ...(flow(
          get("relationshipsFrom"),
          filter(filterSpouse),
          map(get("relatedPerson")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("parent's spouse"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterSpouse),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("parent's spouse"))
        )(person) ?? []),
      ]
    : [];

export const getSpousesChilds = (
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
          map(mapRelatedPersonData("spouse's child"))
        )(relatedPerson) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("spouse's child"))
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
          map(mapRelatedPersonData("spouse's child"))
        )(person) ?? []),
        ...(flow(
          get("relationshipsTo"),
          filter(filterParent),
          map(get("person")),
          compact,
          filter(filterAlivePerson),
          map(mapRelatedPersonData("spouse's child"))
        )(person) ?? []),
      ]
    : [];

export const getGrandParents = (
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

export const getSiblings = (
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
