import { cn } from "@/lib/utils";
import { FC } from "react";
import AccordionItemBadge from "../accordion-item-badge/badge";

type ResellerBadgeProps = {
  className?: string;
};

const ResellerBadge: FC<ResellerBadgeProps> = ({ className }) => (
  <AccordionItemBadge
    badgeLabel="Reseller"
    className={cn("bg-green-500", className)}
  />
);

export default ResellerBadge;
