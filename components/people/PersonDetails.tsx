import usePerson from "@/api/usePerson";
import { FC, useState } from "react";
import { Accordion } from "../ui/accordion";
import PersonDates from "./PersonDates";
import PersonNotes from "./PersonNotes";
import PersonUpdateForm from "./PersonUpdateForm";
import PersonAccounts from "./PersonAccounts";
import PersonContactDetails from "./PersonContactDetails";

type PersonDetailsProps = {
  personId: string;
  updateFormControl?: {
    open: boolean;
    setOpen: (val: boolean) => void;
  };
  showNotes?: boolean;
};

const PersonDetails: FC<PersonDetailsProps> = ({
  personId,
  updateFormControl,
  showNotes = true,
}) => {
  const {
    person,
    updatePerson,
    createPersonAccount,
    deletePersonAccount,
    updatePersonAccount,
    createContactDetail,
    updateContactDetail,
    deleteContactDetail,
  } = usePerson(personId);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return (
    person && (
      <>
        <div className="ml-2">
          <PersonUpdateForm
            person={person}
            onUpdate={updatePerson}
            formControl={updateFormControl}
          />
        </div>

        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={(val) =>
            setAccordionValue(val === accordionValue ? undefined : val)
          }
        >
          <PersonAccounts
            person={person}
            accordionSelectedValue={accordionValue}
            onCreate={createPersonAccount}
            onDelete={deletePersonAccount}
            onChange={updatePersonAccount}
          />

          <PersonContactDetails
            person={person}
            accordionSelectedValue={accordionValue}
            onCreate={createContactDetail}
            onChange={updateContactDetail}
            onDelete={deleteContactDetail}
          />

          <PersonDates
            person={person}
            accordionSelectedValue={accordionValue}
          />

          <PersonNotes
            personId={person.id}
            accordionSelectedValue={accordionValue}
            showNotes={showNotes}
          />
        </Accordion>
      </>
    )
  );
};

export default PersonDetails;
