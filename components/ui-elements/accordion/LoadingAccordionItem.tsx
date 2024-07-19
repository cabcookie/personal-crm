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

type Sizes = "xl" | "lg" | "base" | "sm" | "xs";

interface LoadingAccordionItemProps extends AccordionItemProps {
  value: string;
  sizeTitle: Sizes;
  sizeSubtitle?: Sizes;
}

const LoadingAccordionItem: FC<LoadingAccordionItemProps> = ({
  value,
  sizeTitle,
  sizeSubtitle,
}) => (
  <AccordionItem value={value} disabled>
    <AccordionTrigger>
      <AccordionTriggerTitle>
        <div>
          <Skeleton
            className={cn(
              "h-5",
              sizeTitle === "xl" && "w-32",
              sizeTitle === "lg" && "w-28",
              sizeTitle === "base" && "w-24",
              sizeTitle === "sm" && "w-20",
              sizeTitle === "xs" && "w-16"
            )}
          />
        </div>
      </AccordionTriggerTitle>
      {sizeSubtitle && (
        <AccordionTriggerSubTitle>
          <Skeleton
            className={cn(
              "mt-2 h-4",
              sizeTitle === "xl" && "w-[32rem]",
              sizeTitle === "lg" && "w-[28rem]",
              sizeTitle === "base" && "w-[24rem]",
              sizeTitle === "sm" && "w-[20rem]",
              sizeTitle === "xs" && "w-[16rem]"
            )}
          />
        </AccordionTriggerSubTitle>
      )}
    </AccordionTrigger>
  </AccordionItem>
);

export default LoadingAccordionItem;
