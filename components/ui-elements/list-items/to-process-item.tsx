import { FC, ReactNode } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import styles from "./ListItem.module.css";
import ListItem, { ListItemProps } from "./list-item";

type ToProcessItemProps = ListItemProps & {
  actionStep?: ReactNode;
};

const ToProcessItem: FC<ToProcessItemProps> = ({ actionStep, ...props }) => (
  <ListItem
    {...props}
    itemSelector={
      actionStep || <IoAddCircleOutline className={styles.listItemIcon} />
    }
  />
);

export default ToProcessItem;
