import usePerson from "@/api/usePerson";
import MainLayout from "@/components/layouts/MainLayout";
import PersonDetails from "@/components/people/PersonDetails";
import { useRouter } from "next/router";
import { useState } from "react";

const PersonDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const personId = Array.isArray(id) ? id[0] : id;
  const { person } = usePerson(personId);
  const [formOpen, setFormOpen] = useState(false);

  const makePersonName = () =>
    !person
      ? undefined
      : `${person.name}${!person.howToSay ? "" : ` (say: ${person.howToSay})`}`;

  return (
    <MainLayout
      title={makePersonName()}
      recordName={person?.name}
      sectionName="People"
      addButton={{ label: "Edit", onClick: () => setFormOpen(true) }}
    >
      <PersonDetails
        personId={person?.id}
        updateFormControl={{ open: formOpen, setOpen: setFormOpen }}
      />
    </MainLayout>
  );
};

export default PersonDetailPage;
