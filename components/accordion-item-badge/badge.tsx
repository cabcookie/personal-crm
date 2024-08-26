import { cn } from "@/lib/utils";
import { Circle, LucideProps } from "lucide-react";
import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import { IconType } from "react-icons/lib";
import { Badge } from "../ui/badge";

type AccordionItemBadgeProps = {
  Icon?:
    | ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >
    | IconType;
  className: string;
  badgeLabel: string;
};

const AccordionItemBadge: FC<AccordionItemBadgeProps> = ({
  badgeLabel,
  className,
  Icon = Circle,
}) => (
  <>
    <Icon
      className={cn(
        "mt-[0.2rem] w-4 min-w-4 h-4 md:hidden rounded-full text-primary-foreground",
        className
      )}
    />
    <Badge className={cn("hidden md:block text-primary-foreground", className)}>
      {badgeLabel}
    </Badge>
  </>
);

export default AccordionItemBadge;
