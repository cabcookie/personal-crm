import { FC, ReactNode } from "react";
import styles from "./RecordDetails.module.css";

type RecordDetailsProps = {
  className?: string;
  title?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

const RecordDetails: FC<RecordDetailsProps> = ({
  className,
  title,
  children,
  contentClassName,
}) => {
  return (
    <div className={`${styles.infoBox} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={contentClassName || styles.contentContainer}>
        {children}
      </div>
    </div>
  );
};

export default RecordDetails;
