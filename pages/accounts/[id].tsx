import { useAccountsContext } from "@/api/ContextAccounts";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import { FC } from "react";

type AccountDetailPageProps = {};
const AccountDetailPage: FC<AccountDetailPageProps> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const accountId = Array.isArray(id) ? id[0] : id;
  const { getAccountById, loadingAccounts } = useAccountsContext();

  return (
    accountId && (
      <MainLayout
        title={getAccountById(accountId)?.name}
        recordName={getAccountById(accountId)?.name}
        sectionName="Accounts"
      >
        {loadingAccounts && "Loading account..."}
        {JSON.stringify(getAccountById(accountId))}
      </MainLayout>
    )
  );
};
export default AccountDetailPage;
