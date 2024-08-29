import { Person } from "@/api/usePerson";
import {
  PersonContactDetailsCreateProps,
  PersonContactDetailsUpdateProps,
  PersonDetail,
  personDetailsLabels,
} from "@/helpers/person/details";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import PersonContactDetail from "./PersonContactDetail";
import PersonContactDetailsForm from "./PersonContactDetailsForm";

type PersonContactDetailsProps = {
  person?: Person;
  onCreate: (data: PersonContactDetailsCreateProps) => void;
  onChange: (data: PersonContactDetailsUpdateProps) => void;
  onDelete: (personDetailId: string) => void;
};

const getPersonDetailLabel = (label: string) =>
  personDetailsLabels.find((l) => l.fieldLabel === label);

const buildLabel = (personDetail: PersonDetail) => {
  const pdLabel = getPersonDetailLabel(personDetail.label);
  return pdLabel?.buildLabel
    ? pdLabel.buildLabel(personDetail.detail)
    : personDetail.detail;
};

const PersonContactDetails: FC<PersonContactDetailsProps> = ({
  person,
  onCreate,
  onChange,
  onDelete,
}) =>
  !person ? (
    <LoadingAccordionItem
      value="loading-contact-details"
      sizeTitle="xl"
      sizeSubtitle="xs"
    />
  ) : (
    <DefaultAccordionItem
      value="person-contact-details"
      triggerTitle="Contact details"
      triggerSubTitle={person.details.map(buildLabel)}
    >
      <div className="space-y-4 px-1 md:px-2">
        <PersonContactDetailsForm
          personName={person.name}
          onCreate={onCreate}
        />

        {person.details.map((pd) => (
          <PersonContactDetail
            key={pd.id}
            personDetail={pd}
            personName={person.name}
            onChange={onChange}
            onDelete={onDelete}
            detailType={personDetailsLabels.find(
              (l) => l.fieldLabel === pd.label
            )}
          />
        ))}
      </div>
    </DefaultAccordionItem>
  );

export default PersonContactDetails;
