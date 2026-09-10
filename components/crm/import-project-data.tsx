import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import useCrmProjectsImport, { DataChanged } from "@/api/useCrmProjectsImport";
import {
  changedProjects,
  missingProjects,
  newProjects,
} from "@/helpers/crm/filters";
import { cn } from "@/lib/utils";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useMemo, useState } from "react";
import ApiLoadingError from "../layouts/ApiLoadingError";
import { Accordion } from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import ChangedCrmProjects from "./changed-projects";
import MissingCrmProjects from "./missing-projects";
import NewCrmProjects from "./new-projects";

const linkSfdcReport =
  "https://aws-crm.lightning.force.com/lightning/r/Report/00ORU000000oksT2AQ/view";

type ImportProjectDataProps = {
  reloader?: () => void;
};

const ImportProjectData: FC<ImportProjectDataProps> = ({ reloader }) => {
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
  // Purely derived from the processed import, so computed during render.
  const changeSet: DataChanged | null = useMemo(
    () =>
      !processedData || !crmProjects
        ? null
        : {
            new: processedData.filter(newProjects(crmProjects)),
            missing: crmProjects.filter(missingProjects(processedData)),
            changed: processedData.filter(changedProjects(crmProjects)),
          },
    [crmProjects, processedData]
  );

  const projectsCount = useMemo(() => {
    if (!changeSet) return 0;
    const validKeys: (keyof DataChanged)[] = ["new", "missing", "changed"];
    return validKeys.reduce(
      (total, key) => total + (changeSet[key]?.length ?? 0),
      0
    );
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

  const handleClose = async () => {
    await closeImportFile();
    reloader?.();
  };

  return (
    <div className="space-y-6">
      <ApiLoadingError title="Loading imports failed" error={errorImports} />

      {!crmProjectsImport && (
        <div className="space-y-2">
          <div>
            <Link href={linkSfdcReport} target="_blank">
              <div className="flex flex-row items-baseline gap-1 text-muted-foreground font-semibold text-sm">
                Link to SFDC opportunity report
                <ExternalLink className="w-3 h-3" />
              </div>
            </Link>
          </div>
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
        <Button onClick={handleClose}>Close import file</Button>
      )}
    </div>
  );
};

export default ImportProjectData;
