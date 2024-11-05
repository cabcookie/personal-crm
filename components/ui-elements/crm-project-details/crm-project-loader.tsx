import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import LoadingAccordionItem from "../accordion/LoadingAccordionItem";

type CrmProjectLoaderProps = {
  crmProjectId: string;
  showProjects?: boolean;
};

const CrmProjectLoader: FC<CrmProjectLoaderProps> = ({
  showProjects,
  crmProjectId,
}) => (
  <>
    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
    <div className="space-y-2">
      <Skeleton className="w-44 h-5" />
      <Skeleton className="w-36 h-5" />
      <Skeleton className="w-20 h-5" />
      <Skeleton className="w-52 h-5" />
      <Skeleton className="w-72 h-5" />
      <div className="space-y-1">
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-10 h-5" />
      </div>
      <Skeleton className="w-64 h-5" />
      <Skeleton className="w-48 h-5" />
      <Skeleton className="w-64 h-5" />
      <Skeleton className="w-56 h-5" />
      {showProjects && (
        <Accordion type="single" collapsible>
          <LoadingAccordionItem
            value={`loading-crm-${crmProjectId}`}
            sizeTitle="lg"
            sizeSubtitle="base"
          />
        </Accordion>
      )}
    </div>
  </>
);

export default CrmProjectLoader;
