import { Account, useAccountsContext } from "@/api/ContextAccounts";
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

  useEffect(() => {
    if (accountId) {
      setAccount(getAccountById(accountId));
    }
  }, [accountId, getAccountById]);

  return (
    <MainLayout
      title={account?.name}
      recordName={account?.name}
      sectionName="Accounts"
    >
      {!account ? "Loading account..." : JSON.stringify(account)}
    </MainLayout>
  );
};

export default AccountDetailPage;
