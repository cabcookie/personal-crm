import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

type CrmLinkProps = {
  category: string;
  id: string;
  className?: string;
};

export const makeCrmLink = (category: string, id: string) =>
  `https://aws-crm.lightning.force.com/lightning/r/${category}/${id}/view`;

const CrmLink: FC<CrmLinkProps> = ({ category, id, className }) =>
  id.length < 20 && (
    <small className="ml-2">
      <Link
        href={makeCrmLink(category, id)}
        target="_blank"
        className={cn(
          "text-[--context-color] hover:text-accent-foreground hover:underline",
          className
        )}
      >
        Visit CRM
      </Link>
    </small>
  );

export default CrmLink;
