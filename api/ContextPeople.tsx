import { FC, ReactNode, createContext, useContext } from "react";
import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import useSWR from "swr";
const client = generateClient<Schema>();

interface PeopleContextType {
  people: Person[] | undefined;
  errorPeople: any;
  loadingPeople: boolean;
  getPersonById: (id: string) => Person | undefined;
  createPerson: (name: string) => Promise<Person | undefined>;
}

interface PeopleContextProviderProps {
  children: ReactNode;
}

type Person = {
  id: string;
  name: string;
};

const mapPerson: (person: Schema["Person"]) => Person = ({ id, name }) => ({
  id,
  name,
});

const fetchPeople = async () => {
  const { data, errors } = await client.models.Person.list({ limit: 800 });
  if (errors) throw errors;
  return data.map(mapPerson);
};

export const PeopleContextProvider: FC<PeopleContextProviderProps> = ({
  children,
}) => {
  const {
    data: people,
    error: errorPeople,
    isLoading: loadingPeople,
    mutate: mutatePeople,
  } = useSWR("/api/people", fetchPeople);

  const createPerson = async (name: string) => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name,
    };
    const updated = [...(people || []), newPerson];
    mutatePeople(updated, false);

    const { data, errors } = await client.models.Person.create({ name });
    if (errors) handleApiErrors(errors, "Error creating person");
    mutatePeople(updated);
    return mapPerson(data);
  };

  const getPersonById = (id: string) =>
    people?.find((person) => person.id === id);

  return (
    <PeopleContext.Provider
      value={{
        people,
        errorPeople,
        loadingPeople,
        createPerson,
        getPersonById,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const usePeopleContext = () => {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error(
      "usePeopleContext must be used within a PeopleContextProvider"
    );
  }
  return context;
};
