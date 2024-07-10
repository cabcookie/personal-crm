import usePeople from "@/api/usePeople";
import { FC } from "react";
import ComboBox from "../../combo-box/combo-box";

type PeopleSelectorProps = {
  value: string;
  onChange: (personId: string | null) => void;
  allowNewPerson?: boolean;
  placeholder?: string;
};

const PeopleSelector: FC<PeopleSelectorProps> = ({
  value,
  onChange,
  allowNewPerson,
  placeholder = "Search person…",
}) => {
  const { people, createPerson } = usePeople();

  const onCreate = async (newPersonName: string) => {
    const person = await createPerson(newPersonName);
    if (person) onChange(person);
  };

  return (
    <ComboBox
      currentValue={value}
      placeholder={placeholder}
      noSearchResultMsg="No person found."
      onChange={onChange}
      onCreate={allowNewPerson ? onCreate : undefined}
      options={people?.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
    />
  );
};
export default PeopleSelector;
