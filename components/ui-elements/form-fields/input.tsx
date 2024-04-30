import { FC, ReactNode } from "react";

type InputProps = {
  value: string;
  onChange: (val: string) => void;
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  autoFocus?: boolean;
};

const Input: FC<InputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  className,
  autoFocus,
  labelClassName,
  inputClassName,
}) => {
  return (
    <div className={className}>
      {label && <div className={labelClassName}>{label}</div>}
      <input
        className={inputClassName}
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
