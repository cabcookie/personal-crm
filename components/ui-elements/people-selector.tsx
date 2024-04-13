import usePeople from "@/api/usePeople";
import { FC, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

type Person = { id: string; name: string };

type PeopleSelectorProps = {
  onChange: (person: Person) => void;
  clearAfterSelection?: boolean;
  allowNewPerson?: boolean;
};

const PeopleSelector: FC<PeopleSelectorProps> = ({
  onChange,
  clearAfterSelection,
  allowNewPerson,
}) => {
  const { people, createPerson } = usePeople();
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const mapOptions = () =>
    people?.map((person) => ({
      value: person.id,
      label: person.name,
    }));

  const selectPerson = async (selectedOption: any) => {
    if (!(allowNewPerson && selectedOption.__isNew__)) {
      const person = people?.find((p) => p.id === selectedOption.value);
      if (!person) return;
      onChange(person);
      if (clearAfterSelection) setSelectedOption(null);
      return;
    }
    const person = await createPerson(selectedOption.label);
    if (!person) return;
    onChange(person);
    if (clearAfterSelection) setSelectedOption(null);
  };

  const filterPeople = (personId: string, input: string) =>
    !!people
      ?.find((p) => p.id === personId)
      ?.name.toLowerCase()
      .includes(input.toLowerCase());

  return (
    <div>
      {!allowNewPerson ? (
        <Select
          options={mapOptions()}
          onChange={selectPerson}
          isClearable
          isSearchable
          placeholder="Add person..."
          filterOption={(candidate, input) =>
            filterPeople(candidate.value, input)
          }
          value={selectedOption}
        />
      ) : (
        <CreatableSelect
          options={mapOptions()}
          onChange={selectPerson}
          isClearable
          isSearchable
          placeholder="Add person..."
          value={selectedOption}
          filterOption={(candidate, input) =>
            filterPeople(candidate.value, input)
          }
          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        />
      )}
    </div>
  );
};
export default PeopleSelector;
