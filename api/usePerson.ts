import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { toISODateString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type Person = {
  id: string;
  name: string;
  howToSay?: string;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
};

export const mapPerson = ({
  id,
  name,
  howToSay,
  dateOfDeath,
  birthday,
}: Schema["Person"]["type"]): Person => ({
  id,
  name,
  howToSay: howToSay || undefined,
  dateOfBirth: !birthday ? undefined : new Date(birthday),
  dateOfDeath: !dateOfDeath ? undefined : new Date(dateOfDeath),
});

const fetchPerson = (personId?: string) => async () => {
  if (!personId) return;
  const { data, errors } = await client.models.Person.get({ id: personId });
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

  interface UpdatePersonProps {
    name: string;
    howToSay?: string;
    dateOfBirth?: Date;
    dateOfDeath?: Date;
  }
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

  return {
    person,
    errorPerson,
    loadingPerson,
    updatePerson,
  };
};

export default usePerson;
