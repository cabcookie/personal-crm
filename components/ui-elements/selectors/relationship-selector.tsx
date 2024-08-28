import { RELATIONSHIP_TYPES, TRelationshipTypes } from "@/api/usePerson";
import ComboBox from "@/components/combo-box/combo-box";
import { capitalize } from "lodash";
import { FC } from "react";

type RelationshipSelectorProps = {
  value?: TRelationshipTypes;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

const RelationshipSelector: FC<RelationshipSelectorProps> = ({
  value,
  onChange,
  disabled,
  placeholder = "Select type…",
}) => (
  <ComboBox
    currentValue={value ?? ""}
    placeholder={placeholder}
    noSearchResultMsg="No type found."
    onChange={onChange}
    options={RELATIONSHIP_TYPES.map((type) => ({
      value: type,
      label: capitalize(type),
    }))}
    disabled={disabled}
  />
);

export default RelationshipSelector;
