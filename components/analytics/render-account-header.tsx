import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

type RenderAccountHeaderProps = {
  id: string | undefined;
  label: string;
};

const RenderAccountHeader: FC<RenderAccountHeaderProps> = ({ id, label }) => {
  return !id ? (
    label
  ) : (
    <Link
      href={`/accounts/${id}`}
      className="text-gray-500 hover:text-blue-400"
    >
      {label}
      <ExternalLink className="ml-1 w-4 h-4 inline-block -translate-y-0.5" />
    </Link>
  );
};

export default RenderAccountHeader;
