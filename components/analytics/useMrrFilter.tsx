import useMrr, { Mrr } from "@/api/useMrr";
import { ComponentType, createContext, FC, useContext, useState } from "react";
import { KeyedMutator } from "swr";

const MRR_FILTERS_CONST = ["3", "6", "12", "24"] as const;
export type MrrFilters = (typeof MRR_FILTERS_CONST)[number];
export const MRR_FILTERS = ["3", "6", "12", "24"] as MrrFilters[];

const isValidMrrFilter = (filter: string): filter is MrrFilters =>
  MRR_FILTERS_CONST.includes(filter as MrrFilters);

interface MrrFilterType {
  mrr: Mrr[] | undefined;
  isLoading: ReturnType<typeof useMrr>["isLoading"];
  error: ReturnType<typeof useMrr>["error"];
  mrrFilter: MrrFilters;
  setMrrFilter: (filter: string) => void;
  mutateMrr: KeyedMutator<Mrr[] | undefined>;
}

const MrrFilter = createContext<MrrFilterType | null>(null);

export const useMrrFilter = () => {
  const searchContext = useContext(MrrFilter);
  if (!searchContext)
    throw new Error("useMrrFilter must be used within MrrFilterProvider");
  return searchContext;
};

interface MrrFilterProviderProps {
  children: React.ReactNode;
}

const MrrFilterProvider: FC<MrrFilterProviderProps> = ({ children }) => {
  const [mrrFilter, setMrrFilter] = useState<MrrFilters>("6");
  const { mrr, isLoading, error, mutate } = useMrr("DONE", mrrFilter);

  const onFilterChange = (newFilter: string) =>
    isValidMrrFilter(newFilter) && setMrrFilter(newFilter);

  return (
    <MrrFilter.Provider
      value={{
        mrr,
        isLoading,
        error,
        mrrFilter,
        setMrrFilter: onFilterChange,
        mutateMrr: mutate,
      }}
    >
      {children}
    </MrrFilter.Provider>
  );
};

export function withMrrFilter<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <MrrFilterProvider>
        <Component {...componentProps} />
      </MrrFilterProvider>
    );
  };
}
