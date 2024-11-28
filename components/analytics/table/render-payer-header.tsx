import usePayer from "@/api/usePayer";
import PayerHeaderPerson from "@/components/payers/header-person";
import ResellerBadge from "@/components/payers/reseller-badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

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
    <div className="text-gray-500">
      {!id ? (
        label
      ) : (
        <Link
          href={`/payers/${id}`}
          target="_blank"
          className="hover:text-blue-400"
        >
          {label}
          <ExternalLink className="ml-1 w-4 h-4 inline-block -translate-y-0.5" />
        </Link>
      )}

      <PayerHeaderPerson
        personId={payer?.mainContactId}
        textResellerSize="xs"
      />

      <div className="text-xs">{payer?.notes}</div>

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
