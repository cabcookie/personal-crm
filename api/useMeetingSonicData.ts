import { useCallback } from "react";
import { useProjectsContext } from "@/api/ContextProjects";
import { useAccountsContext } from "@/api/ContextAccounts";
import usePeople from "@/api/usePeople";
import type {
  SonicParticipant,
  SonicProject,
} from "@/helpers/sonic/context-prompt";

const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;

/**
 * Assembles the data Sonic needs for a meeting, from the existing client-side
 * stores:
 *  - openProjects: open projects of the meeting's context whose summary was
 *    (re)generated within the last 4 weeks (i.e. something happened), newest
 *    first, with name + company + partner + full summary.
 *  - resolveParticipant: person id -> { name, company, role } for participant
 *    context (company/role parsed from the person's accountNames string).
 */
const useMeetingSonicData = () => {
  const { projects } = useProjectsContext();
  const { getAccountNamesByIds, getAccountById } = useAccountsContext();
  const { getPersonById } = usePeople();

  // Built on demand (at recording start) so the 4-week cutoff uses the current
  // time — kept as a callback to avoid an impure Date.now() during render.
  const getOpenProjects = useCallback((): SonicProject[] => {
    if (!projects) return [];
    const cutoff = Date.now() - FOUR_WEEKS_MS;
    return projects
      .filter(
        (p) =>
          !p.done &&
          p.projectSummary &&
          p.projectSummaryUpdatedAt &&
          p.projectSummaryUpdatedAt.getTime() >= cutoff
      )
      .sort(
        (a, b) =>
          (b.projectSummaryUpdatedAt?.getTime() ?? 0) -
          (a.projectSummaryUpdatedAt?.getTime() ?? 0)
      )
      .map((p) => ({
        id: p.id,
        name: p.project,
        company: p.accountIds.length
          ? getAccountNamesByIds(p.accountIds) || null
          : null,
        partner: p.partnerId
          ? (getAccountById(p.partnerId)?.name ?? null)
          : null,
        summary: p.projectSummary ?? null,
      }));
  }, [projects, getAccountNamesByIds, getAccountById]);

  const resolveParticipant = useCallback(
    (personId: string): SonicParticipant | undefined => {
      // Reads from the people cache; getPersonById triggers an on-demand load
      // for anyone not yet cached (the meeting page also pre-warms participants
      // via ensurePeopleLoaded), so a participant resolves once loaded.
      const person = getPersonById(personId);
      if (!person) return undefined;
      // accountNames is "Company, Role" or "Company, Role, Company2, …".
      // Take the first company + role pair for context.
      const parts = (person.accountNames ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        id: person.id,
        name: person.name,
        company: parts[0] ?? null,
        role: parts[1] ?? null,
      };
    },
    [getPersonById]
  );

  return { getOpenProjects, resolveParticipant };
};

export default useMeetingSonicData;
