import { FC } from "react";
import { Settings, Check, Mic } from "lucide-react";
import type { MicDevice } from "@/helpers/sonic/audio-capture";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  mics: MicDevice[];
  selectedMicId?: string;
  onSelect: (deviceId: string | undefined) => void;
  loadMics: () => void | Promise<void>;
  disabled?: boolean;
};

/** Settings gear next to the record button → choose the input microphone. */
const MeetingMicSettings: FC<Props> = ({
  mics,
  selectedMicId,
  onSelect,
  loadMics,
  disabled,
}) => {
  return (
    <Popover onOpenChange={(open) => open && loadMics()}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="px-2"
          disabled={disabled}
          aria-label="Mikrofon-Einstellungen"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-1">
        <p className="px-2 py-1 text-xs text-muted-foreground flex items-center gap-1">
          <Mic className="w-3 h-3" /> Mikrofon
        </p>
        <MicOption
          label="Standard (Systemauswahl)"
          active={!selectedMicId}
          onClick={() => onSelect(undefined)}
        />
        {mics.map((m) => (
          <MicOption
            key={m.deviceId}
            label={m.label}
            active={selectedMicId === m.deviceId}
            onClick={() => onSelect(m.deviceId)}
          />
        ))}
        {mics.length === 0 && (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Keine Geräte gefunden. Nach dem ersten Aufnahmestart erscheinen die
            Gerätenamen.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
};

const MicOption: FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
      active && "bg-accent/50"
    )}
  >
    <Check
      className={cn("w-4 h-4 shrink-0", active ? "opacity-100" : "opacity-0")}
    />
    <span className="truncate">{label}</span>
  </button>
);

export default MeetingMicSettings;
