import { FC } from "react";
import { IoCheckboxSharp, IoSquareOutline } from "react-icons/io5";
import styles from "./ListItem.module.css";
import ListItem, { ListItemProps } from "./list-item";

type CheckListItemProps = ListItemProps & {
  checked?: boolean;
  switchCheckbox: (checked: boolean) => any;
};

const CheckListItem: FC<CheckListItemProps> = ({
  switchCheckbox,
  checked,
  ...props
}) => (
  <ListItem
    {...props}
    itemSelector={
      <a
        className={styles.listItemIcon}
        onClick={() => switchCheckbox(!checked)}
      >
        {!checked ? <IoSquareOutline /> : <IoCheckboxSharp />}
      </a>
    }
  />
);

export default CheckListItem;
