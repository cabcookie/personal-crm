import useMrr from "@/api/useMrr";
import PayerAccountIssues from "./payer-account-issues";

const UploadIssues = () => {
  const { mrr, mutate } = useMrr("WIP");

  return <PayerAccountIssues mrr={mrr} mutate={mutate} />;
};

export default UploadIssues;
