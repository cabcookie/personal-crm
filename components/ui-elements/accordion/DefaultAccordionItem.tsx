import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerSubTitle,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccordionItemProps } from "@radix-ui/react-accordion";
import { filter, flow, join } from "lodash/fp";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { ElementRef, ReactNode, forwardRef } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { OrderButtons } from "./OrderButtons";

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
  actionIcon?: ReactNode;
  badge?: ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableOrderControls?: boolean;
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
      actionIcon,
      badge,
      onMoveUp,
      onMoveDown,
      isVisible = true,
      disableOrderControls = false,
      ...props
    },
    ref
  ) =>
    isVisible && (
      <AccordionItem value={value} ref={ref} {...props}>
        <div className="flex h-full items-center">
          <AccordionTrigger
            className={cn(
              props.disabled && "text-muted-foreground max-w-full",
              className
            )}
          >
            <div className="flex items-start gap-2 w-full">
              {(onMoveUp || onMoveDown) && !disableOrderControls && (
                <div className="shrink-0">
                  <OrderButtons onMoveDown={onMoveDown} onMoveUp={onMoveUp} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {badge && <div className="shrink-0">{badge}</div>}
                  <div className="flex-1 truncate sm:text-left group-data-[state=open]:text-wrap group-data-[state=open]:text-left">
                    {triggerTitle}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    {actionIcon}
                    {link && (
                      <Link
                        href={link}
                        className="mt-1 text-muted-foreground hover:text-primary flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <BiLinkExternal className="h-4 w-4" />
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
                  </div>
                </div>
                <AccordionTriggerSubTitle className="items-center min-w-full">
                  <div className="flex-1 truncate sm:text-left">
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
                  </div>
                </AccordionTriggerSubTitle>
              </div>
            </div>
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
