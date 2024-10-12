import {
  ComponentType,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    setIsSearchActive(!!search);
  }, [search]);

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

export function isSearchable<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <SearchProvider>
        <Component {...componentProps} />
      </SearchProvider>
    );
  };
}
