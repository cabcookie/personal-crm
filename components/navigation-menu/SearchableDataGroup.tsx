import { cn } from "@/lib/utils";
import { useCommandState } from "cmdk";
import { useRouter } from "next/router";
import { FC } from "react";
import { CommandGroup, CommandItem } from "../ui/command";

type SearchableDataGroupProps = {
  heading: string;
  metaPressed?: boolean;
  items?: {
    id: string;
    value: string;
    link: string;
  }[];
};

const SearchableDataGroup: FC<SearchableDataGroupProps> = ({
  heading,
  items,
  metaPressed,
}) => {
  const search = useCommandState((state) => state.search);
  const router = useRouter();

  const routeToUrl = (url?: string) => () => {
    if (!url) return;
    if (metaPressed) window.open(url, "_blank");
    else router.push(url);
  };

  return (
    <CommandGroup
      heading={heading}
      className={cn((!search || search.length < 4 || !items) && "hidden")}
    >
      {items?.map(({ id, value, link }) => (
        <CommandItem key={id} onSelect={routeToUrl(link)}>
          {value}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default SearchableDataGroup;
