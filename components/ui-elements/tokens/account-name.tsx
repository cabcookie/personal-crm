import { useAccountsContext } from "@/api/ContextAccounts";
import { FC, useEffect, useState } from "react";

type AccountNameProps = {
  accountId: string;
  noLinks?: boolean;
};

const AccountName: FC<AccountNameProps> = ({ accountId, noLinks }) => {
  const { getAccountById } = useAccountsContext();
  const [account, setAccount] = useState(() => getAccountById(accountId));

  useEffect(() => {
    setAccount(getAccountById(accountId));
  }, [accountId, getAccountById]);

  return !account ? (
    "…"
  ) : (
    <div>
      {noLinks ? (
        account.name
      ) : (
        <a href={`/accounts/${accountId}`} className="hover:underline">
          {account.name}
        </a>
      )}
    </div>
  );
};

export default AccountName;
