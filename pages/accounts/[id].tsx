import { Account, useAccountsContext } from "@/api/ContextAccounts";
import MainLayout from "@/components/layouts/MainLayout";
import { debouncedUpdateAccountDetails } from "@/components/ui-elements/account-details/account-updates-helpers";
import SavedState from "@/components/ui-elements/project-notes-form/saved-state";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AccountDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const accountId = Array.isArray(id) ? id[0] : id;
  const { getAccountById, saveAccountName } = useAccountsContext();
  const [account, setAccount] = useState<Account | undefined>(
    accountId ? getAccountById(accountId) : undefined
  );
  const [accountDetailsSaved, setAccountDetailsSaved] = useState(true);

  useEffect(() => {
    if (accountId) {
      setAccount(getAccountById(accountId));
    }
  }, [accountId, getAccountById]);

  const handleBackBtnClick = () => {
    router.push("/accounts");
  };

  const updateAccountName = (newName: string) => {
    if (!account) return;
    if (newName.trim() === account.name.trim()) return;
    setAccountDetailsSaved(false);
    debouncedUpdateAccountDetails({
      id: account.id,
      name: newName,
      setSaveStatus: setAccountDetailsSaved,
      updateAccountFn: ({ id, name }) => saveAccountName(id, name || ""),
    });
  };

  return (
    <MainLayout
      title={account?.name}
      recordName={account?.name}
      sectionName="Accounts"
      onBackBtnClick={handleBackBtnClick}
      onTitleChange={() => setAccountDetailsSaved(false)}
      saveTitle={updateAccountName}
    >
      {!account ? (
        "Loading account..."
      ) : (
        <div>
          <SavedState saved={accountDetailsSaved} />
          test
        </div>
      )}
    </MainLayout>
  );
};

export default AccountDetailPage;
