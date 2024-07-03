import { type Schema } from "@/amplify/data/resource";
import {
  Responsibility,
  mapResponsibilities,
  sortResponsibility,
} from "@/components/responsibility-date-ranges/ResponsibilityDateRangeRecord";
import { toast } from "@/components/ui/use-toast";
import { formatRevenue, toISODateString } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { differenceInDays, format } from "date-fns";
import { filter, first, flow, get, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const selectionSet = [
  "id",
  "name",
  "crmId",
  "accounts.account.id",
  "accounts.account.crmId",
  "accounts.account.name",
  "responsibilities.id",
  "responsibilities.startDate",
  "responsibilities.quota",
] as const;

type TerritoryData = SelectionSet<
  Schema["Territory"]["type"],
  typeof selectionSet
>;
type TerritoryAccountData = TerritoryData["accounts"][number];

type TerritoryAccount = {
  id: string;
  name: string;
  crmId?: string;
};

export type Territory = {
  id: string;
  name?: string;
  crmId?: string;
  latestResponsibilityStarted: Date;
  latestQuota: number;
  responsibilities: Responsibility[];
  accounts: TerritoryAccount[];
};

const mapAccount = ({
  account: { id, crmId, name },
}: TerritoryAccountData): TerritoryAccount => ({
  id,
  crmId: crmId || undefined,
  name,
});

const isCurrentResponsibility = ({ startDate, endDate }: Responsibility) =>
  (!endDate || differenceInDays(endDate, new Date()) >= 0) &&
  differenceInDays(new Date(), startDate) >= 0;

export const makeCurrentResponsibilityText = (territory: Territory) =>
  territory.responsibilities
    .filter(isCurrentResponsibility)
    .map(
      ({ startDate, endDate, quota }): string =>
        `${
          !endDate
            ? `Since ${format(startDate, "PPP")}`
            : `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`
        }${!quota ? "" : ` (Quota: ${formatRevenue(quota)})`}`
    )
    .join(", ");

const mapTerritory: (territory: TerritoryData) => Territory = ({
  id,
  name,
  crmId,
  responsibilities,
  accounts,
}) => ({
  id,
  name: name || undefined,
  crmId: crmId || undefined,
  latestQuota:
    flow(
      mapResponsibilities(id, name || ""),
      filter(isCurrentResponsibility),
      first,
      get("quota")
    )(responsibilities) || 0,
  latestResponsibilityStarted:
    flow(
      mapResponsibilities(id, name || ""),
      filter(isCurrentResponsibility),
      first,
      get("startDate")
    )(responsibilities) || new Date(),
  responsibilities: mapResponsibilities(id, name || "")(responsibilities),
  accounts: accounts.map(mapAccount),
});

const fetchTerritories = async (): Promise<Territory[]> => {
  const { data, errors } = await client.models.Territory.list({
    limit: 500,
    selectionSet,
  });
  if (errors) throw errors;
  return flow(
    map(mapTerritory),
    sortBy((t) => -t.latestQuota)
  )(data);
};

const useTerritories = () => {
  const {
    data: territories,
    mutate,
    error,
  } = useSWR("/api/territories", fetchTerritories);

  const createTerritory = async (name: string): Promise<string | undefined> => {
    if (name.length < 3) return;

    const newTerritory: Territory = {
      id: crypto.randomUUID(),
      name: "New Territory",
      latestQuota: 0,
      responsibilities: [],
      latestResponsibilityStarted: new Date(),
      accounts: [],
    };

    const updated: Territory[] | undefined = [
      ...(territories || []),
      newTerritory,
    ];
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Territory.create({ name });
    if (errors) handleApiErrors(errors, "Error creating new Territory");
    if (updated) mutate(updated);
    return data?.id;
  };

  return { territories, createTerritory, error };
};

const fetchTerritory = (id: string | undefined) => async () => {
  if (!id) return;
  const { data, errors } = await client.models.Territory.get(
    { id },
    {
      selectionSet,
    }
  );
  if (errors) throw errors;
  if (!data) return;
  return mapTerritory(data);
};

const useTerritory = (id: string | undefined) => {
  const { data: territory, mutate } = useSWR(
    `/api/territories/${id}`,
    fetchTerritory(id)
  );

  const addResponsibility = async (startDate: Date, endDate?: Date) => {
    if (!territory) return;
    const updated: Territory = {
      ...territory,
      responsibilities: sortBy(sortResponsibility)([
        ...territory.responsibilities,
        { id: crypto.randomUUID(), startDate, endDate },
      ]),
    };
    mutate(updated, false);
    const { data, errors } = await client.models.TerritoryResponsibility.create(
      {
        territoryId: territory.id,
        startDate: toISODateString(startDate),
      }
    );
    if (errors) handleApiErrors(errors, "Error creating new responsibility");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Responsibility created",
      description: `Responsbility created for territory “${
        territory.name || territory.id
      }” from ${[startDate, ...(endDate ? [endDate] : [])]
        .map((d) => format(d, "PPP"))
        .join(" to ")}.`,
    });
    return data.id;
  };

  const updateResponsibility = async (
    responsibilityId: string,
    startDate: Date,
    endDate?: Date
  ) => {
    const updated: Territory | undefined = !territory
      ? undefined
      : {
          ...territory,
          responsibilities: flow(
            map((r: Responsibility) =>
              r.id !== responsibilityId ? r : { ...r, startDate, endDate }
            ),
            sortBy(sortResponsibility)
          )(territory.responsibilities),
        };
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.TerritoryResponsibility.update(
      {
        id: responsibilityId,
        startDate: toISODateString(startDate),
      }
    );
    if (errors) handleApiErrors(errors, "Error updating responsibility");
    if (updated) mutate(updated);
    if (!data) return;
    toast({
      title: "Responsibility created",
      description: `Responsbility created for territory “${
        territory?.name || territory?.id
      }” from ${[startDate, ...(endDate ? [endDate] : [])]
        .map((d) => format(d, "PPP"))
        .join(" to ")}.`,
    });
    return data.id;
  };

  const deleteResponsibility = async (responsibilityId: string) => {
    const updated: Territory | undefined = !territory
      ? undefined
      : {
          ...territory,
          responsibilities: territory.responsibilities.filter(
            (r) => r.id !== responsibilityId
          ),
        };
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.TerritoryResponsibility.delete(
      {
        id: responsibilityId,
      }
    );
    if (errors) handleApiErrors(errors, "Deleting responsibility failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({
      title: "Responsibility deleted",
      description: `Responsibility deleted (since ${format(
        data.startDate,
        "PPP"
      )}.`,
    });
    return data.id;
  };

  const updateTerritoryName = async (name: string | undefined) => {
    if (!id) return;
    if (!name || name.length < 3) return;
    if (territory) mutate({ ...territory, name }, false);
    const { data, errors } = await client.models.Territory.update({
      id,
      name: name || "",
    });
    if (errors) handleApiErrors(errors, "Error updating Territory name");
    if (territory) mutate({ ...territory, name });
    return data?.id;
  };

  interface UpdateTerritoryProps {
    name: string;
    quota: number;
    responsibleSince: Date;
    crmId: string;
  }

  const updateTerritoryResponsibility = async (
    responsibilityId: string,
    startDate: Date,
    quota: number | undefined
  ) => {
    console.log("updateTerritoryResponsibility", {
      responsibilityId,
      startDate,
      quota,
    });
    const { data, errors } = await client.models.TerritoryResponsibility.update(
      { id: responsibilityId, startDate: toISODateString(startDate), quota }
    );
    if (errors) handleApiErrors(errors, "Updating responsibility failed");
    console.log("updateTerritoryResponsibility", { data, errors });
    return data?.id;
  };

  const addTerritoryResponsibility = async (startDate: Date, quota: number) => {
    if (!territory) return;
    const { data, errors } = await client.models.TerritoryResponsibility.create(
      {
        territoryId: territory.id,
        startDate: toISODateString(startDate),
        quota,
      }
    );
    if (errors) handleApiErrors(errors, "Creating new responsibility failed");
    return data?.id;
  };

  const updateTerritory = async ({
    name,
    quota,
    responsibleSince,
    crmId,
  }: UpdateTerritoryProps) => {
    if (!territory) return;
    const updated: Territory = {
      ...territory,
      name,
      crmId,
      latestQuota: quota,
      latestResponsibilityStarted: responsibleSince,
    };
    mutate(updated, false);
    const { data, errors } = await client.models.Territory.update({
      id: territory.id,
      crmId,
      name,
    });
    if (errors) handleApiErrors(errors, "Update of territory failed");
    mutate(updated);
    if (!data) return;

    if (territory.responsibilities.length === 0 || quota === 0) {
      await addTerritoryResponsibility(responsibleSince, quota);
      mutate(updated);
    }

    if (territory.responsibilities.length > 0 && quota > 0) {
      await updateTerritoryResponsibility(
        territory.responsibilities[0].id,
        responsibleSince,
        quota
      );
      mutate(updated);
    }
    return data.id;
  };

  return {
    territory,
    updateTerritoryName,
    updateTerritory,
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
  };
};

export default useTerritories;
export { useTerritory };
