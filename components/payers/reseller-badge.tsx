import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { find, flow, identity } from "lodash/fp";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

type ResellerBadgeProps = {
  className?: string;
  resellerId?: string;
  isReseller?: boolean;
  textResellerSize?: "sm" | "xs";
};

const ResellerBadge: FC<ResellerBadgeProps> = ({
  className,
  resellerId,
  isReseller,
  textResellerSize = "sm",
}) => {
  const [reseller, setReseller] = useState<Account | undefined>();
  const { accounts } = useAccountsContext();

  useEffect(() => {
    flow(
      identity<Account[] | undefined>,
      find(["id", resellerId]),
      setReseller
    )(accounts);
  }, [accounts, resellerId]);

  return (
    (reseller || isReseller) && (
      <div className={cn("flex flex-col", className)}>
        <div className="flex">
          <Badge className="bg-green-500">Reseller</Badge>
        </div>
        {reseller && (
          <Link
            className={cn(
              textResellerSize === "sm" ? "text-sm" : "text-xs",
              "text-muted-foreground hover:text-blue-600"
            )}
            href={`/accounts/${reseller.id}`}
          >
            {reseller.name}
            <ExternalLink className="w-3 h-3 inline-block ml-1 -translate-y-0.5" />
          </Link>
        )}
      </div>
    )
  );
};

export default ResellerBadge;
