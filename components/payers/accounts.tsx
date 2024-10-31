import { useAccountsContext } from "@/api/ContextAccounts";
import usePayer from "@/api/usePayer";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import AccountSelector from "../ui-elements/selectors/account-selector";
import { Accordion } from "../ui/accordion";
import PayerAccountAccordion from "./account-accordion";

type PayerAccountsProps = {
  payerId: string;
  showLinkedAccounts?: boolean;
};

const PayerAccounts: FC<PayerAccountsProps> = ({
  payerId,
  showLinkedAccounts,
}) => {
  const { getAccountNamesByIds } = useAccountsContext();
  const { payer, createPayerAccountLink, deletePayerAccount } =
    usePayer(payerId);

  return (
    <DefaultAccordionItem
      value="payer-accounts"
      triggerTitle="Linked Customers"
      triggerSubTitle={getAccountNamesByIds(payer?.accountIds ?? [])}
      isVisible={!!showLinkedAccounts}
    >
      <Accordion type="single" collapsible>
        <div className="mb-6">
          <AccountSelector
            value=""
            onChange={createPayerAccountLink}
            placeholder="Link account…"
          />
        </div>

        {payer?.accountIds.map((accountId) => (
          <PayerAccountAccordion
            key={accountId}
            accountId={accountId}
            removeLinkToPayer={deletePayerAccount}
          />
        ))}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default PayerAccounts;
