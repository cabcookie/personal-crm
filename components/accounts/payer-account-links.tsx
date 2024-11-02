import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

type PayerAccountLinksProps = {
  payer?: string;
  className?: string;
};

const PayerAccountLinks: FC<PayerAccountLinksProps> = ({
  payer,
  className,
}) => {
  return (
    payer && (
      <div className={cn("flex flex-row gap-2 text-xs", className)}>
        <Link
          href={`https://salesconsole.aws.dev/standalone.html?basePath=accounts&id=${payer}`}
          target="_blank"
          className="text-muted-foreground hover:text-blue-600 hover:underline hover:underline-offset-2"
        >
          Sales Console
          <ExternalLink className="w-3 h-3 inline-block ml-0.5 -translate-y-0.5" />
        </Link>
        <Link
          href={`https://prod.us-east-1.ro.cmc.insights.aws.a2z.com/?spoofAccountId=${payer}#/cost-explorer?chartStyle=STACK&costAggregate=unBlendedCost&excludeForecasting=false&filter=%5B%5D&futureRelativeRange=CUSTOM&granularity=Monthly&groupBy=%5B%22LinkedAccount%22%5D&historicalRelativeRange=LAST_3_MONTHS&isDefault=true&showOnlyUncategorized=false&showOnlyUntagged=false&usageAggregate=undefined&useNormalizedUnits=false`}
          target="_blank"
          className="text-muted-foreground hover:text-blue-600 hover:underline hover:underline-offset-2"
        >
          Cost Explorer
          <ExternalLink className="w-3 h-3 inline-block ml-0.5 -translate-y-0.5" />
        </Link>
      </div>
    )
  );
};

export default PayerAccountLinks;
