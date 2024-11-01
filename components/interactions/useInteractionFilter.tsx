import { useInteractions } from "@/api/useInteractions";
import {
  Interaction,
  InteractionTimeFilter,
  isValidPeersOrCustomersFilter,
  isValidWeekFilter,
  PeersOrCustomersFilter,
} from "@/helpers/interactions";
import { ComponentType, createContext, FC, useContext, useState } from "react";

interface InteractionFilterType {
  weeks: InteractionTimeFilter;
  setWeeks: (weeks: string) => void;
  peersOrCustomers: PeersOrCustomersFilter;
  setPeersOrCustomers: (peersOrCustomers: string) => void;
  interactions: Interaction[] | undefined;
}

const InteractionFilter = createContext<InteractionFilterType | null>(null);

export const useInteractionFilter = () => {
  const searchContext = useContext(InteractionFilter);
  if (!searchContext)
    throw new Error(
      "useInteractionFilter must be used within InteractionFilterProvider"
    );
  return searchContext;
};

interface InteractionFilterProviderProps {
  children: React.ReactNode;
}

const InteractionFilterProvider: FC<InteractionFilterProviderProps> = ({
  children,
}) => {
  const [weeks, setWeeks] = useState<InteractionTimeFilter>("13");
  const [peersOrCustomers, setPeersOrCustomers] =
    useState<PeersOrCustomersFilter>("PEERS");
  const { interactions } = useInteractions(parseInt(weeks), peersOrCustomers);

  const onWeeksChange = (weeks: string) =>
    isValidWeekFilter(weeks) && setWeeks(weeks);

  const onPeersOrCustomersChange = (peersOrCustomers: string) =>
    isValidPeersOrCustomersFilter(peersOrCustomers) &&
    setPeersOrCustomers(peersOrCustomers);

  return (
    <InteractionFilter.Provider
      value={{
        weeks,
        setWeeks: onWeeksChange,
        interactions,
        peersOrCustomers,
        setPeersOrCustomers: onPeersOrCustomersChange,
      }}
    >
      {children}
    </InteractionFilter.Provider>
  );
};

export function withInteractionFilter<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <InteractionFilterProvider>
        <Component {...componentProps} />
      </InteractionFilterProvider>
    );
  };
}
