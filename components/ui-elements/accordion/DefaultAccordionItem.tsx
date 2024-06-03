import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { BiLinkExternal } from "react-icons/bi";

type DefaultAccordionItemProps = {
  value: string;
  title: ReactNode;
  link?: string;
  subTitle?: ReactNode;
  accordionSelectedValue?: string;
  className?: string;
  children: ReactNode;
  isVisible?: boolean;
};

const DefaultAccordionItem: FC<DefaultAccordionItemProps> = ({
  value,
  title,
  link,
  subTitle,
  accordionSelectedValue,
  className,
  children,
  isVisible = true,
}) =>
  isVisible && (
    <AccordionItem value={value}>
      <AccordionTrigger className={cn("w-full", className)}>
        <div className="flex flex-row gap-2 items-center w-full">
          <div className="flex-shrink-0">{title}</div>
          {link && (
            <Link
              href={link}
              className="mt-1 text-muted-foreground hover:text-primary flex-shrink-0"
            >
              <BiLinkExternal />
            </Link>
          )}
          {subTitle && accordionSelectedValue !== value && (
            <div className="flex-1 min-w-0 font-normal space-x-2 truncate">
              {subTitle}
            </div>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );

export default DefaultAccordionItem;
