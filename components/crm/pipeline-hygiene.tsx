import { TCrmStages } from "@/api/useCrmProject";
import { CrmProject } from "@/api/useCrmProjects";
import { invertSign } from "@/helpers/functional";
import { differenceInCalendarDays, isFuture } from "date-fns";
import { filter, flow, get, isFinite, map, sortBy, split } from "lodash/fp";
import { FC } from "react";
import CrmProjectsPipelineHygieneCategory, {
  categoryPipeline,
} from "./pipeline-hygiene-category";

type FilterFunction = (crm: CrmProject) => boolean;

export type THygieneIssue = {
  value: string;
  label: string;
  description?: string;
  filterFn: FilterFunction;
};

const isNonCompliantStage = (crm: CrmProject, days: number) =>
  !(["Business Validation", "Committed"] as TCrmStages[]).includes(crm.stage) &&
  differenceInCalendarDays(crm.closeDate, new Date()) <= days;

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

const hygieneIssues: THygieneIssue[] = [
  {
    value: "productMissing",
    label: "Product missing",
    description: "ARR or TCV are $0",
    filterFn: (crm) => crm.arr === 0 && crm.tcv === 0,
  },
  {
    value: "closeDatePast",
    label: "Close date past",
    filterFn: (crm) => !isFuture(crm.closeDate),
  },
  {
    value: "nonCompliantStage",
    label: "Non-compliant stage",
    description:
      "When close date within 30 days stage must be BusVal/Committed",
    filterFn: (crm) => isNonCompliantStage(crm, 30),
  },
  {
    value: "almostNonCompliantStage",
    label: "Almost non-compliant stage",
    description:
      "When close date within 30 days stage must be BusVal/Committed",
    filterFn: (crm) => isNonCompliantStage(crm, 45),
  },
  {
    value: "stalledOps",
    label: "Stalled opps",
    description: "Stage hasn't been changed in the last 90 days",
    filterFn: (crm) =>
      !crm.stageChangedDate ||
      differenceInCalendarDays(new Date(), crm.stageChangedDate) >= 90,
  },
  {
    value: "nextStep",
    label: "Next step not compliant",
    description: "Next step should be updated at least once in 30 days",
    filterFn: (crm) =>
      !hasCompliantNextStepDateFormat(crm) || !hasCompliantNextStepDate(crm),
  },
  {
    value: "zombies",
    label: "Zombies",
    description: "Opportunities older than 1 year",
    filterFn: (crm) =>
      differenceInCalendarDays(new Date(), crm.createdDate) >= 365,
  },
] as const;

export const hasHygieneIssues = (crmProject: CrmProject) =>
  hygieneIssues.some((issue) => issue.filterFn(crmProject));

type CrmProjectsPipelineHygieneProps = {
  crmProjects: CrmProject[] | null;
};

const CrmProjectsPipelineHygiene: FC<CrmProjectsPipelineHygieneProps> = ({
  crmProjects,
}) =>
  flow(
    sortBy(flow(categoryPipeline(crmProjects ?? undefined), invertSign)),
    map((category) => (
      <CrmProjectsPipelineHygieneCategory
        key={category.value}
        hygieneCategory={category}
        crmProjects={crmProjects?.filter(category.filterFn)}
      />
    ))
  )(hygieneIssues);

export default CrmProjectsPipelineHygiene;
