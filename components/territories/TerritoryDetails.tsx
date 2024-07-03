import { useAccountsContext } from "@/api/ContextAccounts";
import {
  makeCurrentResponsibilityText,
  useTerritory,
} from "@/api/useTerritories";
import { formatRevenue } from "@/helpers/functional";
import { format } from "date-fns";
import { FC, useState } from "react";
import AccountsList from "../accounts/AccountsList";
import CrmLink from "../crm/CrmLink";
import ResponsibilityDateRangeList from "../responsibility-date-ranges/ResponsibilityDateRangeList";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import TerritoryUpdateForm from "./TerritoryUpdateForm";

type TerritoryDetailsProps = {
  territoryId: string;
  showResponsibilities?: boolean;
};

const TerritoryDetails: FC<TerritoryDetailsProps> = ({
  territoryId,
  showResponsibilities = true,
}) => {
  const { territory, deleteResponsibility, updateTerritory } =
    useTerritory(territoryId);
  const { accounts } = useAccountsContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return !territory ? (
    "Loading territory…"
  ) : (
    <>
      <TerritoryUpdateForm
        territory={territory}
        onUpdate={({ crmId, name, quota, responsibleSince }) =>
          updateTerritory({ name, crmId, responsibleSince, quota })
        }
      />
      <div>
        Name: {territory.name}{" "}
        {territory.crmId && (
          <CrmLink category="Territory__c" id={territory.crmId} />
        )}
      </div>
      {territory.latestQuota > 0 && (
        <div>Quota: {formatRevenue(territory.latestQuota)}</div>
      )}
      <div>
        Responsible since:{" "}
        {format(territory.latestResponsibilityStarted, "PPP")}
      </div>

      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        <DefaultAccordionItem
          value="accounts"
          triggerTitle="Accounts"
          triggerSubTitle={territory.accounts.map((a) => a.name).join(", ")}
          accordionSelectedValue={accordionValue}
        >
          {accounts && (
            <AccountsList
              accounts={accounts.filter(({ id }) =>
                territory.accounts.some((a) => a.id === id)
              )}
              showProjects
              showContacts
              showIntroduction
            />
          )}
        </DefaultAccordionItem>
        <DefaultAccordionItem
          value="responsibilities"
          triggerTitle="Responsibilities"
          triggerSubTitle={makeCurrentResponsibilityText(territory)}
          isVisible={!!showResponsibilities}
          accordionSelectedValue={accordionValue}
        >
          <ResponsibilityDateRangeList
            responsibilities={territory.responsibilities}
            deleteResponsibility={deleteResponsibility}
          />
          <div className="mt-4" />
        </DefaultAccordionItem>
      </Accordion>
    </>
  );
};

export default TerritoryDetails;
