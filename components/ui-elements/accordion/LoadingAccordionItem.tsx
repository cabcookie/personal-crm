import {
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerSubTitle,
  AccordionTriggerTitle,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { AccordionItemProps } from "@radix-ui/react-accordion";
import { FC } from "react";

interface LoadingAccordionItemProps extends AccordionItemProps {
  value: string;
  withSubtitle?: boolean;
}

const LoadingAccordionItem: FC<LoadingAccordionItemProps> = ({
  value,
  withSubtitle,
}) => (
  <AccordionItem value={value} disabled>
    <AccordionTrigger>
      <AccordionTriggerTitle className="pr-2">
        <div>
          <Skeleton className="h-5 w-96" />
        </div>
      </AccordionTriggerTitle>
      <AccordionTriggerSubTitle className="font-normal" isOpen={withSubtitle}>
        <Skeleton className="mt-2 h-4 w-80" />
      </AccordionTriggerSubTitle>
    </AccordionTrigger>
  </AccordionItem>
);

export default LoadingAccordionItem;
