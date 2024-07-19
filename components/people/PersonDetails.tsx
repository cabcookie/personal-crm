import usePerson from "@/api/usePerson";
import { FC } from "react";
import { Accordion } from "../ui/accordion";
import PersonAccounts from "./PersonAccounts";
import PersonContactDetails from "./PersonContactDetails";
import PersonDates from "./PersonDates";
import PersonLearnings from "./PersonLearnings";
import PersonNotes from "./PersonNotes";
import PersonUpdateForm from "./PersonUpdateForm";

type PersonDetailsProps = {
  personId?: string;
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

  return (
    <>
      {person && (
        <div className="ml-2">
          <PersonUpdateForm
            person={person}
            onUpdate={updatePerson}
            formControl={updateFormControl}
          />
        </div>
      )}

      <Accordion type="single" collapsible>
        <PersonAccounts
          person={person}
          onCreate={createPersonAccount}
          onDelete={deletePersonAccount}
          onChange={updatePersonAccount}
        />

        <PersonContactDetails
          person={person}
          onCreate={createContactDetail}
          onChange={updateContactDetail}
          onDelete={deleteContactDetail}
        />

        <PersonDates person={person} />

        <PersonLearnings personId={person?.id} />

        <PersonNotes personId={person?.id} showNotes={showNotes} />
      </Accordion>
    </>
  );
};

export default PersonDetails;
