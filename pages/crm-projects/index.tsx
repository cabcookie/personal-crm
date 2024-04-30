import useCrmProjects from "@/api/useCrmProjects";
import MainLayout from "@/components/layouts/MainLayout";

const CrmProjectsPage = () => {
  const { crmProjects } = useCrmProjects();
  return (
    <MainLayout title="CRM Projects" sectionName="CRM Projects">
      {crmProjects?.map(({ id, name }) => (
        <div key={id}>{name}</div>
      ))}
    </MainLayout>
  );
};

export default CrmProjectsPage;
