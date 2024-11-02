import usePayer from "@/api/usePayer";
import PayerAccountLinks from "@/components/accounts/payer-account-links";
import MainLayout from "@/components/layouts/MainLayout";
import PayerDetails from "@/components/payers/details";
import ResellerBadge from "@/components/payers/reseller-badge";
import { useRouter } from "next/router";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const payerId = Array.isArray(id) ? id[0] : id;
  const { payer } = usePayer(payerId);

  return (
    <MainLayout
      title={payerId}
      recordName={payerId}
      sectionName="AWS Payer Accounts"
    >
      <div className="flex flex-col items-start md:items-center mb-2 md:mb-4">
        <PayerAccountLinks payer={payerId} />
      </div>

      <ResellerBadge
        className="items-start md:items-center mb-4 md:mb-6"
        resellerId={payer?.resellerId}
      />

      <PayerDetails payerId={payerId} showLinkedAccounts />
    </MainLayout>
  );
};
export default ProjectDetailPage;
