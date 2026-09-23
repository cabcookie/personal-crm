import { FC } from "react";
import { Check, X, FolderPlus } from "lucide-react";
import type { SuggestedProject } from "@/api/useSonicTranscription";
import type { SonicProject } from "@/helpers/sonic/context-prompt";
import { Button } from "../ui/button";

type Props = {
  suggestions: SuggestedProject[];
  projects: SonicProject[];
  onAccept: (projectId: string) => void;
  onDismiss: (projectId: string) => void;
};

/**
 * Projects Sonic suggested adding to the meeting. Shown at the meeting head
 * (below the detected people). Accepting adds the project to the meeting.
 */
const MeetingSuggestedProjectsBar: FC<Props> = ({
  suggestions,
  projects,
  onAccept,
  onDismiss,
}) => {
  return (
    <div className="rounded-md border border-dashed p-2 mx-2 md:mx-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground">
          Vorgeschlagene Projekte
        </span>
        {suggestions.map((s) => {
          const proj = projects.find((p) => p.id === s.projectId);
          const label = proj?.name ?? s.projectId;
          return (
            <div
              key={s.projectId}
              className="flex items-center gap-2 rounded-md border px-2 py-1 text-sm bg-background"
            >
              <FolderPlus className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{label}</span>
                {s.reason && (
                  <span className="text-xs text-muted-foreground">
                    {s.reason}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-1"
                onClick={() => onAccept(s.projectId)}
                aria-label="Projekt hinzufügen"
              >
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-1"
                onClick={() => onDismiss(s.projectId)}
                aria-label="Vorschlag verwerfen"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingSuggestedProjectsBar;
