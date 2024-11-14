import { cn } from "@/lib/utils";
import { flow, identity } from "lodash/fp";
import { ArrowDown, ArrowUp } from "lucide-react";
import { FC } from "react";

type RenderGrowthProps = {
  lastPeriod: number | undefined;
  currentPeriod: number;
  label: string;
};

const calcGrowth = (currPeriod: number, lastPeriod: number) => {
  const growth = currPeriod / lastPeriod - 1;
  return growth === Infinity ? undefined : growth;
};

const multiply = (a: number) => (b: number) => a * b;
const round = (a: number) => Math.round(a * 10) / 10;

const RenderGrowth: FC<RenderGrowthProps> = ({
  lastPeriod,
  currentPeriod,
  label,
}) => {
  if (!lastPeriod) return <div></div>;
  const growth = calcGrowth(currentPeriod, lastPeriod);
  if (!growth) return <div></div>;
  const Icon = growth > 0 ? ArrowUp : ArrowDown;
  return (
    <div
      className={cn(
        "flex flex-row gap-0.5 justify-end",
        growth > 0 ? "text-green-600" : "text-red-600"
      )}
    >
      <Icon className="w-3 h-3 translate-y-[1px]" />
      <div>{flow(identity<number>, multiply(100), round)(growth)}%</div>
      <div>{label}</div>
    </div>
  );
};

export default RenderGrowth;
