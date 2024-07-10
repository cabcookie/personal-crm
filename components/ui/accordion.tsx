import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex flex-row items-center justify-between hover:bg-muted px-2 md:px-4 py-4 w-full">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "font-bold truncate transition-all [&[data-state=open]>svg]:rotate-180 w-full",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionTriggerTitle: React.FC<{
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}> = ({ children, className, isOpen }) => (
  <div
    className={cn(
      !isOpen && "flex flex-row gap-2 truncate",
      isOpen && "flex flex-row gap-2 text-wrap text-left",
      className
    )}
  >
    {children}
  </div>
);

const AccordionTriggerSubTitle: React.FC<{
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}> = ({ children, isOpen, className }) =>
  isOpen && (
    <div className={cn("text-sm flex flex-row gap-2 truncate", className)}>
      {children}
    </div>
  );

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="px-2 md:px-4 py-2 space-y-2 overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerSubTitle,
  AccordionTriggerTitle,
};
