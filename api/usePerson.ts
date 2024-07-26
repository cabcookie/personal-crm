import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { toISODateString } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { isFuture } from "date-fns";
import { flow, map, sortBy } from "lodash/fp";
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
    buildLabel: (label) =>
      label.replace(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9-]+)\/?$/,
        "$3"
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

export type Person = {
  id: string;
  name: string;
  howToSay?: string;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
  details: PersonDetail[];
  accounts: PersonAccount[];
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
}: PersonData): Person => ({
  id,
  name,
  howToSay: howToSay || undefined,
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
      updatedAt: new Date(),
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
    createPersonAccount,
    deletePersonAccount,
    updatePersonAccount,
    createContactDetail,
    updateContactDetail,
    deleteContactDetail,
  };
};

export default usePerson;
