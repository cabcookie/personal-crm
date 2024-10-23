import { FC } from "react";
import { useInteractionFilter } from "./useInteractionFilter";
import { cn } from "@/lib/utils";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import {
  PEERS_OR_CUSTOMERS,
  PeersOrCustomersFilter,
} from "@/helpers/interactions";

type InteractionPeersOrCustomersFilterBtnGrpProps = {
  className?: string;
};

const InteractionPeersOrCustomersFilterBtnGrp: FC<
  InteractionPeersOrCustomersFilterBtnGrpProps
> = ({ className }) => {
  const { peersOrCustomers, setPeersOrCustomers } = useInteractionFilter();

  return (
    <div className={cn(className)}>
      <div className="font-semibold">Peers or Customers:</div>
      <ButtonGroup
        values={PEERS_OR_CUSTOMERS as PeersOrCustomersFilter[]}
        selectedValue={peersOrCustomers}
        onSelect={setPeersOrCustomers}
      />
    </div>
  );
};

export default InteractionPeersOrCustomersFilterBtnGrp;
