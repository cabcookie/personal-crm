import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type RecordDetailsProps = {
  className?: string;
  title?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

const RecordDetails: FC<RecordDetailsProps> = ({
  className,
  title,
  children,
  contentClassName,
}) => {
  return (
    <div
      className={cn(
        title !== "" && "w-full border-solid border rounded-md",
        className
      )}
    >
      {title && (
        <h3 className="mx-4 mt-4 font-semibold tracking-tight">{title}</h3>
      )}
      <div className={contentClassName || "p-4"}>{children}</div>
    </div>
  );
};

export default RecordDetails;
