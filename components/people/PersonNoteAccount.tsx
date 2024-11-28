import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { cn } from "@/lib/utils";
import { find, flow, identity } from "lodash/fp";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

type PersonNoteAccountProps = {
  accountId: string;
  className?: string;
};

const PersonNoteAccount: FC<PersonNoteAccountProps> = ({
  accountId,
  className,
}) => {
  const { accounts } = useAccountsContext();
  const [account, setAccount] = useState<Account | undefined>();

  useEffect(() => {
    flow(
      identity<Account[] | undefined>,
      find((a) => a.id === accountId),
      setAccount
    )(accounts);
  }, [accounts, accountId]);

  return (
    <Link
      href={`/accounts/${account?.id}`}
      className={cn("hover:text-blue-600", className)}
    >
      {account?.name}
    </Link>
  );
};

export default PersonNoteAccount;
