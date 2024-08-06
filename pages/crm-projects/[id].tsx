import useCrmProject from "@/api/useCrmProject";
import MainLayout from "@/components/layouts/MainLayout";
import CrmProjectDetails from "@/components/ui-elements/crm-project-details/crm-project-details";
import { useRouter } from "next/router";

const CrmProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const crmProjectId = Array.isArray(id) ? id[0] : id;
  const { crmProject } = useCrmProject(crmProjectId);

  return (
    <MainLayout
      title={crmProject?.name}
      recordName={crmProject?.name}
      sectionName="CRM Projects"
      onBackBtnClick={() => router.push("/crm-projects")}
    >
      <div className="space-y-6">
        {crmProjectId && (
          <CrmProjectDetails crmProjectId={crmProjectId} showProjects />
        )}
      </div>
    </MainLayout>
  );
};

export default CrmProjectDetailPage;
