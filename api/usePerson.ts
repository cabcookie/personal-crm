import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { toISODateString } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { flow, map, sortBy } from "lodash/fp";
import { isFuture } from "date-fns";
const client = generateClient<Schema>();

interface UpdatePersonProps {
  name: string;
  howToSay?: string;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
}

export const selectionSet = [
  "id",
  "name",
  "howToSay",
  "birthday",
  "dateOfDeath",
  "accounts.id",
  "accounts.startDate",
  "accounts.endDate",
  "accounts.position",
  "accounts.account.id",
  "accounts.account.name",
  "details.label",
  "details.detail",
] as const;

const personDetailsLabels = [
  "linkedIn",
  "phonePrivate",
  "phoneWork",
  "emailPrivate",
  "emailWork",
  "salesforce",
  "instagram",
] as const;

type TDetailLabel = (typeof personDetailsLabels)[number];

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

export type PersonAccount = {
  personAccountId: string;
  accountId: string;
  accountName: string;
  startDate?: Date;
  endDate?: Date;
  position?: string;
  isCurrent: boolean;
};

type PersonDetails = {
  label: TDetailLabel;
  detail: string;
};

export type Person = {
  id: string;
  name: string;
  howToSay?: string;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
  details: PersonDetails[];
  accounts: PersonAccount[];
};

export const mapPerson = ({
  id,
  name,
  howToSay,
  dateOfDeath,
  birthday,
  accounts,
  details,
}: PersonData): Person => ({
  id,
  name,
  howToSay: howToSay || undefined,
  dateOfBirth: !birthday ? undefined : new Date(birthday),
  dateOfDeath: !dateOfDeath ? undefined : new Date(dateOfDeath),
  details,
  accounts: flow(
    map(
      (a: AccountData): PersonAccount => ({
        personAccountId: a.id,
        accountId: a.account.id,
        accountName: a.account.name,
        startDate: !a.startDate ? undefined : new Date(a.startDate),
        endDate: !a.endDate ? undefined : new Date(a.endDate),
        position: a.position || undefined,
        isCurrent: !a.endDate || isFuture(a.endDate),
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
  if (errors) throw errors;
  if (!data) throw new Error("fetchPerson returns no data");
  return mapPerson(data);
};

const usePerson = (personId?: string) => {
  const {
    data: person,
    mutate,
    error: errorPerson,
    isLoading: loadingPerson,
  } = useSWR(`/api/person/${personId}`, fetchPerson(personId));

  const updatePerson = async ({
    name,
    howToSay,
    dateOfBirth,
    dateOfDeath,
  }: UpdatePersonProps) => {
    if (!person) return;
    const updated: Person = {
      id: person.id,
      name,
      howToSay: howToSay || person.howToSay,
      dateOfBirth: dateOfBirth || person.dateOfBirth,
      dateOfDeath: dateOfDeath || person.dateOfDeath,
      details: [],
      accounts: [],
    };
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

  return {
    person,
    errorPerson,
    loadingPerson,
    updatePerson,
    createPersonAccount,
    deletePersonAccount,
    updatePersonAccount,
  };
};

export default usePerson;
