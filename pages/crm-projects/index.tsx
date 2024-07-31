import useCrmProjects from "@/api/useCrmProjects";
import useCrmProjectsImport from "@/api/useCrmProjectsImport";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import LoadingAccordionItem from "@/components/ui-elements/accordion/LoadingAccordionItem";
import CrmProjectDetails from "@/components/ui-elements/crm-project-details/crm-project-details";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { downloadDataFromS3, percentLoaded } from "@/helpers/s3/upload-filtes";
import { flow, identity, map, times } from "lodash/fp";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const CrmProjectsPage = () => {
  const { crmProjects, isLoading, error } = useCrmProjects();
  const {
    crmProjectsImport,
    isLoading: loadingImports,
    error: errorImports,
    uploadImportFile,
  } = useCrmProjectsImport("WIP");
  const [loadingData, setLoadingData] = useState(0);

  useEffect(() => {
    const download = async (path: string) => {
      const { result } = await downloadDataFromS3(
        path,
        flow(percentLoaded, setLoadingData)
      );
      const body = await (await result).body.text();
      console.log({ body });
    };

    if (!crmProjectsImport) return;
    download(crmProjectsImport.s3Key);
  }, [crmProjectsImport]);

  return (
    <MainLayout title="CRM Projects" sectionName="CRM Projects">
      <div className="space-y-6">
        {loadingImports && (
          <div className="text-muted-foreground text-sm font-semibold flex gap-2">
            Loading status of imported data…
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}

        <ApiLoadingError title="Loading imports failed" error={errorImports} />

        {!crmProjectsImport && (
          <div className="space-y-2">
            <Label className="font-semibold">Import data from CRM</Label>
            <Input type="file" onChange={uploadImportFile} />
          </div>
        )}

        {crmProjectsImport && (
          <div className="space-y-2">
            {loadingData < 100 ? (
              <Progress value={loadingData} className="w-80" />
            ) : (
              <div>Data loaded. File to be processed…</div>
            )}
          </div>
        )}

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

          <ApiLoadingError title="L oading CRM Projects failed" error={error} />

          {crmProjects?.map(({ id }) => (
            <CrmProjectDetails key={id} crmProjectId={id} />
          ))}
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default CrmProjectsPage;
