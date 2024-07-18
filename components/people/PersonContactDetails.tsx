import {
  Person,
  PersonContactDetailsCreateProps,
  PersonContactDetailsUpdateProps,
  personDetailsLabels,
} from "@/api/usePerson";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import PersonContactDetail from "./PersonContactDetail";
import PersonContactDetailsForm from "./PersonContactDetailsForm";

type PersonContactDetailsProps = {
  person: Person;
  onCreate: (data: PersonContactDetailsCreateProps) => void;
  onChange: (data: PersonContactDetailsUpdateProps) => void;
  onDelete: (personDetailId: string) => void;
};

const PersonContactDetails: FC<PersonContactDetailsProps> = ({
  person,
  onCreate,
  onChange,
  onDelete,
}) => (
  <DefaultAccordionItem
    value="person-contact-details"
    triggerTitle="Contact details"
    triggerSubTitle={person.details.map(
      (d) =>
        `${
          personDetailsLabels.find((l) => l.fieldLabel === d.label)?.formLabel
        }: ${d.detail}`
    )}
  >
    <PersonContactDetailsForm personName={person.name} onCreate={onCreate} />

    <div className="mt-4" />

    {person.details.map((pd) => (
      <PersonContactDetail
        key={pd.id}
        personDetail={pd}
        personName={person.name}
        onChange={onChange}
        onDelete={onDelete}
        detailType={personDetailsLabels.find((l) => l.fieldLabel === pd.label)}
      />
    ))}
  </DefaultAccordionItem>
);

export default PersonContactDetails;
