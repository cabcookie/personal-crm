import {
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerSubTitle,
  AccordionTriggerTitle,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AccordionItemProps } from "@radix-ui/react-accordion";
import { FC } from "react";

interface LoadingAccordionItemProps extends AccordionItemProps {
  value: string;
  widthTitleRem: number;
  widthSubTitleRem?: number;
}

const LoadingAccordionItem: FC<LoadingAccordionItemProps> = ({
  value,
  widthTitleRem,
  widthSubTitleRem,
}) => (
  <AccordionItem value={value} disabled>
    <AccordionTrigger>
      <AccordionTriggerTitle>
        <div>
          <Skeleton className={cn("h-5", `w-[${widthTitleRem}rem]`)} />
        </div>
      </AccordionTriggerTitle>
      {widthSubTitleRem && (
        <AccordionTriggerSubTitle>
          <Skeleton className={cn("mt-2 h-4", `w-[${widthSubTitleRem}rem]`)} />
        </AccordionTriggerSubTitle>
      )}
    </AccordionTrigger>
  </AccordionItem>
);

export default LoadingAccordionItem;
