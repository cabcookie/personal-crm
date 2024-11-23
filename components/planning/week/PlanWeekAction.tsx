import { FC } from "react";

type PlanWeekActionProps = {
  label: string;
};

const PlanWeekAction: FC<PlanWeekActionProps> = ({ label }) => (
  <div className="border-2 border-[--context-color] rounded-md flex justify-center p-1 font-semibold">
    Next Action: {label}
  </div>
);

export default PlanWeekAction;
