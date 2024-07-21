import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerSubTitle,
  AccordionTriggerTitle,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccordionItemProps } from "@radix-ui/react-accordion";
import { filter, flow, join } from "lodash/fp";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import Link from "next/link";
import { ElementRef, ReactNode, forwardRef } from "react";
import { BiLinkExternal } from "react-icons/bi";

interface DefaultAccordionItemProps extends AccordionItemProps {
  triggerTitle: ReactNode;
  link?: string;
  triggerSubTitle?: string | boolean | (string | undefined | boolean)[];
  isVisible?: boolean;
  onDelete?: () => void;
  hasOpenTasks?: boolean;
  hasClosedTasks?: boolean;
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
      className,
      children,
      onDelete,
      hasOpenTasks,
      hasClosedTasks,
      isVisible = true,
      ...props
    },
    ref
  ) =>
    isVisible && (
      <AccordionItem value={value} ref={ref} {...props}>
        <AccordionTrigger className={className}>
          <AccordionTriggerTitle>
            {hasOpenTasks && (
              <>
                <Circle className="mt-[0.2rem] w-4 min-w-4 h-4 md:hidden bg-destructive rounded-full text-destructive-foreground" />
                <Badge variant="destructive" className="hidden md:block">
                  Open
                </Badge>
              </>
            )}
            {!hasOpenTasks && hasClosedTasks && (
              <>
                <CheckCircle2 className="mt-[0.2rem] w-4 h-4 md:hidden rounded-full bg-constructive text-constructive-foreground" />
                <Badge className="hidden md:block bg-constructive text-constructive-foreground">
                  Done
                </Badge>
              </>
            )}
            {triggerTitle}
            {link && (
              <Link
                href={link}
                className="mt-1 text-muted-foreground hover:text-primary flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <BiLinkExternal />
              </Link>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                asChild
              >
                <Trash2 className="mt-1 h-4 w-4 text-muted-foreground hover:text-primary" />
              </Button>
            )}
          </AccordionTriggerTitle>
          <AccordionTriggerSubTitle>
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
        <AccordionContent className="my-2">{children}</AccordionContent>
      </AccordionItem>
    )
);
DefaultAccordionItem.displayName = AccordionItem.displayName;

export default DefaultAccordionItem;
