import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "./ui/button";
import { LucideProps } from "lucide-react";
import { IconType } from "react-icons/lib";

export const ToggleBtn: FC<TogglePropsBtn> = ({
  onClick,
  isOn,
  labelOn,
  labelOff,
  IconOn,
  IconOff,
}) => (
  <Button variant="outline" size="sm" onClick={onClick}>
    {isOn ? (
      <>
        <IconOn className="size-4 mr-2" />
        {labelOn}
      </>
    ) : (
      <>
        <IconOff className="size-4 mr-2" />
        {labelOff}
      </>
    )}
  </Button>
);

interface TogglePropsBtn {
  isOn: boolean;
  onClick?: () => void;
  labelOn: string;
  labelOff: string;
  IconOn:
    | ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >
    | IconType;
  IconOff:
    | ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >
    | IconType;
}
