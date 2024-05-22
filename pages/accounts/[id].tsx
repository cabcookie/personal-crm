import { Account, useAccountsContext } from "@/api/ContextAccounts";
import MainLayout from "@/components/layouts/MainLayout";
import { debouncedUpdateAccountDetails } from "@/components/ui-elements/account-details/account-updates-helpers";
import NotesWriter, {
  SerializerOutput,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import SavedState from "@/components/ui-elements/project-notes-form/saved-state";
import RecordDetails from "@/components/ui-elements/record-details/record-details";
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
  const [accountDetailsSaved, setAccountDetailsSaved] = useState(true);

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
    setAccountDetailsSaved(false);
    debouncedUpdateAccountDetails({
      id: account.id,
      name: newName,
      updateAccountFn: updateAccount,
    });
  };

  const handleUpdateIntroduction = (serializer: () => SerializerOutput) => {
    if (!account) return;
    debouncedUpdateAccountDetails({
      id: account.id,
      serializeIntroduction: serializer,
      updateAccountFn: updateAccount,
    });
  };
  return (
    <MainLayout
      title={account?.name}
      recordName={account?.name}
      sectionName="Accounts"
      onBackBtnClick={handleBackBtnClick}
      onTitleChange={() => setAccountDetailsSaved(false)}
      saveTitle={handleUpdateName}
    >
      {!account ? (
        "Loading account..."
      ) : (
        <div>
          <SavedState saved={accountDetailsSaved} />
          {JSON.stringify(account)}
          <RecordDetails title="Introduction">
            <NotesWriter
              notes={account.introduction}
              placeholder="Describe the account..."
              saveNotes={handleUpdateIntroduction}
            />
          </RecordDetails>
        </div>
      )}
    </MainLayout>
  );
};

export default AccountDetailPage;
