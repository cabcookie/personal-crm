import useTerritories, { Territory } from "@/api/useTerritories";
import { formatRevenue } from "@/helpers/functional";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import CrmLink from "../crm/CrmLink";

type RenderTerritoryProps = {
  territory?: Territory;
};
const RenderTerritory: FC<RenderTerritoryProps> = ({ territory }) =>
  territory && (
    <div className="flex flex-row gap-1 text-sm items-center text-muted-foreground">
      {territory.name}
      {territory.latestQuota === 0
        ? ""
        : ` (${formatRevenue(territory.latestQuota)})`}
      <Link href={`/territories/${territory.id}`}>
        <ExternalLinkIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
      </Link>
      {territory.crmId && (
        <CrmLink category="Territory__c" id={territory.crmId} />
      )}
    </div>
  );

type ListTerritoriesProps = {
  territoryIds: string[];
};

const ListTerritories: FC<ListTerritoriesProps> = ({ territoryIds }) => {
  const { territories } = useTerritories();

  return (
    territoryIds.length > 0 && (
      <>
        <div>Assigned territories:</div>
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
