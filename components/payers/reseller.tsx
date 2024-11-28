import { Account, useAccountsContext } from "@/api/ContextAccounts";
import usePayer from "@/api/usePayer";
import { setResellerByPayer } from "@/helpers/analytics/account-data";
import { FC, useEffect, useState } from "react";
import AccountDetails from "../accounts/AccountDetails";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import DeleteWarning from "../ui-elements/project-notes-form/DeleteWarning";

type PayerResellerProps = {
  payerId: string;
  showReseller?: boolean;
};

const PayerReseller: FC<PayerResellerProps> = ({ payerId, showReseller }) => {
  const { accounts } = useAccountsContext();
  const { payer, deleteReseller } = usePayer(payerId);
  const [reseller, setReseller] = useState<Account | undefined>();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    setResellerByPayer(payer, accounts, setReseller);
  }, [payer, accounts]);

  return (
    reseller && (
      <>
        <DeleteWarning
          open={showDeleteConfirmation}
          onOpenChange={setShowDeleteConfirmation}
          confirmText={`Are you sure you want to remove the reseller "${reseller.name}" from the Payer Account?`}
          onConfirm={deleteReseller}
        />

        <DefaultAccordionItem
          value="reseller"
          triggerTitle={`Reseller: ${reseller?.name}`}
          link={`/accounts/${reseller?.id}`}
          isVisible={!!showReseller}
          onDelete={() => setShowDeleteConfirmation(true)}
        >
          <AccountDetails account={reseller} showResellerFinancials />
        </DefaultAccordionItem>
      </>
    )
  );
};

export default PayerReseller;
