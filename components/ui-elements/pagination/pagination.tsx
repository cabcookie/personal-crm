import { FC } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useContextContext } from "@/contexts/ContextContext";
import styles from "./Pagination.module.css";
import contextStyles from "@/components/layouts/ContextColors.module.css";

type PaginationProps = {
  text?: string;
  page: number;
  setPage: (newPage: number) => void;
  className?: string;
};

const Pagination: FC<PaginationProps> = ({
  text,
  page,
  className,
  setPage,
}) => {
  const { context } = useContextContext();

  return (
    <div
      className={`${contextStyles[`${context}ColorScheme`]} ${
        styles.row
      }  ${className}`}
    >
      <div className={`${styles.navigation} ${page === 1 && styles.disabled}`}>
        <IoChevronBackOutline onClick={() => setPage(page - 1)} />
      </div>
      {text ? <div>{text}</div> : <div>{page}</div>}
      <div className={styles.navigation}>
        <IoChevronForwardOutline onClick={() => setPage(page + 1)} />
      </div>
    </div>
  );
};

export default Pagination;
