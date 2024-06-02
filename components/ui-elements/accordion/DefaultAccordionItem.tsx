import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      <AccordionTrigger className={className}>
        <div className="flex flex-row gap-2 start-0 align-middle">
          <div>{title}</div>
          {link && (
            <Link
              href={link}
              className="mt-1 text-muted-foreground hover:text-primary"
            >
              <BiLinkExternal />
            </Link>
          )}
          {subTitle && accordionSelectedValue !== value && (
            <div className="font-normal space-x-2 truncate">{subTitle}</div>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );

export default DefaultAccordionItem;
