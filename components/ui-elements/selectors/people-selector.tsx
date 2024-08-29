import usePeople from "@/api/usePeople";
import { FC } from "react";
import ComboBox from "../../combo-box/combo-box";

type PeopleSelectorProps = {
  value: string;
  onChange: (personId: string | null) => void;
  allowNewPerson?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

const PeopleSelector: FC<PeopleSelectorProps> = ({
  value,
  onChange,
  allowNewPerson,
  disabled,
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
      options={people?.map(({ id, name, accountNames }) => ({
        value: id,
        label: `${name}${!accountNames ? "" : ` (${accountNames})`}`,
      }))}
      disabled={disabled}
    />
  );
};
export default PeopleSelector;
