import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { getDateOrUndefined, toISODateString } from "@/helpers/functional";
import {
  getAccounts,
  PersonAccount,
  PersonAccountCreateProps,
  PersonAccountUpdateProps,
} from "@/helpers/person/accounts";
import {
  PersonContactDetailsCreateProps,
  PersonContactDetailsUpdateProps,
  PersonDetail,
  personDetailsLabels,
  TDetailLabel,
} from "@/helpers/person/details";
import {
  getRelationships,
  getRelationType,
  PersonRelationship,
} from "@/helpers/person/relationships";
import { generateClient, SelectionSet } from "aws-amplify/data";
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

export type PersonData = SelectionSet<
  Schema["Person"]["type"],
  typeof selectionSet
>;

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
  relationships: getRelationships(relationshipsFrom, relationshipsTo),
  dateOfBirth: getDateOrUndefined(birthday),
  dateOfDeath: getDateOrUndefined(dateOfDeath),
  details,
  updatedAt: new Date(updatedAt),
  accounts: getAccounts(accounts),
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

  const createRelationship = async ({
    relatedPerson,
    nameOfRelationship,
  }: Partial<Omit<PersonRelationship, "id">>) => {
    if (!person) return;
    const updated: Person = {
      ...person,
      relationships: [
        ...person.relationships,
        {
          id: crypto.randomUUID(),
          direction: "from",
          relatedPerson,
          nameOfRelationship,
        },
      ],
    };
    mutate(updated, false);
    const { data, errors } = await client.models.PersonRelationship.create({
      personId: person.id,
      relatedPersonId: relatedPerson?.id,
      typeName: nameOfRelationship,
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
    if (id === "NEW")
      return createRelationship({ relatedPerson, nameOfRelationship });

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
