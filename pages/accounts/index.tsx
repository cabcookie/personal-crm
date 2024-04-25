import { useAccountsContext } from "@/api/ContextAccounts";
import MainLayout from "@/components/layouts/MainLayout";
import AccountName from "@/components/ui-elements/tokens/account-name";
import { useRouter } from "next/router";

const AccountsListPage = () => {
  const { accounts, createAccount } = useAccountsContext();
  const router = useRouter();

  const createAndOpenNewAccount = async () => {
    const account = await createAccount("New Account");
    if (!account) return;
    router.push(`/accounts/${account.id}`);
  };

  return (
    <MainLayout
      title="Accounts"
      sectionName="Accounts"
      addButton={{ label: "New", onClick: createAndOpenNewAccount }}
    >
      {!accounts
        ? "Loading accounts..."
        : accounts.map((account) => (
            <div key={account.id}>
              <AccountName accountId={account.id} />
            </div>
          ))}
    </MainLayout>
  );
};

export default AccountsListPage;
