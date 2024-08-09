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
  } = usePerson(personId);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const router = useRouter();

  const handlePersonDelete = async () => {
    const result = await deletePerson();
    if (!result) return;
    router.push("/");
  };

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

      <DeleteWarning
        open={deleteWarningOpen}
        onOpenChange={setDeleteWarningOpen}
        confirmText="Are you sure you want to delete the person?"
        onConfirm={handlePersonDelete}
      />

      <div>
        <Button
          onClick={() => setDeleteWarningOpen(true)}
          disabled={deleteWarningOpen}
        >
          Delete
        </Button>
      </div>

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
