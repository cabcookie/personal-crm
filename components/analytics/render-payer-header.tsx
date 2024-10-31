import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import ResellerBadge from "./reseller-badge";

type RenderPayerHeaderProps = {
  id: string | undefined;
  label: string;
  isReseller: boolean;
};

const RenderPayerHeader: FC<RenderPayerHeaderProps> = ({
  id,
  label,
  isReseller,
}) => {
  return (
    <div>
      {!id ? (
        label
      ) : (
        <Link
          href={`/payers/${id}`}
          className="text-gray-500 hover:text-blue-400"
        >
          {label}
          <ExternalLink className="ml-1 w-4 h-4 inline-block -translate-y-0.5" />
        </Link>
      )}
      {isReseller && (
        <div className="flex">
          <ResellerBadge className="block" />
        </div>
      )}
    </div>
  );
};

export default RenderPayerHeader;
