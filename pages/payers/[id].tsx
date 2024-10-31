import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const payerId = Array.isArray(id) ? id[0] : id;

  return (
    <MainLayout
      title={payerId}
      recordName={payerId}
      sectionName="AWS Payer Accounts"
    >
      WORK IN PROGRESS
    </MainLayout>
  );
};
export default ProjectDetailPage;
