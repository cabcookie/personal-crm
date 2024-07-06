import useTerritories, { Territory } from "@/api/useTerritories";
import { formatRevenue } from "@/helpers/functional";
import { format } from "date-fns";
import Link from "next/link";
import { FC } from "react";
import CrmLink from "../crm/CrmLink";

type RenderTerritoryProps = {
  territory?: Territory;
};
const RenderTerritory: FC<RenderTerritoryProps> = ({ territory }) =>
  territory && (
    <div className="flex flex-row gap-1 text-sm items-center text-muted-foreground">
      <Link
        href={`/territories/${territory.id}`}
        className="hover:text-primary hover:underline"
      >
        {territory.name}
        {territory.latestQuota === 0
          ? ""
          : ` (${formatRevenue(territory.latestQuota)}, since: ${format(
              territory.latestResponsibilityStarted,
              "PPP"
            )})`}
      </Link>
      {territory.crmId && (
        <CrmLink category="Territory__c" id={territory.crmId} />
      )}
    </div>
  );

type ListTerritoriesProps = {
  territoryIds: string[];
  showLabel?: boolean;
};

const ListTerritories: FC<ListTerritoriesProps> = ({
  territoryIds,
  showLabel,
}) => {
  const { territories } = useTerritories();

  return (
    territoryIds.length > 0 && (
      <>
        {showLabel && <div>Assigned territories:</div>}
        {territoryIds.map((id) => (
          <RenderTerritory
            key={id}
            territory={territories?.find((t) => t.id === id)}
          />
        ))}
      </>
    )
  );
};

export default ListTerritories;
