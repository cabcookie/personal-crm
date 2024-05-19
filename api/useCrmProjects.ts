import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { flow } from "lodash/fp";
import {
  addDaysToDate,
  getDayOfDate,
  toISODateString,
} from "@/helpers/functional";
const client = generateClient<Schema>();

export type CrmStage =
  | "Prospect"
  | "Qualified"
  | "Technical Validation"
  | "Business Validation"
  | "Committed"
  | "Closed Lost"
  | "Launched";

export const crmStages = [
  "Prospect",
  "Qualified",
  "Technical Validation",
  "Business Validation",
  "Committed",
  "Closed Lost",
  "Launched",
];

export type CrmProject = {
  id: string;
  name: string;
  crmId?: string;
  arr: number;
  tcv: number;
  closeDate: Date;
  projectIds: string[];
  stage: string;
};

export const selectionSetCrmProject = [
  "id",
  "name",
  "crmId",
  "annualRecurringRevenue",
  "totalContractVolume",
  "closeDate",
  "projects.project.id",
  "stage",
] as const;

export const mapCrmProject: (data: CrmProjectData) => CrmProject = ({
  id,
  name,
  crmId,
  annualRecurringRevenue,
  totalContractVolume,
  closeDate,
  projects,
  stage,
}) => ({
  id,
  name,
  crmId: crmId || undefined,
  arr: annualRecurringRevenue || 0,
  tcv: totalContractVolume || 0,
  closeDate: new Date(closeDate),
  projectIds: projects.map(({ project: { id } }) => id),
  stage,
});

type CrmProjectData = SelectionSet<
  Schema["CrmProject"]["type"],
  typeof selectionSetCrmProject
>;

type FetchCrmProjectsWithTokenFn = (
  token?: string
) => Promise<CrmProjectData[] | undefined>;

const fetchCrmProjectsWithToken: FetchCrmProjectsWithTokenFn = async (
  token
) => {
  const closed = {
    or: [{ stage: { eq: "Launched" } }, { stage: { eq: "Closed Lost" } }],
  };

  const { data, errors, nextToken } = await client.models.CrmProject.list({
    filter: {
      or: [
        { not: closed },
        {
          and: [
            closed,
            {
              closeDate: {
                ge: flow(
                  addDaysToDate(-14),
                  toISODateString,
                  getDayOfDate
                )(new Date()),
              },
            },
          ],
        },
      ],
    },
    selectionSet: selectionSetCrmProject,
    nextToken: token,
    limit: 1000,
  });
  if (errors) throw errors;
  if (!nextToken) return data;
  return [...data, ...((await fetchCrmProjectsWithToken(nextToken)) || [])];
};

const fetchCrmProjects = async () => {
  return (await fetchCrmProjectsWithToken())
    ?.map(mapCrmProject)
    .sort((a, b) => a.closeDate.getTime() - b.closeDate.getTime());
};

const useCrmProjects = () => {
  const {
    data: crmProjects,
    error: errorCrmProjects,
    isLoading: loadingCrmProjects,
    mutate,
  } = useSWR("/api/crm-projects/", fetchCrmProjects);

  return { crmProjects, errorCrmProjects, loadingCrmProjects };
};

export default useCrmProjects;
