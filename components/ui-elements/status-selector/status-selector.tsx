import { FC, useEffect, useState } from "react";
import Select from "react-select";

type StatusSelectorProps = {
  options: string[];
  value: string;
  onChange: (selected: string) => void;
};

const StatusSelector: FC<StatusSelectorProps> = ({
  options,
  value,
  onChange,
}) => {
  const [mappedOptions] = useState(
    options.map((o) => ({
      value: o,
      label: o
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
    }))
  );
  const [selected, setSelected] = useState<any>(
    mappedOptions.find((o) => o.value === value)
  );

  useEffect(() => {
    setSelected(mappedOptions.find((o) => o.value === value));
  }, [mappedOptions, value]);

  const selectStatus = (selectedOption: any) => {
    onChange(selectedOption.value);
  };

  return (
    <Select options={mappedOptions} value={selected} onChange={selectStatus} />
  );
};

export default StatusSelector;
