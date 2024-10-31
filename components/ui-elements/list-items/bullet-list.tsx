import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type BulletListProps = {
  ulClassName?: string;
  liClassName?: string;
  items: ReactNode[];
};

const BulletList: FC<BulletListProps> = ({
  ulClassName,
  liClassName,
  items,
}) => (
  <ul className={cn("list-disc pl-5", ulClassName)}>
    {items.map((item, index) => (
      <li key={index} className={cn(liClassName)}>
        {item}
      </li>
    ))}
  </ul>
);

export default BulletList;
