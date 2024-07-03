import { useNavMenuContext } from "@/contexts/NavMenuContext";
import { useCommandState } from "cmdk";
import { useRouter } from "next/router";
import { FC } from "react";
import { CommandGroup, CommandItem } from "../ui/command";

type SearchableDataGroupProps = {
  heading: string;
  items?: {
    id: string;
    value: string;
    link: string;
  }[];
};

const SearchableDataGroup: FC<SearchableDataGroupProps> = ({
  heading,
  items,
}) => {
  const router = useRouter();
  const { toggleMenu } = useNavMenuContext();
  const search = useCommandState((state) => state.search);

  return (
    search &&
    search.length >= 4 &&
    items && (
      <CommandGroup heading={heading}>
        {items.map(({ id, value, link }) => (
          <CommandItem
            key={id}
            onSelect={() => {
              router.push(link);
              toggleMenu();
            }}
          >
            {value}
          </CommandItem>
        ))}
      </CommandGroup>
    )
  );
};

export default SearchableDataGroup;
