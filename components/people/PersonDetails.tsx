import usePerson from "@/api/usePerson";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import DeleteWarning from "../ui-elements/project-notes-form/DeleteWarning";
import { Accordion } from "../ui/accordion";
import { Button } from "../ui/button";
import PersonAccounts from "./PersonAccounts";
import PersonContactDetails from "./PersonContactDetails";
import PersonDates from "./PersonDates";
import PersonLearnings from "./PersonLearnings";
import PersonNotes from "./PersonNotes";
import PersonRelationships from "./PersonRelationships";
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
    deletePerson,
    createPersonAccount,
    deletePersonAccount,
    updatePersonAccount,
    createContactDetail,
    updateContactDetail,
    deleteContactDetail,
    updateRelationship,
    deleteRelationship,
  } = usePerson(personId);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const router = useRouter();

  const handlePersonDelete = async () => {
    const result = await deletePerson();
    if (!result) return;
    router.push("/");
  };

  const handleDateChange = (dates: {
    dateOfBirth?: Date;
    dateOfDeath?: Date;
  }) => updatePerson(dates);

  return (
    <>
      {person && (
        <div className="ml-1 md:ml-2 flex flex-row gap-2">
          <PersonUpdateForm
            person={person}
            onUpdate={updatePerson}
            formControl={updateFormControl}
          />
          <Button
            onClick={() => setDeleteWarningOpen(true)}
            disabled={deleteWarningOpen}
            size="sm"
          >
            Delete
          </Button>
        </div>
      )}

      <DeleteWarning
        open={deleteWarningOpen}
        onOpenChange={setDeleteWarningOpen}
        confirmText="Are you sure you want to delete the person?"
        onConfirm={handlePersonDelete}
      />

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

        <PersonDates person={person} updateDateFn={handleDateChange} />

        <PersonLearnings personId={person?.id} />

        <PersonRelationships
          ownPersonId={person?.id}
          relationships={person?.relationships}
          updateRelationship={updateRelationship}
          deleteRelationship={deleteRelationship}
        />

        <PersonNotes personId={person?.id} showNotes={showNotes} />
      </Accordion>
    </>
  );
};

export default PersonDetails;
