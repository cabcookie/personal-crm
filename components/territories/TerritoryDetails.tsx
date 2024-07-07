import { useAccountsContext } from "@/api/ContextAccounts";
import {
  makeCurrentResponsibilityText,
  useTerritory,
} from "@/api/useTerritories";
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
  updateFormControl?: {
    open: boolean;
    setOpen: (val: boolean) => void;
  };
};

const TerritoryDetails: FC<TerritoryDetailsProps> = ({
  territoryId,
  updateFormControl,
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
      <div className="ml-2">
        <TerritoryUpdateForm
          territory={territory}
          onUpdate={updateTerritory}
          formControl={updateFormControl}
        />
        {territory.crmId && (
          <CrmLink
            category="Territory__c"
            id={territory.crmId}
            className="font-semibold"
          />
        )}
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
          triggerSubTitle={territory.accounts.map((a) => a.name)}
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
