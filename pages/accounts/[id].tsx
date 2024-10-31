import { Account, useAccountsContext } from "@/api/ContextAccounts";
import AccountDetails from "@/components/accounts/AccountDetails";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AccountDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const accountId = Array.isArray(id) ? id[0] : id;
  const { getAccountById } = useAccountsContext();
  const [account, setAccount] = useState<Account | undefined>(
    accountId ? getAccountById(accountId) : undefined
  );
  const [updateAccountFormOpen, setUpdateAccountFormOpen] = useState(false);

  useEffect(() => {
    if (accountId) {
      setAccount(getAccountById(accountId));
    }
  }, [accountId, getAccountById]);

  const handleBackBtnClick = () => {
    router.push("/accounts");
  };

  return (
    <MainLayout
      title={`${account?.name || "Loading…"}${
        !account?.controller ? "" : ` (Parent: ${account.controller.name})`
      }`}
      recordName={account?.name}
      sectionName="Accounts"
      onBackBtnClick={handleBackBtnClick}
      addButton={{
        label: "Edit",
        onClick: () => setUpdateAccountFormOpen(true),
      }}
    >
      {!account ? (
        "Loading account..."
      ) : (
        <AccountDetails
          account={account}
          showIntroduction
          showProjects
          showContacts
          showAwsAccounts
          showTerritories
          updateFormControl={{
            open: updateAccountFormOpen,
            setOpen: setUpdateAccountFormOpen,
          }}
        />
      )}
    </MainLayout>
  );
};

export default AccountDetailPage;
