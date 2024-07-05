import usePerson from "@/api/usePerson";
import MainLayout from "@/components/layouts/MainLayout";
import PersonDetails from "@/components/people/PersonDetails";
import { useRouter } from "next/router";
import { useState } from "react";

const PersonDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { person } = usePerson(Array.isArray(id) ? id[0] : id);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <MainLayout
      title={`${person?.name}${
        !person?.howToSay ? "" : ` (say: ${person.howToSay})`
      }`}
      recordName={person?.name}
      sectionName="People"
      addButton={{ label: "Edit", onClick: () => setFormOpen(true) }}
    >
      {!person ? (
        "Loading person…"
      ) : (
        <PersonDetails
          personId={person.id}
          updateFormControl={{ open: formOpen, setOpen: setFormOpen }}
        />
      )}
    </MainLayout>
  );
};

export default PersonDetailPage;
