import { FC, FormEvent, ReactNode, useState } from "react";
import styles from "./ListItem.module.css";
import { IoCheckboxSharp, IoSquareOutline } from "react-icons/io5";

type CheckListItemProps = {
    title: ReactNode;
    description?: ReactNode;
    checked?: boolean;
    switchCheckbox: (checked: boolean) => any;
};

const CheckListItem: FC<CheckListItemProps> = ({
    title,
    description,
    switchCheckbox,
    checked,
}) => (
    <article>
      <div className={styles.postLine}>
        <a
          className={styles.postCheckbox}
          onClick={() => switchCheckbox(!checked)}
        >
          {checked ? <IoSquareOutline /> : <IoCheckboxSharp />}
        </a>
        <div className={styles.postBody}>
            <div>{title}</div>
            <div className={styles.description}>
              {description}
            </div>
        </div>
      </div>
    </article>
  );

export default CheckListItem;