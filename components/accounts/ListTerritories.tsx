import useTerritories, { Territory } from "@/api/useTerritories";
import { FC } from "react";
import CrmLink from "../crm/CrmLink";

type RenderTerritoryProps = {
  territory?: Territory;
};
const RenderTerritory: FC<RenderTerritoryProps> = ({ territory }) =>
  territory && (
    <div className="flex flex-row gap-1 text-sm items-center">
      {territory.name}
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
      <div>
        Assigned territories:
        {territoryIds.map((id) => (
          <RenderTerritory
            key={id}
            territory={territories?.find((t) => t.id === id)}
          />
        ))}
      </div>
    )
  );
};

export default ListTerritories;
