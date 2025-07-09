import { LucideProps } from "lucide-react";
import {
  FC,
  ForwardRefExoticComponent,
  MouseEvent,
  RefAttributes,
} from "react";
import { IconType } from "react-icons/lib";

interface ButtonInAccordionProps {
  Icon:
    | ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >
    | IconType;
  label?: string;
  onClick?: () => void;
}

export const ButtonInAccordion: FC<ButtonInAccordionProps> = ({
  Icon,
  label,
  onClick,
}) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.();
  };

  return (
    <div
      className="flex gap-0.5 items-center text-muted-foreground hover:text-orange-500 cursor-pointer"
      onClick={handleClick}
    >
      <Icon className="size-4" />
      <span className="font-normal text-sm">{label}</span>
    </div>
  );
};
