import { Mrr, MrrMutator } from "@/api/useMrr";
import useMrrImport from "@/api/useMrrImport";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";
import ApiLoadingError from "../../layouts/ApiLoadingError";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Progress } from "../../ui/progress";

type ImportMrrDataProps = {
  mrr: Mrr[] | undefined;
  mutateMrr: MrrMutator;
};

const ImportMrrData: FC<ImportMrrDataProps> = ({ mrr, mutateMrr }) => {
  const { mrrImport, isLoading, error, uploadAndProcessImportFile } =
    useMrrImport(mrr, mutateMrr);
  const [progressBar, setProgressBar] = useState(0);

  return (
    <div className="space-y-6">
      <ApiLoadingError title="Loading imports failed" error={error} />

      {!mrrImport && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-muted-foreground text-sm font-semibold flex gap-2">
              Loading status of imported data…
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Label className="font-semibold">Import sales revenues (MRR)</Label>
          )}
          <Input
            type="file"
            onChange={uploadAndProcessImportFile(setProgressBar)}
            disabled={isLoading}
          />
        </div>
      )}

      {mrrImport && (
        <div className="space-y-2">
          <div
            className={cn(
              "space-y-2 block transition-all duration-1000 ease-in-out",
              progressBar > 99 && "hidden"
            )}
          >
            <div className="text-muted-foreground font-semibold transition-all duration-1000 ease-in-out">
              {progressBar < 100 ? "Processing data…" : "Done!"}
            </div>
            <Progress value={progressBar} className="w-80" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportMrrData;
