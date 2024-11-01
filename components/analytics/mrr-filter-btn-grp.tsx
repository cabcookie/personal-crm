import { cn } from "@/lib/utils";
import { FC } from "react";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import { MRR_FILTERS, useMrrFilter } from "./useMrrFilter";

type MrrFilterBtnGrpProps = {
  className?: string;
};

const MrrFilterBtnGrp: FC<MrrFilterBtnGrpProps> = ({ className }) => {
  const { mrrFilter, setMrrFilter } = useMrrFilter();

  return (
    <div className={cn(className)}>
      <ButtonGroup
        values={MRR_FILTERS}
        selectedValue={mrrFilter}
        onSelect={setMrrFilter}
      />
    </div>
  );
};

export default MrrFilterBtnGrp;
