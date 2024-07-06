import usePerson from "@/api/usePerson";
import { FC, useState } from "react";
import { Accordion } from "../ui/accordion";
import PersonDates from "./PersonDates";
import PersonNotes from "./PersonNotes";
import PersonUpdateForm from "./PersonUpdateForm";
import PersonAccounts from "./PersonAccounts";

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
            accordionSelectedValue={accordionValue}
            person={person}
            onCreate={createPersonAccount}
            onDelete={deletePersonAccount}
            onChange={updatePersonAccount}
          />

          <PersonDates
            person={person}
            accordionSelectedValue={accordionValue}
          />

          <PersonNotes
            accordionSelectedValue={accordionValue}
            personId={person.id}
            showNotes={showNotes}
          />
        </Accordion>
      </>
    )
  );
};

export default PersonDetails;
