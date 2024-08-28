import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { getDateOrUndefined, toISODateString } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { getDate, getMonth, getYear, isFuture } from "date-fns";
import { get, indexOf } from "lodash";
import { flow, map, replace, sortBy, union } from "lodash/fp";
import {
  AtSign,
  Building,
  ExternalLink,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export const selectionSet = [
  "id",
  "name",
  "howToSay",
  "birthday",
  "dateOfDeath",
  "updatedAt",
  "accounts.id",
  "accounts.startDate",
  "accounts.endDate",
  "accounts.position",
  "accounts.account.id",
  "accounts.account.name",
  "details.id",
  "details.label",
  "details.detail",
  "relationshipsFrom.id",
  "relationshipsFrom.date",
  "relationshipsFrom.endDate",
  "relationshipsFrom.typeName",
  "relationshipsFrom.relatedPerson.id",
  "relationshipsFrom.relatedPerson.name",
  "relationshipsFrom.relatedPerson.birthday",
  "relationshipsFrom.relatedPerson.dateOfDeath",
  "relationshipsFrom.relatedPerson.relationshipsFrom.date",
  "relationshipsFrom.relatedPerson.relationshipsFrom.endDate",
  "relationshipsFrom.relatedPerson.relationshipsFrom.typeName",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.id",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.name",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.birthday",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.dateOfDeath",
  "relationshipsFrom.relatedPerson.relationshipsTo.date",
  "relationshipsFrom.relatedPerson.relationshipsTo.endDate",
  "relationshipsFrom.relatedPerson.relationshipsTo.typeName",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.id",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.name",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.birthday",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.dateOfDeath",
  "relationshipsTo.id",
  "relationshipsTo.date",
  "relationshipsTo.endDate",
  "relationshipsTo.typeName",
  "relationshipsTo.person.id",
  "relationshipsTo.person.name",
  "relationshipsTo.person.birthday",
  "relationshipsTo.person.dateOfDeath",
  "relationshipsTo.person.relationshipsFrom.date",
  "relationshipsTo.person.relationshipsFrom.endDate",
  "relationshipsTo.person.relationshipsFrom.typeName",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.id",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.name",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.birthday",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.dateOfDeath",
  "relationshipsTo.person.relationshipsTo.date",
  "relationshipsTo.person.relationshipsTo.endDate",
  "relationshipsTo.person.relationshipsTo.typeName",
  "relationshipsTo.person.relationshipsTo.person.id",
  "relationshipsTo.person.relationshipsTo.person.name",
  "relationshipsTo.person.relationshipsTo.person.birthday",
  "relationshipsTo.person.relationshipsTo.person.dateOfDeath",
] as const;

export type TDetailLabel =
  | "linkedIn"
  | "phonePrivate"
  | "phoneWork"
  | "emailPrivate"
  | "emailWork"
  | "salesforce"
  | "instagram"
  | "amazonalias";

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

const orderRelationShip = (relationType: TRelationshipTypes) =>
  indexOf(RELATIONSHIP_TYPES, relationType);

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

export type TPersonDetailTypes = {
  fieldLabel: TDetailLabel;
  formLabel: string;
  type: "url" | "phone" | "email" | "string";
  buildLabel?: (label: string) => string;
  buildLink?: (label: string) => string;
  Icon: typeof Phone;
};

export const personDetailsLabels: TPersonDetailTypes[] = [
  {
    fieldLabel: "linkedIn",
    formLabel: "LinkedIn profile",
    type: "url",
    buildLabel: flow(
      decodeURIComponent,
      replace(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9-öäüÖÄÜß]+)\/?$/,
        "$3"
      )
    ),
    buildLink: (label) => label,
    Icon: Linkedin,
  },
  {
    fieldLabel: "phonePrivate",
    formLabel: "Phone (private)",
    type: "phone",
    buildLink: (label) => `tel:${label}`,
    Icon: Phone,
  },
  {
    fieldLabel: "phoneWork",
    formLabel: "Phone (work)",
    type: "phone",
    buildLink: (label) => `tel:${label}`,
    Icon: Building,
  },
  {
    fieldLabel: "emailPrivate",
    formLabel: "Email (private)",
    type: "email",
    buildLink: (label) => `mailto:${label}`,
    Icon: Mail,
  },
  {
    fieldLabel: "emailWork",
    formLabel: "Email (Work)",
    type: "email",
    buildLink: (label) => `mailto:${label.toLowerCase()}`,
    Icon: Building,
  },
  {
    fieldLabel: "salesforce",
    formLabel: "Salesforce link",
    type: "url",
    Icon: ExternalLink,
  },
  {
    fieldLabel: "instagram",
    formLabel: "Instagram profile",
    type: "url",
    Icon: Instagram,
  },
  {
    fieldLabel: "amazonalias",
    formLabel: "Amazon Alias",
    type: "string",
    buildLink: (label) => `https://phonetool.amazon.com/users/${label}`,
    Icon: AtSign,
  },
] as const;

