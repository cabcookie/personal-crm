import { FC } from "react";
import styles from "./Tokens.module.css";
import { Account } from "@/api/useAccounts";

type AccountNameProps = {
  account: Account;
  noLinks?: boolean;
};

const AccountName: FC<AccountNameProps> = ({ account, noLinks }) => {
  return noLinks ? (
    <span className={styles.accountName}>{account.name}</span>
  ) : (
    <a href={`/accounts/${account.id}`} className={styles.accountName}>
      {account.name}
    </a>
  );
};

export default AccountName;
