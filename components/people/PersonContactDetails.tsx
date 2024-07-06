import {
  Person,
  PersonContactDetailsCreateProps,
  PersonContactDetailsUpdateProps,
  personDetailsLabels,
} from "@/api/usePerson";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import PersonContactDetailsForm from "./PersonContactDetailsForm";
import PersonContactDetail from "./PersonContactDetail";

type PersonContactDetailsProps = {
  person: Person;
  accordionSelectedValue?: string;
  onCreate: (data: PersonContactDetailsCreateProps) => void;
  onChange: (data: PersonContactDetailsUpdateProps) => void;
  onDelete: (personDetailId: string) => void;
};

const PersonContactDetails: FC<PersonContactDetailsProps> = ({
  person,
  accordionSelectedValue,
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
    accordionSelectedValue={accordionSelectedValue}
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
