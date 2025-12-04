import { ForwardRefExoticComponent, RefAttributes } from "react";
import { CheckCircle2, Loader2, LucideProps } from "lucide-react";
import { ExportTask } from "@/api/useExports";
import { BadgeProps } from "@/components/ui/badge";
import { Schema } from "@/amplify/data/resource";

type ExportStatus = Schema["ExportStatus"]["type"];
type Config = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  variant: BadgeProps["variant"];
  iconClass: string;
};

export const getStatusConfig = (task: ExportTask) =>
  ({
    CREATED: {
      icon: Loader2,
      label: "Creating",
      variant: "secondary" as const,
      iconClass: "animate-spin",
    },
    GENERATED: {
      icon: CheckCircle2,
      label: task.error ? "Failed" : "Ready",
      variant: task.error ? "destructive" : "default",
      iconClass: "",
    },
    COMPLETED: {
      icon: CheckCircle2,
      label: "Completed",
      variant: "outline" as const,
      iconClass: "",
    },
  }) as Record<ExportStatus, Config>;
