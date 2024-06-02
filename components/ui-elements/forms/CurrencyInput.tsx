import { Input } from "@/components/ui/input";
import { usdCurrency } from "@/helpers/functional";
import { ChangeEvent, FC, useState } from "react";

type CurrentInputProps = {
  value: number;
  onChange: (...event: any[]) => void;
};

const CurrencyInput: FC<CurrentInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    props.onChange(Number(e.target.value.replace(/[^\d]/g, "")));

  return (
    <Input
      value={isFocused ? props.value : usdCurrency.format(props.value)}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

CurrencyInput.displayName = "CurrencyInput";

export default CurrencyInput;
