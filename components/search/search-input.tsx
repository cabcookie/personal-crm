import { cn } from "@/lib/utils";
import { Delete, Search } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSearch } from "./useSearch";

type SearchInputProps = {
  className?: string;
};

const SearchInput: FC<SearchInputProps> = ({ className }) => {
  const { searchText, setSearchText, isSearchActive } = useSearch();

  return (
    <div className={cn(className)}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-8"
          autoFocus
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </div>
      {isSearchActive && (
        <Button
          variant="outline"
          onClick={() => {
            setSearchText("");
          }}
          className="mt-2 h-8 px-2 lg:px-3"
        >
          Reset Search
          <Delete className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