type PersonData = SelectionSet<Schema["Person"]["type"], typeof selectionSet>;
type AccountData = PersonData["accounts"][number];

type PersonAccountChangeProps = {
  startDate?: Date;
  endDate?: Date;
  position?: string;
  accountId?: string;
};

export type PersonAccountCreateProps = {
  accountId: string;
} & PersonAccountChangeProps;

export type PersonAccountUpdateProps = {
  personAccountId: string;
} & PersonAccountChangeProps;

export type PersonContactDetailsUpdateProps =
  PersonContactDetailsCreateProps & { id: string };

export type PersonContactDetailsCreateProps = {
  label: string;
  detail: string;
};

export type PersonAccount = {
  personAccountId: string;
  accountId: string;
  accountName: string;
  startDate?: Date;
  endDate?: Date;
  position?: string;
  isCurrent: boolean;
};

export type PersonDetail = {
  id: string;
  label: string;
  detail: string;
};

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

export type Person = {
  id: string;
  name: string;
  howToSay?: string;
  relationships: PersonRelationship[];
  details: PersonDetail[];
  accounts: PersonAccount[];
  dateOfDeath?: Date;
  dateOfBirth?: Date;
  updatedAt: Date;
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

const getRelationType = (
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

type MinimalPersonData = {
  id: string;
  name: string;
  birthday?: string | null;
  dateOfDeath?: string | null;
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

export const mapPerson = ({
  id,
  name,
  howToSay,
  dateOfDeath,
  birthday,
  accounts,
  details,
  updatedAt,
  relationshipsFrom,
  relationshipsTo,
}: PersonData): Person => ({
  id,
  name,
  howToSay: howToSay || undefined,
  relationships: flow(
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
        ? 0
        : [
            [orderRelationShip(nameOfRelationship), 1],
            [!anniversary ? 0 : getYear(anniversary), 10000],
            [!anniversary ? 0 : getMonth(anniversary), 100],
            [!anniversary ? 0 : getDate(anniversary), 100],
          ].reduce((acc, cur) => acc * cur[1] + cur[0], 0)
    )
  )([]),
  dateOfBirth: !birthday ? undefined : new Date(birthday),
  dateOfDeath: !dateOfDeath ? undefined : new Date(dateOfDeath),
  details,
  updatedAt: new Date(updatedAt),
  accounts: flow(
    map(
      (a: AccountData): PersonAccount => ({
        personAccountId: a.id,
        accountId: a.account.id,
        accountName: a.account.name,
        startDate: !a.startDate ? undefined : new Date(a.startDate),
        endDate: !a.endDate ? undefined : new Date(a.endDate),
        position: a.position || undefined,
        isCurrent: !a.endDate || isFuture(new Date(a.endDate)),
      })
    ),
    sortBy((a) => -(a.startDate?.getTime() || 0))
  )(accounts),
});

const fetchPerson = (personId?: string) => async () => {
  if (!personId) return;
  const { data, errors } = await client.models.Person.get(
    { id: personId },
    {
      selectionSet,
    }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading person");
    throw errors;
  }
  if (!data) throw new Error("fetchPerson returns no data");
  try {
    return mapPerson(data);
  } catch (error) {
    console.error("fetchPerson", { error });
    throw error;
  }
};

const usePerson = (personId?: string) => {
  const {
    data: person,
    mutate,
    error: errorPerson,
    isLoading: loadingPerson,
  } = useSWR(`/api/person/${personId}`, fetchPerson(personId));

  const deletePerson = async () => {
    if (!person) return;
    const { data, errors } = await client.models.Person.delete({
      id: person.id,
    });
    if (errors) handleApiErrors(errors, "Deleting person failed");
    return data?.id;
  };

  const updatePerson = async ({
    name,
    howToSay,
    dateOfBirth,
    dateOfDeath,
  }: Partial<Person>) => {
    if (!person) return;
    const updated: Person = { ...person };
    Object.assign(updated, {
      ...(name && { name }),
      ...(howToSay && { howToSay }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(dateOfDeath && { dateOfDeath }),
    });
    mutate(updated, false);

    const { data, errors } = await client.models.Person.update({
      id: person.id,
      name,
      howToSay,
      birthday: !dateOfBirth ? undefined : toISODateString(dateOfBirth),
      dateOfDeath: !dateOfDeath ? undefined : toISODateString(dateOfDeath),
    });
    if (errors) handleApiErrors(errors, "Update person failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Person updated",
    });
    return data.id;
  };

  const createRelationship = async () => {
    if (!person) return;
    const updated: Person = {
      ...person,
      relationships: [
        ...person.relationships,
        { id: crypto.randomUUID(), direction: "from" },
      ],
    };
    mutate(updated, false);
    const { data, errors } = await client.models.PersonRelationship.create({
      personId: person.id,
    });
    if (errors) handleApiErrors(errors, "Creating person relationship failed");
    mutate(updated);
    return data?.id;
  };

  const updateRelationship = async ({
    id,
    anniversary,
    endDate,
    nameOfAnniversary,
    nameOfRelationship,
    relatedPerson,
  }: Partial<PersonRelationship> & { id: string }) => {
    if (!person) return;
    if (id === "NEW") return createRelationship();

    const updRelation = (() => {
      const relationship = person.relationships.find((r) => r.id === id);
      return !relationship
        ? undefined
        : ({ ...relationship } as PersonRelationship);
    })();
    if (!updRelation) return;
    const relationType = getRelationType(
      updRelation.direction,
      nameOfRelationship
    );

    Object.assign(updRelation, {
      ...(anniversary && { anniversary }),
      ...(endDate && { endDate }),
      ...(nameOfAnniversary && { nameOfAnniversary }),
      ...(relationType && {
        nameOfRelationship:
          updRelation.direction === "from"
            ? relationType.name
            : relationType.nameOfOtherDirection,
      }),
      ...(relatedPerson && { relatedPerson }),
    });

    const updPerson = {
      ...person,
      relationships: person.relationships.map((r) =>
        r.id === id ? updRelation : r
      ),
    } as Person;
    mutate(updPerson, false);

    const { data, errors } = await client.models.PersonRelationship.update({
      id,
      personId:
        updRelation.direction === "from" ? person.id : relatedPerson?.id,
      relatedPersonId:
        updRelation.direction === "to" ? person.id : relatedPerson?.id,
      ...(!relationType
        ? {}
        : {
            typeName:
              updRelation.direction === "from"
                ? relationType.name
                : relationType.nameOfOtherDirection,
          }),
      ...(!anniversary ? {} : { date: toISODateString(anniversary) }),
      ...(!endDate ? {} : { endDate: toISODateString(endDate) }),
    });
    if (errors) handleApiErrors(errors, "Updating person relation failed");
    mutate(updPerson);
    return data?.id;
  };

  const deleteRelationship = async (relationshipId: string) => {
    const updated: Person | undefined = !person
      ? undefined
      : ({
          ...person,
          relationships: person.relationships.filter(
            (r) => r.id !== relationshipId
          ),
        } as Person);
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.PersonRelationship.delete({
      id: relationshipId,
    });
    if (errors) handleApiErrors(errors, "Deleting person relation failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const deletePersonAccount = async (personAccountId: string) => {
    if (!person) return;
    const updated = {
      ...person,
      accounts: person.accounts.filter(
        (pa) => pa.personAccountId !== personAccountId
      ),
    };
    mutate(updated, false);
    const { data, errors } = await client.models.PersonAccount.delete({
      id: personAccountId,
    });
    if (errors) handleApiErrors(errors, "Deleting work history record failed");
    mutate(updated);
    if (!data) return;
    toast({ title: "Deleted work history record" });
    return data.id;
  };

  const updatePersonAccount = async (
    personAccount: PersonAccountUpdateProps
  ) => {
    if (!person) return;
    const updated: Person = {
      ...person,
      accounts: person.accounts.map((pa) =>
        pa.personAccountId !== personAccount.personAccountId
          ? pa
          : {
              ...pa,
              accountId: personAccount.accountId || pa.accountId,
              startDate: personAccount.startDate || pa.startDate,
              endDate: personAccount.endDate || pa.endDate,
              position: personAccount.position || pa.position,
            }
      ),
    };
    mutate(updated, false);
    const { data, errors } = await client.models.PersonAccount.update({
      id: personAccount.personAccountId,
      accountId: personAccount.accountId,
      position: personAccount.position,
      startDate: !personAccount.startDate
        ? undefined
        : toISODateString(personAccount.startDate),
      endDate: !personAccount.endDate
        ? undefined
        : toISODateString(personAccount.endDate),
    });
    if (errors) handleApiErrors(errors, "Updating work history record failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Updated work history record",
    });
    return data.id;
  };

  const createPersonAccount = async (
    personAccount: PersonAccountCreateProps
  ) => {
    if (!person) return;
    const updated: Person = {
      ...person,
      accounts: [
        ...person.accounts,
        {
          personAccountId: crypto.randomUUID(),
          accountName: "",
          isCurrent: true,
          ...personAccount,
        },
      ],
    };
    mutate(updated, false);

    const { data, errors } = await client.models.PersonAccount.create({
      personId: person.id,
      accountId: personAccount.accountId,
      startDate: !personAccount.startDate
        ? undefined
        : toISODateString(personAccount.startDate),
      endDate: !personAccount.endDate
        ? undefined
        : toISODateString(personAccount.endDate),
      position: personAccount.position,
    });

    if (errors)
      handleApiErrors(errors, "Creating person account relationship failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Work history record created",
    });
    return data.id;
  };

  const createContactDetail = async (
    props: PersonContactDetailsCreateProps
  ) => {
    if (!person) return;
    if (!personDetailsLabels.some((l) => l.fieldLabel === props.label)) return;
    const updated: Person = {
      ...person,
      details: [...person.details, { ...props, id: crypto.randomUUID() }],
    };
    mutate(updated, false);
    const { data, errors } = await client.models.PersonDetail.create({
      label: props.label as TDetailLabel,
      detail: props.detail,
      personId: person.id,
    });
    if (errors) handleApiErrors(errors, "Creating contact detail failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Created contact detail",
      description: `${
        personDetailsLabels.find((l) => l.fieldLabel === props.label)?.formLabel
      }: ${props.detail}`,
    });
    return data.id;
  };

  const updateContactDetail = async (
    contactDetail: PersonContactDetailsUpdateProps
  ) => {
    if (!person) return;
    if (!personDetailsLabels.some((l) => l.fieldLabel === contactDetail.label))
      return;
    const updated: Person = {
      ...person,
      details: person.details.map((d) =>
        d.id !== contactDetail.id ? d : { ...d, ...contactDetail }
      ),
    };
    mutate(updated, false);
    const { data, errors } = await client.models.PersonDetail.update({
      ...contactDetail,
      label: contactDetail.label as TDetailLabel,
    });
    if (errors) handleApiErrors(errors, "Updating contact details failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Updated contact detail",
      description: `${
        personDetailsLabels.find((l) => l.fieldLabel === contactDetail.label)
          ?.formLabel
      }: ${contactDetail.detail}`,
    });
    return data.id;
  };

  const deleteContactDetail = async (contactDetailId: string) => {
    if (!person) return;
    const updated: Person = {
      ...person,
      details: person.details.filter((d) => d.id !== contactDetailId),
    };
    mutate(updated, false);
    const { data, errors } = await client.models.PersonDetail.delete({
      id: contactDetailId,
    });
    if (errors) handleApiErrors(errors, "Deleting contact detail failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Contact detail deleted",
      description: `${
        personDetailsLabels.find((l) => l.fieldLabel === data.label)?.formLabel
      }: ${data.detail}`,
    });
    return data.id;
  };

  return {
    person,
    errorPerson,
    loadingPerson,
    updatePerson,
    deletePerson,
    createPersonAccount,
    deletePersonAccount,
    updatePersonAccount,
    createContactDetail,
    updateContactDetail,
    deleteContactDetail,
    updateRelationship,
    deleteRelationship,
  };
};

export default usePerson;
