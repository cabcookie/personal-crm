import { Toggle } from "@/components/ui/toggle";
import { FC, ReactNode } from "react";

interface FormatBtnProps {
  pressed?: boolean;
  "aria-label"?: string;
  children?: ReactNode;
  onClick?: () => void;
}

const FormatBtn: FC<FormatBtnProps> = ({ children, ...rest }) => (
  <Toggle
    className="text-muted-foreground data-[state=on]:bg-white data-[state=on]:text-accent-foreground"
    size="sm"
    {...rest}
  >
    {children}
  </Toggle>
);

export default FormatBtn;
