import { cn } from "@/lib/utils";
import { FC } from "react";
import AccordionItemBadge from "../accordion-item-badge/badge";

type HygieneIssueBadgeProps = {
  className?: string;
};

const HygieneIssueBadge: FC<HygieneIssueBadgeProps> = ({ className }) => (
  <AccordionItemBadge
    badgeLabel="Hygiene"
    className={cn("bg-orange-400", className)}
  />
);

export default HygieneIssueBadge;
