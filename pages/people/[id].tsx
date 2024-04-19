import { usePeopleContext } from "@/api/ContextPeople";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PersonDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const personId = Array.isArray(id) ? id[0] : id;
  const { getPersonById, loadingPeople } = usePeopleContext();
  const [person, setPerson] = useState(
    personId ? getPersonById(personId) : undefined
  );

  useEffect(() => {
    if (personId) {
      setPerson(getPersonById(personId));
    }
  }, [getPersonById, personId]);

  return (
    <MainLayout
      title={person?.name}
      recordName={person?.name}
      sectionName="People"
    >
      {loadingPeople && "Loading person..."}
      {JSON.stringify(person)}
    </MainLayout>
  );
};

export default PersonDetailPage;
