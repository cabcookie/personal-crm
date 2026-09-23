import usePayer from "@/api/usePayer";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import DeleteWarning from "../ui-elements/project-notes-form/DeleteWarning";
import usePeople from "@/api/usePeople";
import PersonDetails from "../people/PersonDetails";

type PayerPersonProps = {
  payerId: string;
  showPerson?: boolean;
};

const PayerPerson: FC<PayerPersonProps> = ({ payerId, showPerson }) => {
  const { payer, deletePerson } = usePayer(payerId);
  const { getPersonById, getNamesByIds } = usePeople();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // Cache-backed; triggers an on-demand load and re-renders once present.
  const person = getPersonById(payer?.mainContactId);

  return (
    person && (
      <>
        <DeleteWarning
          open={showDeleteConfirmation}
          onOpenChange={setShowDeleteConfirmation}
          confirmText={`Are you sure you want to remove the person "${person.name}" from the Payer Account?`}
          onConfirm={deletePerson}
        />

        <DefaultAccordionItem
          value="main-contact"
          triggerTitle={
            !payer?.mainContactId
              ? undefined
              : `Main Contact: ${getNamesByIds([payer.mainContactId])}`
          }
          link={`/people/${person?.id}`}
          isVisible={!!showPerson}
          onDelete={() => setShowDeleteConfirmation(true)}
        >
          <PersonDetails personId={person?.id} />
        </DefaultAccordionItem>
      </>
    )
  );
};

export default PayerPerson;
