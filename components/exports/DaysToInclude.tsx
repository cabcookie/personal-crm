import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DaysToIncludeProps {
  daysToInclude: number;
  setDaysToInclude: (days: number) => void;
  presets?: number[]; // Days to go back (e.g., [7, 14, 28])
}

export const DaysToInclude: FC<DaysToIncludeProps> = ({
  daysToInclude,
  setDaysToInclude,
  presets = [7, 14, 28],
}) => {
  const handlePresetClick = (days: number) => {
    setDaysToInclude(days);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="days-to-include">Days to Include</Label>
      <div className="space-y-0.5">
        <Input
          id="days-to-include"
          type="number"
          min={1}
          max={365}
          value={daysToInclude}
          onChange={(e) => setDaysToInclude(Number(e.target.value))}
        />
        <div className="ml-1 flex items-baseline">
          <Label className="text-xs">Quick Select:</Label>
          {presets.map((days) => (
            <Button
              key={days}
              variant="link"
              size="sm"
              onClick={() => handlePresetClick(days)}
              className="text-xs"
            >
              {days}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
