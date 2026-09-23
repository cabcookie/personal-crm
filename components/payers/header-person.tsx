import usePeople from "@/api/usePeople";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

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
  const { getPersonById } = usePeople();
  // Reads from the cache and triggers an on-demand load if not present; the
  // component re-renders (via the people SWR key) once the person lands.
  const person = getPersonById(personId);
  const personName = person
    ? `${person.name}${person.howToSay ? ` (say: ${person.howToSay})` : ""}`
    : undefined;

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
