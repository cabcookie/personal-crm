import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerSubTitle,
  AccordionTriggerTitle,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { AccordionItemProps } from "@radix-ui/react-accordion";
import { filter, flow, join } from "lodash/fp";
import Link from "next/link";
import { ElementRef, ReactNode, forwardRef } from "react";
import { BiLinkExternal } from "react-icons/bi";

interface DefaultAccordionItemProps extends AccordionItemProps {
  triggerTitle: ReactNode;
  link?: string;
  triggerSubTitle?: string | boolean | (string | undefined | boolean)[];
  accordionSelectedValue?: string;
  isVisible?: boolean;
}

const DefaultAccordionItem = forwardRef<
  ElementRef<typeof AccordionItem>,
  DefaultAccordionItemProps
>(
  (
    {
      value,
      triggerTitle,
      link,
      triggerSubTitle,
      accordionSelectedValue,
      className,
      children,
      isVisible = true,
      ...props
    },
    ref
  ) =>
    isVisible && (
      <AccordionItem value={value} ref={ref} {...props}>
        <AccordionTrigger className={className}>
          <AccordionTriggerTitle
            className="pr-2"
            isOpen={accordionSelectedValue === value}
          >
            <div className={cn(accordionSelectedValue !== value && "truncate")}>
              {triggerTitle}
            </div>
            {link && (
              <Link
                href={link}
                className="mt-1 text-muted-foreground hover:text-primary flex-shrink-0"
              >
                <BiLinkExternal />
              </Link>
            )}
          </AccordionTriggerTitle>
          <AccordionTriggerSubTitle
            isOpen={!!triggerSubTitle && accordionSelectedValue !== value}
            className="font-normal"
          >
            {typeof triggerSubTitle === "string"
              ? triggerSubTitle
              : typeof triggerSubTitle === "boolean"
              ? ""
              : flow(
                  filter(
                    (t: string | undefined | boolean) =>
                      typeof t === "string" && t !== ""
                  ),
                  join(", ")
                )(triggerSubTitle)}
          </AccordionTriggerSubTitle>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    )
);
DefaultAccordionItem.displayName = AccordionItem.displayName;

export default DefaultAccordionItem;
