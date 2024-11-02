import usePayer from "@/api/usePayer";
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
      <ResellerBadge
        className="items-start md:items-center mb-4 md:mb-6"
        resellerId={payer?.resellerId}
      />

      <PayerDetails payerId={payerId} showLinkedAccounts />
    </MainLayout>
  );
};
export default ProjectDetailPage;
