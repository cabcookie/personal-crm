import { useState } from "react";
import { Input } from "../ui/input";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <Input
      type="search"
      className="h-8 md:h-12 w-[8rem] sm:w-48"
      placeholder="Search…"
      value={searchText}
      onChange={(event) => {
        setSearchText(event.target.value);
      }}
    />
  );
};

export default SearchBar;
