import { TCrmStages } from "@/api/useCrmProject";
import { CrmProject } from "@/api/useCrmProjects";
import useCurrentUser, { User } from "@/api/useUser";
import { invertSign } from "@/helpers/functional";
import { differenceInCalendarDays, isFuture } from "date-fns";
import { filter, flow, get, isFinite, map, sortBy, split } from "lodash/fp";
import { FC } from "react";
import CrmProjectsPipelineHygieneCategory, {
  categoryPipeline,
} from "./pipeline-hygiene-category";

type FilterFunction = (user: User | undefined) => (crm: CrmProject) => boolean;

export type THygieneIssue = {
  value: string;
  label: string;
  description?: string;
  filterFn: FilterFunction;
};

const isNonCompliantStage = (crm: CrmProject, fromDay: number, toDay: number) =>
  !(["Business Validation", "Committed"] as TCrmStages[]).includes(crm.stage) &&
  differenceInCalendarDays(crm.closeDate, new Date()) >= fromDay &&
  differenceInCalendarDays(crm.closeDate, new Date()) <= toDay;

const checkRange = (check: number, min: number, max: number) =>
  check >= min && check <= max;

const checkRanges = (n: number[]) =>
  n.length === 3 &&
  checkRange(n[0], 1, 12) &&
  checkRange(n[1], 1, 31) &&
  checkRange(n[2], new Date().getFullYear() - 1, new Date().getFullYear() + 1);

const getNextStepDateElements = (crm: CrmProject) =>
  flow(
    get("nextStep"),
    split(":"),
    get(0),
    split("/"),
    map(parseInt),
    filter(isFinite)
  )(crm);

const getDate = (dateElements: number[]) =>
  new Date(dateElements[2], dateElements[0] - 1, dateElements[1]);

const hasCompliantNextStepDateFormat = (crm: CrmProject) =>
  flow(getNextStepDateElements, checkRanges)(crm);

const notTooOld = (days: number) => (date: Date) =>
  differenceInCalendarDays(new Date(), date) <= days;

const hasCompliantNextStepDate = (crm: CrmProject) =>
  flow(getNextStepDateElements, getDate, notTooOld(30))(crm);

const isOpen = (crm: CrmProject) =>
  !(["Closed Lost", "Launched"] as TCrmStages[]).includes(crm.stage);

const isNotProspectStage = (crm: CrmProject) => crm.stage !== "Prospect";

export const hygieneIssues: THygieneIssue[] = [
  {
    value: "noProjectLinked",
    label: "No project linked",
    description: "CRM project has no linked project",
    filterFn: () => (crm) =>
      isOpen(crm) && (!crm.projectIds || crm.projectIds.length === 0),
  },
  {
    value: "wrongOwner",
    label: "Other owner",
    description: "Current user is not the owner of the opportunity",
    filterFn: (user) => (crm) =>
      isOpen(crm) && !!user && crm.opportunityOwner !== user.userName,
  },
  {
    value: "wrongAccount",
    label: "Different account",
    description: "Project has different account as the CRM project",
    filterFn: () => (crm) =>
      isOpen(crm) &&
      (!crm.accountName || !crm.projectAccountNames?.includes(crm.accountName)),
  },
  {
    value: "wrongPartner",
    label: "Different partner",
    description: "Project has different partner selected as the CRM project",
    filterFn: () => (crm) =>
      isOpen(crm) &&
      !!crm.partnerName &&
      !crm.linkedPartnerNames?.includes(crm.partnerName),
  },
  {
    value: "productMissing",
    label: "Product missing",
    description: "ARR or TCV are $0",
    filterFn: () => (crm) =>
      isOpen(crm) && isNotProspectStage(crm) && crm.arr === 0 && crm.tcv === 0,
  },
  {
    value: "closeDatePast",
    label: "Close date past",
    description: "Close date is in the past",
    filterFn: () => (crm) => isOpen(crm) && !isFuture(crm.closeDate),
  },
  {
    value: "nonCompliantStage",
    label: "Non-compliant stage",
    description:
      "When close date within 30 days stage must be BusVal/Committed",
    filterFn: () => (crm) => isOpen(crm) && isNonCompliantStage(crm, 0, 30),
  },
  {
    value: "almostNonCompliantStage",
    label: "Almost non-compliant stage",
    description:
      "When close date within 45 days stage must be BusVal/Committed",
    filterFn: () => (crm) => isOpen(crm) && isNonCompliantStage(crm, 31, 45),
  },
  {
    value: "stalledOps",
    label: "Stalled opps",
    description: "Stage hasn't been changed in the last 90 days",
    filterFn: () => (crm) =>
      isOpen(crm) &&
      (!crm.stageChangedDate ||
        differenceInCalendarDays(new Date(), crm.stageChangedDate) >= 90),
  },
  {
    value: "nextStep",
    label: "Next step not compliant",
    description: "Next step should be updated at least once in 30 days",
    filterFn: () => (crm) =>
      isOpen(crm) &&
      (!hasCompliantNextStepDateFormat(crm) || !hasCompliantNextStepDate(crm)),
  },
  {
    value: "zombies",
    label: "Zombies",
    description: "Opportunities older than 1 year",
    filterFn: () => (crm) =>
      isOpen(crm) &&
      differenceInCalendarDays(new Date(), crm.createdDate) >= 365,
  },
] as const;

export const hasHygieneIssues =
  (user: User | undefined) => (crmProject: CrmProject) =>
    hygieneIssues.some((issue) => issue.filterFn(user)(crmProject));

type CrmProjectsPipelineHygieneProps = {
  crmProjects: CrmProject[] | null;
};

const CrmProjectsPipelineHygiene: FC<CrmProjectsPipelineHygieneProps> = ({
  crmProjects,
}) => {
  const { user } = useCurrentUser();

  return flow(
    sortBy(flow(categoryPipeline(user, crmProjects ?? undefined), invertSign)),
    map((category) => (
      <CrmProjectsPipelineHygieneCategory
        key={category.value}
        hygieneCategory={category}
        crmProjects={crmProjects?.filter(category.filterFn(user))}
      />
    ))
  )(hygieneIssues);
};

export default CrmProjectsPipelineHygiene;
