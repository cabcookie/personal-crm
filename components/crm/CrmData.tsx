import { ClipboardCopy } from "lucide-react";
import { FC } from "react";
import { toast } from "../ui/use-toast";
import CrmLink, { makeCrmLink } from "./CrmLink";
import LabelData from "./label-data";

type CrmDataProps = {
  crmId?: string;
  label?: string;
};

const copyNameAndLink = (id: string, label: string) => async () => {
  try {
    const url = makeCrmLink("Opportunity", id);
    const htmlContent = `<a href="${url}">${label}</a>`;
    const slackFormattedLink = `<${url}|${label}>`;
    const blobHTML = new Blob([htmlContent], { type: "text/html" });
    const blobPlainText = new Blob([slackFormattedLink], {
      type: "text/plain",
    });
    const clipboardItem = new ClipboardItem({
      "text/html": blobHTML,
      "text/plain": blobPlainText,
    });
    await navigator.clipboard.write([clipboardItem]);
    toast({ title: "CRM link copied to clipboard" });
  } catch (error) {
    toast({
      title: "Copying CRM link to clipboard failed",
      variant: "destructive",
      description: JSON.stringify(error),
    });
    console.error("Copying CRM link to clipboard failed", error);
  }
};

const CrmData: FC<CrmDataProps> = ({ crmId, label }) =>
  crmId && (
    <div className="flex flex-row gap-2 items-center">
      <LabelData label="SFDC ID" data={crmId} />
      <CrmLink id={crmId} category="Opportunity" />
      {label && (
        <ClipboardCopy
          className="w-4 h-4 text-muted-foreground hover:text-primary"
          onClick={copyNameAndLink(crmId, label)}
        />
      )}
    </div>
  );

export default CrmData;
