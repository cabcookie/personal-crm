import { CrmProject } from "@/api/useCrmProjects";
import GroupCrmProjects from "@/components/crm/group-projects";
import ImportProjectData from "@/components/crm/import-project-data";
import CrmProjectsListFilter from "@/components/crm/list-filters";
import CrmProjectsPipelineHygiene from "@/components/crm/pipeline-hygiene";
import {
  TProjectFilters,
  useCrmProjectsFilter,
  withCrmProjectsFilter,
} from "@/components/crm/useCrmProjectsFilter";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import LoadingAccordionItem from "@/components/ui-elements/accordion/LoadingAccordionItem";
import CrmProjectAccordionItem from "@/components/ui-elements/crm-project-details/CrmProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { filter, flow, identity, map, size, times, uniq } from "lodash/fp";

const CrmProjectsPage = () => {
  const { crmProjects, isLoading, error, selectedFilter } =
    useCrmProjectsFilter();

  return (
    <MainLayout title="CRM Projects" sectionName="CRM Projects">
      <div className="space-y-6">
        <ImportProjectData />

        <CrmProjectsListFilter />

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

          {crmProjects &&
            (
              [
                "All",
                "No Project",
                "Differenct Account",
                "Differenct Partner",
              ] as TProjectFilters[]
            ).includes(selectedFilter) && (
              <div className="font-semibold text-sm text-muted-foreground">
                {crmProjects.length} projects.
              </div>
            )}

          {selectedFilter === "Update Due" ? (
            <CrmProjectsPipelineHygiene crmProjects={crmProjects} />
          ) : selectedFilter === "By Account" ? (
            <GroupCrmProjects
              crmProjects={crmProjects}
              propertyName="accountName"
            />
          ) : selectedFilter === "By Partner" ? (
            <>
              {crmProjects && (
                <div className="font-semibold text-sm text-muted-foreground">
                  {flow(
                    filter((p: CrmProject) => !!p.partnerName),
                    size
                  )(crmProjects)}{" "}
                  projects with{" "}
                  {flow(
                    map((p: CrmProject) => p.partnerName),
                    uniq,
                    size
                  )(crmProjects)}{" "}
                  partners.
                </div>
              )}

              <GroupCrmProjects
                crmProjects={crmProjects}
                propertyName="partnerName"
              />
            </>
          ) : (
            crmProjects?.map(({ id }) => (
              <CrmProjectAccordionItem
                key={id}
                crmProjectId={id}
                showProjects
              />
            ))
          )}
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default withCrmProjectsFilter(CrmProjectsPage);
