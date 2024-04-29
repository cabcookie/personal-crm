import { Context } from "@/contexts/ContextContext";
import { FC } from "react";
import styles from "./OtherNavigationSection.module.css";
import contextStyles from "@/components/layouts/ContextColors.module.css";
import Link from "next/link";

type OtherNavigationSectionProps = {
  context?: Context;
};

type MenuItem = {
  name: string;
  link: string;
};

const menuItems: MenuItem[] = [
  { name: "Projects", link: "/projects" },
  { name: "Accounts", link: "/accounts" },
  // { name: "People", link: "/people" },
];

const OtherNavigationSection: FC<OtherNavigationSectionProps> = ({
  context,
}) => {
  return (
    <div
      className={`${
        context ? contextStyles[`${context}ColorScheme`] : styles.noColorScheme
      } ${styles.wrapper}`}
    >
      {menuItems.map(({ name, link }, idx) => (
        <Link className={styles.menuItem} key={idx} href={link}>
          {name}
        </Link>
      ))}
    </div>
  );
};

export default OtherNavigationSection;
