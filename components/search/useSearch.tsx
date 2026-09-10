import { createContext, FC, useContext, useState } from "react";

interface SearchType {
  searchText: string;
  setSearchText: (searchText: string) => void;
  isSearchActive: boolean;
}

const Search = createContext<SearchType | null>(null);

export const useSearch = () => {
  const searchContext = useContext(Search);
  if (!searchContext)
    throw new Error("useSearch must be used within SearchProvider");
  return searchContext;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
  const [search, setSearch] = useState("");
  const isSearchActive = !!search;

  return (
    <Search.Provider
      value={{
        searchText: search,
        setSearchText: setSearch,
        isSearchActive,
      }}
    >
      {children}
    </Search.Provider>
  );
};
