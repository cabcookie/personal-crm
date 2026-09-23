import type { UserPrompts, PromptContext } from "@/api/useUser";

/** The goal/first section of a project summary: everything up to the first
 * blank line (\n\n). The summaries are five \n\n-separated paragraphs; the
 * first is the "**Our goal**: …" paragraph. */
export const firstSection = (summary: string | null | undefined): string => {
  if (!summary) return "";
  const idx = summary.indexOf("\n\n");
  return (idx === -1 ? summary : summary.slice(0, idx)).trim();
};

export type SonicProject = {
  id: string;
  name: string;
  company: string | null;
  partner: string | null;
  summary: string | null;
};

export type SonicParticipant = {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
};

const projectLine = (p: SonicProject, section: string): string => {
  const meta = [p.company, p.partner ? `Partner: ${p.partner}` : null]
    .filter(Boolean)
    .join(", ");
  const head = meta ? `${p.name} (${meta})` : p.name;
  return section ? `- ${head} [${p.id}]\n  ${section}` : `- ${head} [${p.id}]`;
};

/** Startup project list for Sonic: name, company, partner, first summary
 * section. Newest-first ordering is the caller's responsibility. */
export const buildProjectListContext = (projects: SonicProject[]): string => {
  if (!projects.length) return "";
  const lines = projects.map((p) => projectLine(p, firstSection(p.summary)));
  return `Offene Projekte im aktuellen Kontext (Name, Firma, Partner, Ziel; ID in eckigen Klammern):\n${lines.join(
    "\n"
  )}`;
};

/** Cross-modal message when a participant is added (or at startup). */
export const buildParticipantContext = (p: SonicParticipant): string => {
  const meta = [p.company, p.role].filter(Boolean).join(", ");
  return meta
    ? `Teilnehmer hinzugefügt: ${p.name} (${meta}) [${p.id}]`
    : `Teilnehmer hinzugefügt: ${p.name} [${p.id}]`;
};

/** Cross-modal message when a project is added to the meeting: the REST of the
 * summary (everything after the first section). */
export const buildProjectAddedContext = (p: SonicProject): string => {
  const rest = (() => {
    if (!p.summary) return "";
    const idx = p.summary.indexOf("\n\n");
    return idx === -1 ? "" : p.summary.slice(idx + 2).trim();
  })();
  const meta = [p.company, p.partner ? `Partner: ${p.partner}` : null]
    .filter(Boolean)
    .join(", ");
  const head = meta ? `${p.name} (${meta})` : p.name;
  return rest
    ? `Projekt zum Meeting hinzugefügt: ${head} [${p.id}]. Weitere Details der Projektzusammenfassung:\n${rest}`
    : `Projekt zum Meeting hinzugefügt: ${head} [${p.id}].`;
};

/**
 * Build the background text fed into the Nova Sonic system prompt: the user's
 * cross-context "who am I" plus the prompt for the meeting's current context
 * (activity + 3-year and 12-month goals). Empty pieces are omitted so we never
 * ship blank headings. Returns "" when nothing is filled in.
 */
export const buildSonicContextPrompt = (
  prompts: UserPrompts | undefined,
  context: PromptContext | undefined
): string => {
  if (!prompts) return "";
  const parts: string[] = [];

  if (prompts.general.trim()) {
    parts.push(`Über den Nutzer: ${prompts.general.trim()}`);
  }

  const ctx = context ? prompts[context] : undefined;
  if (ctx) {
    const ctxLabel =
      context === "work"
        ? "Arbeit"
        : context === "family"
          ? "Familie"
          : "Hobby";
    const lines: string[] = [];
    if (ctx.activity.trim()) lines.push(`Tätigkeit: ${ctx.activity.trim()}`);
    if (ctx.goals3Years.trim())
      lines.push(`Ziele (3 Jahre): ${ctx.goals3Years.trim()}`);
    if (ctx.goals12Months.trim())
      lines.push(`Ziele (12 Monate): ${ctx.goals12Months.trim()}`);
    if (lines.length) {
      parts.push(`Kontext „${ctxLabel}“:\n${lines.join("\n")}`);
    }
  }

  return parts.join("\n\n");
};
