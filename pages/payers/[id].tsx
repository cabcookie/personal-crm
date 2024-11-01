import usePayer from "@/api/usePayer";
import MainLayout from "@/components/layouts/MainLayout";
import PayerDetails from "@/components/payers/details";
import { Badge } from "@/components/ui/badge";
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
      {payer?.isReseller && (
        <div className="flex justify-start md:justify-center mb-4 md:mb-6">
          <Badge className="bg-green-500">Reseller</Badge>
        </div>
      )}

      <PayerDetails payerId={payerId} showLinkedAccounts />
    </MainLayout>
  );
};
export default ProjectDetailPage;
