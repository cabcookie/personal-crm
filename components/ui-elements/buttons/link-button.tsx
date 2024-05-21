import Link from "next/link";
import { FC, ReactNode } from "react";
import styles from "./Button.module.css";

type LinkButtonProps = {
  children: ReactNode;
  wrapperClassName?: string;
  btnClassName?: string;
  href: string;
};

const LinkButton: FC<LinkButtonProps> = ({
  children,
  wrapperClassName,
  btnClassName,
  href,
}) => {
  return (
    <div className={wrapperClassName}>
      <Link
        className={`${styles.noDecoration} ${btnClassName} ${styles.button}`}
        href={href}
      >
        {children}
      </Link>
    </div>
  );
};
export default LinkButton;
