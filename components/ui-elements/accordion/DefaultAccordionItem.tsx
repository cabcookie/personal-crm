import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerSubTitle,
  AccordionTriggerTitle,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccordionItemProps } from "@radix-ui/react-accordion";
import { filter, flow, join } from "lodash/fp";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import Link from "next/link";
import { ElementRef, ReactNode, forwardRef } from "react";
import { BiLinkExternal } from "react-icons/bi";

interface DefaultAccordionItemProps extends AccordionItemProps {
  triggerTitle: ReactNode;
  link?: string;
  triggerSubTitle?:
    | string
    | boolean
    | null
    | (string | undefined | null | boolean)[];
  isVisible?: boolean;
  onDelete?: () => void;
  badge?: ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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
      badge,
      onMoveUp,
      onMoveDown,
      isVisible = true,
      ...props
    },
    ref
  ) =>
    isVisible && (
      <AccordionItem value={value} ref={ref} {...props}>
        <div className="flex h-full items-center">
          {(onMoveUp || onMoveDown) && (
            <div className="flex flex-col gap-0.5">
              {onMoveUp && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onMoveUp}
                >
                  <ChevronUp className="h-3 w-3 text-muted-foreground hover:text-primary" />
                </Button>
              )}
              {onMoveDown && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onMoveDown}
                >
                  <ChevronDown className="h-3 w-3 text-muted-foreground hover:text-primary" />
                </Button>
              )}
            </div>
          )}
          <AccordionTrigger
            className={cn(props.disabled && "text-muted-foreground", className)}
          >
            <AccordionTriggerTitle>
              {badge}
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
        </div>
        <AccordionContent className="my-2 bg-[--context-color-bg] px-1 md:px-2">
          {children}
        </AccordionContent>
      </AccordionItem>
    )
);
DefaultAccordionItem.displayName = AccordionItem.displayName;

export default DefaultAccordionItem;
