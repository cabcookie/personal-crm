import { FC, useEffect, useState } from "react";
import styles from "./Tokens.module.css";
import { useAccountsContext } from "@/api/ContextAccounts";

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

  return (
    account &&
    (noLinks ? (
      <span className={styles.accountName}>{account?.name}</span>
    ) : (
      <a href={`/accounts/${accountId}`} className={styles.accountName}>
        {account?.name}
      </a>
    ))
  );
};

export default AccountName;
