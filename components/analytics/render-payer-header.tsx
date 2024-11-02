import usePayer from "@/api/usePayer";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import ResellerBadge from "../payers/reseller-badge";

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
  const { payer } = usePayer(id);

  return (
    <div>
      {!id ? (
        label
      ) : (
        <Link
          href={`/payers/${id}`}
          target="_blank"
          className="text-gray-500 hover:text-blue-400"
        >
          {label}
          <ExternalLink className="ml-1 w-4 h-4 inline-block -translate-y-0.5" />
        </Link>
      )}

      <ResellerBadge
        isReseller={isReseller}
        resellerId={payer?.resellerId}
        className="mt-0.5 gap-0.5"
        textResellerSize="xs"
      />
    </div>
  );
};

export default RenderPayerHeader;
