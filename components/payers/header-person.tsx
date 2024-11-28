import usePeople from "@/api/usePeople";
import { cn } from "@/lib/utils";
import { flow, identity } from "lodash/fp";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

type PayerHeaderPersonProps = {
  personId?: string;
  className?: string;
  textResellerSize?: "sm" | "xs";
};

const PayerHeaderPerson: FC<PayerHeaderPersonProps> = ({
  personId,
  className,
  textResellerSize = "sm",
}) => {
  const { getNamesByIds } = usePeople();
  const [personName, setPersonName] = useState<string | undefined>();

  useEffect(() => {
    flow(
      identity<string | undefined>,
      (id) => (!id ? undefined : getNamesByIds([id])),
      setPersonName
    )(personId);
  }, [personId, getNamesByIds]);

  return (
    personName && (
      <div className={cn("flex flex-col", className)}>
        <Link
          className={cn(
            textResellerSize === "sm" ? "text-sm" : "text-xs",
            "text-muted-foreground hover:text-blue-600"
          )}
          href={`/people/${personId}`}
        >
          {personName}
          <ExternalLink className="w-3 h-3 inline-block ml-1 -translate-y-0.5" />
        </Link>
      </div>
    )
  );
};

export default PayerHeaderPerson;
