import useCrmProjects from "@/api/useCrmProjects";
import ImportProjectData from "@/components/crm/import-project-data";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import LoadingAccordionItem from "@/components/ui-elements/accordion/LoadingAccordionItem";
import CrmProjectDetails from "@/components/ui-elements/crm-project-details/crm-project-details";
import { Accordion } from "@/components/ui/accordion";
import { flow, identity, map, times } from "lodash/fp";

const CrmProjectsPage = () => {
  const { crmProjects, isLoading, error } = useCrmProjects();

  return (
    <MainLayout title="CRM Projects" sectionName="CRM Projects">
      <div className="space-y-6">
        <ImportProjectData />

        <Accordion type="single" collapsible>
          {isLoading &&
            flow(
              times(identity),
              map((id: number) => (
                <LoadingAccordionItem
                  key={id}
                  value={`loading-${id}`}
                  sizeTitle="lg"
                  sizeSubtitle="base"
                />
              ))
            )(10)}

          <ApiLoadingError title="Loading CRM Projects failed" error={error} />

          {crmProjects?.map(({ id }) => (
            <CrmProjectDetails key={id} crmProjectId={id} showProjects />
          ))}
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default CrmProjectsPage;
