import { FC } from "react";
import {
  promptFieldFor,
  type PromptContext,
  type PromptField,
  type UserPrompts,
} from "@/api/useUser";
import AutoSaveTextarea from "./AutoSaveTextarea";

const CONTEXT_LABEL: Record<PromptContext, string> = {
  work: "Arbeit (Work)",
  family: "Familie (Family)",
  hobby: "Hobby",
};

const emptyPrompts: UserPrompts = {
  general: "",
  work: { activity: "", goals3Years: "", goals12Months: "" },
  family: { activity: "", goals3Years: "", goals12Months: "" },
  hobby: { activity: "", goals3Years: "", goals12Months: "" },
};

type Props = {
  value?: UserPrompts;
  /** Persist a single prompt field (on-blur auto-save). */
  onSaveField: (attribute: PromptField, value: string) => Promise<void> | void;
  /** Limit editing to a single context (meeting dialog); omit to show all. */
  onlyContext?: PromptContext;
  /** Hide the general field (e.g. shown separately). Default false. */
  hideGeneral?: boolean;
};

const ContextFields: FC<{
  ctx: PromptContext;
  value: UserPrompts[PromptContext];
  onSaveField: Props["onSaveField"];
}> = ({ ctx, value, onSaveField }) => (
  <div className="space-y-2">
    <h4 className="font-semibold text-sm">{CONTEXT_LABEL[ctx]}</h4>
    <AutoSaveTextarea
      label="Was tust du in diesem Kontext?"
      value={value.activity}
      placeholder="z. B. AWS Account Manager für Grocery-Kunden…"
      onSave={(v) => onSaveField(promptFieldFor(ctx, "activity"), v)}
    />
    <AutoSaveTextarea
      label="Langfristige Ziele (3 Jahre)"
      value={value.goals3Years}
      onSave={(v) => onSaveField(promptFieldFor(ctx, "goals3Years"), v)}
    />
    <AutoSaveTextarea
      label="Ziele (nächste 12 Monate)"
      value={value.goals12Months}
      onSave={(v) => onSaveField(promptFieldFor(ctx, "goals12Months"), v)}
    />
  </div>
);

const UserPromptEditor: FC<Props> = ({
  value,
  onSaveField,
  onlyContext,
  hideGeneral,
}) => {
  const prompts = value ?? emptyPrompts;
  const contexts: PromptContext[] = onlyContext
    ? [onlyContext]
    : ["work", "family", "hobby"];

  return (
    <div className="space-y-4">
      {!hideGeneral && (
        <AutoSaveTextarea
          label="Über dich"
          hint="Erkläre, wer du bist. Dieser Text gilt für alle Kontexte und gibt dem KI-Assistenten Hintergrund."
          rows={3}
          value={prompts.general}
          placeholder="z. B. Ich bin Account Manager bei AWS und arbeite mit Handelskunden in der DACH-Region…"
          onSave={(v) => onSaveField("promptGeneral", v)}
        />
      )}

      {contexts.map((ctx) => (
        <ContextFields
          key={ctx}
          ctx={ctx}
          value={prompts[ctx]}
          onSaveField={onSaveField}
        />
      ))}
    </div>
  );
};

export default UserPromptEditor;
