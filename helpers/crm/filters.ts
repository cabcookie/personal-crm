import { CrmProject } from "@/api/useCrmProjects";
import { differenceInCalendarDays } from "date-fns";
import { flow } from "lodash/fp";
import { diffCalDays } from "../functional";

const isClosed = (stage: CrmProject["stage"]) =>
  ["Launched", "Closed Lost"].includes(stage);

const projectsExistsOrIsClosedAndOld =
  (imported: Omit<CrmProject, "id">) => (existing: CrmProject) =>
    existing.crmId === imported.crmId ||
    (isClosed(imported.stage) &&
      differenceInCalendarDays(new Date(), imported.closeDate) > 30);

export const newProjects =
  (existing: CrmProject[]) => (imported: Omit<CrmProject, "id">) =>
    !existing.some(projectsExistsOrIsClosedAndOld(imported));

export const missingProjects =
  (imported: Omit<CrmProject, "id">[]) => (existing: CrmProject) =>
    !isClosed(existing.stage) &&
    !imported.some((i) => i.crmId === existing.crmId);

export const changedProjects =
  (existing: CrmProject[]) => (imported: Omit<CrmProject, "id">) =>
    existing.some(
      (e) =>
        e.crmId === imported.crmId &&
        (e.name !== imported.name ||
          e.accountName !== imported.accountName ||
          flow(diffCalDays(e.closeDate), Math.abs)(imported.closeDate) > 3 ||
          flow(diffCalDays(e.createdDate), Math.abs)(imported.createdDate) >
            3 ||
          e.stage !== imported.stage ||
          e.arr !== imported.arr ||
          e.nextStep !== imported.nextStep ||
          e.partnerName !== imported.partnerName ||
          e.opportunityOwner !== imported.opportunityOwner ||
          e.territoryName !== imported.territoryName ||
          e.type !== imported.type)
    );
