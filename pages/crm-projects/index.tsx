import useCrmProjects from "@/api/useCrmProjects";
import MainLayout from "@/components/layouts/MainLayout";
import CrmProjectDetails from "@/components/ui-elements/crm-project-details/crm-project-details";
import { Accordion } from "@/components/ui/accordion";

const CrmProjectsPage = () => {
  const { crmProjects } = useCrmProjects();
  return (
    <MainLayout title="CRM Projects" sectionName="CRM Projects">
      <Accordion type="single" collapsible>
        {crmProjects?.map(({ id }) => (
          <CrmProjectDetails key={id} crmProjectId={id} />
        ))}
      </Accordion>
    </MainLayout>
  );
};

export default CrmProjectsPage;
