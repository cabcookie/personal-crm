import usePeople, { LeanPerson } from "@/api/usePeople";
import { FC, useRef, useState } from "react";
import ComboBox from "../../combo-box/combo-box";

type PeopleSelectorProps = {
  value: string;
  onChange: (personId: string | null) => void;
  allowNewPerson?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

const SEARCH_DEBOUNCE_MS = 250;

const toOption = ({ id, name, accountNames }: LeanPerson) => ({
  value: id,
  label: `${name}${!accountNames ? "" : ` (${accountNames})`}`,
});

const PeopleSelector: FC<PeopleSelectorProps> = ({
  value,
  onChange,
  allowNewPerson,
  disabled,
  placeholder = "Search person…",
}) => {
  const { people, createPerson, searchPeople, getPersonById } = usePeople();
  // While the user types, semantic-search matches; empty query → recent set.
  // `null` means "no active query" so we render the recent `people` set.
  const [matches, setMatches] = useState<LeanPerson[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCreate = async (newPersonName: string) => {
    const person = await createPerson(newPersonName);
    if (person) {
      // Drop the stale search results so the list shows the cache again.
      setMatches(null);
      onChange(person);
    }
  };

  const handleSearch = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (!q) {
      setMatches(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setMatches(await searchPeople(q));
    }, SEARCH_DEBOUNCE_MS);
  };

  // Derived during render (no effect): search matches when querying, else the
  // recent set. The currently selected person is always included so the
  // trigger can show its name even when it isn't among the current matches /
  // recent set (e.g. just created, or picked from an earlier search).
  const base = matches ?? people ?? [];
  const selected = value ? getPersonById(value) : undefined;
  const displayed =
    selected && !base.some((p) => p.id === selected.id)
      ? [selected, ...base]
      : base;

  return (
    <ComboBox
      currentValue={value}
      placeholder={placeholder}
      noSearchResultMsg="No person found."
      onChange={onChange}
      onCreate={allowNewPerson ? onCreate : undefined}
      onSearch={handleSearch}
      options={displayed.map(toOption)}
      disabled={disabled}
    />
  );
};
export default PeopleSelector;
