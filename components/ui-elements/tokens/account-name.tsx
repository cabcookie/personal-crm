import { FC } from "react";
import styles from "./Tokens.module.css";
import { useAccountsContext } from "@/api/ContextAccounts";

type AccountNameProps = {
  accountId: string;
  noLinks?: boolean;
};

const AccountName: FC<AccountNameProps> = ({ accountId, noLinks }) => {
  const { getAccountById } = useAccountsContext();

  return noLinks ? (
    <span className={styles.accountName}>
      {getAccountById(accountId)?.name}
    </span>
  ) : (
    <a
      href={`/accounts/${getAccountById(accountId)?.id}`}
      className={styles.accountName}
    >
      {getAccountById(accountId)?.name}
    </a>
  );
};

export default AccountName;
