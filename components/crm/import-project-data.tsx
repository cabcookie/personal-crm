import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import useCrmProjectsImport, { DataChanged } from "@/api/useCrmProjectsImport";
import { diffCalDays } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { flow, map, sum } from "lodash/fp";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ApiLoadingError from "../layouts/ApiLoadingError";
import { Accordion } from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import ChangedCrmProjects from "./changed-projects";
import MissingCrmProjects from "./missing-projects";
import NewCrmProjects from "./new-projects";

const ImportProjectData = () => {
  const { crmProjects, mutate } = useCrmProjects();
  const {
    crmProjectsImport,
    isLoading: loadingImports,
    error: errorImports,
    uploadImportFile,
    downloadAndProcessImportData,
    closeImportFile,
  } = useCrmProjectsImport("WIP");
  const [progressBar, setProgressBar] = useState(0);
  const [processedData, setProcessedData] = useState<
    Omit<CrmProject, "id">[] | null
  >(null);
  const [changeSet, setChangeSet] = useState<DataChanged | null>(null);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    if (!changeSet) return setProjectsCount(0);
    const validKeys: (keyof DataChanged)[] = ["new", "missing", "changed"];
    flow(
      map(
        (key: keyof DataChanged) =>
          changeSet[key] as Omit<CrmProject, "id">[] | CrmProject[] | undefined
      ),
      map((p) => p?.length || 0),
      sum,
      setProjectsCount
    )(validKeys);
  }, [changeSet]);

  useEffect(() => {
    if (!crmProjectsImport) return;
    if (!crmProjects) return;
    if (processedData) return;
    downloadAndProcessImportData(
      crmProjectsImport.s3Key,
      setProcessedData,
      setProgressBar
    );
  }, [
    crmProjects,
    crmProjectsImport,
    downloadAndProcessImportData,
    processedData,
  ]);

  useEffect(() => {
    if (!processedData || !crmProjects) {
      setChangeSet(null);
      return;
    }
    setChangeSet({
      new: processedData.filter(
        (d) => !crmProjects.some((p) => p.crmId === d.crmId)
      ),
      missing: crmProjects.filter(
        (p) =>
          p.stage !== "Closed Lost" &&
          p.stage !== "Launched" &&
          !processedData.some((d) => d.crmId === p.crmId)
      ),
      changed: processedData.filter((d) =>
        crmProjects.some(
          (p) =>
            p.crmId === d.crmId &&
            (p.name !== d.name ||
              p.accountName !== d.accountName ||
              flow(diffCalDays(p.closeDate), Math.abs)(d.closeDate) > 3 ||
              flow(diffCalDays(p.createdDate), Math.abs)(d.createdDate) > 3 ||
              p.stage !== d.stage ||
              p.arr !== d.arr ||
              p.nextStep !== d.nextStep ||
              p.partnerName !== d.partnerName ||
              p.opportunityOwner !== d.opportunityOwner ||
              p.territoryName !== d.territoryName ||
              p.type !== d.type)
        )
      ),
    });
  }, [crmProjects, processedData]);

  return (
    <div className="space-y-6">
      <ApiLoadingError title="Loading imports failed" error={errorImports} />

      {!crmProjectsImport && (
        <div className="space-y-2">
          {loadingImports ? (
            <div className="text-muted-foreground text-sm font-semibold flex gap-2">
              Loading status of imported data…
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Label className="font-semibold">Import data from CRM</Label>
          )}
          <Input
            type="file"
            onChange={uploadImportFile}
            disabled={loadingImports}
          />
        </div>
      )}

      {crmProjectsImport && (
        <div className="space-y-2">
          <div
            className={cn(
              "space-y-2 block transition-all duration-1000 ease-in-out",
              progressBar === 100 && "hidden"
            )}
          >
            <div className="text-muted-foreground font-semibold transition-all duration-1000 ease-in-out">
              {progressBar < 100 ? "Processing data…" : "Done!"}
            </div>
            <Progress value={progressBar} className="w-80" />
          </div>
        </div>
      )}

      {crmProjectsImport && projectsCount > 0 && changeSet && (
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="font-bold text-lg">Imported Data</h2>
            <div className="text-sm text-muted-foreground font-semibold">
              {projectsCount} projects to process.
            </div>
          </div>
          <Accordion type="single" collapsible>
            <NewCrmProjects crmProjects={changeSet.new} />
            <MissingCrmProjects crmProjects={changeSet.missing} />
            <ChangedCrmProjects
              crmProjects={crmProjects}
              imported={changeSet.changed}
              confirmUpdate={(projects) => projects && mutate(projects, false)}
            />
          </Accordion>
        </div>
      )}

      {crmProjectsImport && (
        <Button onClick={closeImportFile}>Close import file</Button>
      )}
    </div>
  );
};

export default ImportProjectData;
