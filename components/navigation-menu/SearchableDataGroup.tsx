import { cn } from "@/lib/utils";
import { useCommandState } from "cmdk";
import { useRouter } from "next/router";
import { FC } from "react";
import { CommandGroup, CommandItem } from "../ui/command";

type ProcessFunction = () => Promise<string | undefined>;

type SearchableDataGroupProps = {
  heading: string;
  metaPressed?: boolean;
  items?: {
    id: string;
    value: string;
    link: string;
    processFn?: ProcessFunction;
  }[];
};

const SearchableDataGroup: FC<SearchableDataGroupProps> = ({
  heading,
  items,
  metaPressed,
}) => {
  const search = useCommandState((state) => state.search);
  const router = useRouter();

  const routeToUrl = (url?: string) => {
    if (!url) return;
    if (metaPressed) window.open(url, "_blank");
    else router.push(url);
  };

  const handleSelect =
    (url: string | undefined, processFn: ProcessFunction | undefined) =>
    async () => {
      if (!processFn) return routeToUrl(url);
      const newItemId = await processFn();
      if (!newItemId) return;
      routeToUrl(`${url}/${newItemId}`);
    };

  return (
    <CommandGroup
      heading={heading}
      className={cn((!search || search.length < 4 || !items) && "hidden")}
    >
      {items?.map(({ id, value, link, processFn }) => (
        <CommandItem key={id} onSelect={handleSelect(link, processFn)}>
          {value}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default SearchableDataGroup;
