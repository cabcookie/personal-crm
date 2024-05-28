import { FC, ReactNode } from "react";

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
    <article className="flex flex-row gap-4 mb-8">
      <div className="text-xl md:text-2xl">{itemSelector}</div>
      <div className="flex flex-col w-full">
        <div>{title}</div>
        <div className="text-muted-foreground">{description}</div>
      </div>
    </article>
  );
};

export default ListItem;
