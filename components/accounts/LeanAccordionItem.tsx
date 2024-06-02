import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, ReactNode } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type LeanAccordianItemProps = {
  title: string;
  value?: string;
  isVisible?: boolean;
  children: ReactNode;
  className?: string;
  link?: string;
};

const LeanAccordianItem: FC<LeanAccordianItemProps> = ({
  title,
  value,
  children,
  isVisible,
  className,
  link,
}) => (
  <AccordionItem value={value || title} className={cn(!isVisible && "hidden")}>
    <AccordionTrigger className={className}>
      <div className="flex flex-row gap-2 start-0 align-middle">
        <div>{title}</div>
        {link && (
          <div className="font-normal">
            <small className="hover:underline">
              <Link href={link}>Open</Link>
            </small>
          </div>
        )}
      </div>
    </AccordionTrigger>
    <AccordionContent>{children}</AccordionContent>
  </AccordionItem>
);

export default LeanAccordianItem;
