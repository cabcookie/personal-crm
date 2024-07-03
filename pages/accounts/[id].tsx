import { Account, useAccountsContext } from "@/api/ContextAccounts";
import AccountDetails from "@/components/accounts/AccountDetails";
import MainLayout from "@/components/layouts/MainLayout";
import { debouncedUpdateAccountDetails } from "@/components/ui-elements/account-details/account-updates-helpers";
import SavedState from "@/components/ui-elements/project-notes-form/saved-state";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AccountDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const accountId = Array.isArray(id) ? id[0] : id;
  const { getAccountById, updateAccount } = useAccountsContext();
  const [account, setAccount] = useState<Account | undefined>(
    accountId ? getAccountById(accountId) : undefined
  );
  const [accountNameSaved, setAccountNameSaved] = useState(true);

  useEffect(() => {
    if (accountId) {
      setAccount(getAccountById(accountId));
    }
  }, [accountId, getAccountById]);

  const handleBackBtnClick = () => {
    router.push("/accounts");
  };

  const handleUpdateName = (newName: string) => {
    if (!account) return;
    if (newName.trim() === account.name.trim()) return;
    setAccountNameSaved(false);
    debouncedUpdateAccountDetails({
      id: account.id,
      name: newName,
      updateAccountFn: updateAccount,
      updateSavedState: setAccountNameSaved,
    });
  };

  return (
    <MainLayout
      title={account?.name}
      recordName={account?.name}
      sectionName="Accounts"
      onBackBtnClick={handleBackBtnClick}
      onTitleChange={() => setAccountNameSaved(false)}
      saveTitle={handleUpdateName}
    >
      {!account ? (
        "Loading account..."
      ) : (
        <div className="px-2 md:px-4">
          <SavedState saved={accountNameSaved} />
          <AccountDetails
            account={account}
            showIntroduction
            showProjects
            showNotes
          />
        </div>
      )}
    </MainLayout>
  );
};

export default AccountDetailPage;
