import { Territory, makeCurrentResponsibilityText } from "@/api/useTerritories";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import TerritoryDetails from "./TerritoryDetails";

type ShowInvalidOnly = {
  showCurrentOnly?: false;
  showInvalidOnly: true;
};

type ShowCurrentOnly = {
  showCurrentOnly: true;
  showInvalidOnly?: false;
};

type ShowCurrentOrInvalid = ShowInvalidOnly | ShowCurrentOnly;

type TerritoryListProps = ShowCurrentOrInvalid & {
  territories: Territory[];
  selectedAccordionItem?: string;
};

const filterCurrentOrInvalid =
  (
    showCurrentOnly: boolean | undefined,
    showInvalidOnly: boolean | undefined
  ) =>
  ({ latestQuota }: Territory) =>
    (latestQuota > 0 && showCurrentOnly) ||
    (latestQuota === 0 && showInvalidOnly);

const TerritoryList: FC<TerritoryListProps> = ({
  showCurrentOnly,
  showInvalidOnly,
  territories,
  selectedAccordionItem,
}) => {
  return territories.filter(
    filterCurrentOrInvalid(showCurrentOnly, showInvalidOnly)
  ).length === 0
    ? "No territories"
    : territories
        .filter(filterCurrentOrInvalid(showCurrentOnly, showInvalidOnly))
        .map((t) => (
          <DefaultAccordionItem
            key={t.id}
            value={t.id}
            link={`/territories/${t.id}`}
            triggerTitle={t.name || t.id}
            triggerSubTitle={[
              ...t.accounts.map((a) => a.name),
              makeCurrentResponsibilityText(t),
            ]}
            accordionSelectedValue={selectedAccordionItem}
          >
            <TerritoryDetails territoryId={t.id} />
          </DefaultAccordionItem>
        ));
};

export default TerritoryList;
