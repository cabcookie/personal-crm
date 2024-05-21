import { FC, ReactNode } from "react";
import styles from "./ListItem.module.css";

export type ListItemProps = {
  title: ReactNode;
  description?: ReactNode;
};

type InternalListItemProps = ListItemProps & {
  itemSelector?: ReactNode;
};

const ListItem: FC<InternalListItemProps> = ({
  title,
  description,
  itemSelector,
}) => {
  return (
    <article>
      <div className={styles.postLine}>
        {itemSelector}
        <div className={styles.postBody}>
          <div>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    </article>
  );
};

export default ListItem;
