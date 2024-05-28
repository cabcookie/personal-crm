import { Context, useContextContext } from "@/contexts/ContextContext";
import ButtonGroup from "../ui-elements/btn-group/btn-group";

export const contexts: Context[] = ["family", "hobby", "work"];

const ContextSwitcher = () => {
  const { context, setContext } = useContextContext();
  return (
    <>
      <strong>Switch Context:</strong>
      <ButtonGroup
        values={contexts}
        selectedValue={context || "family"}
        onSelect={(val: string) => {
          if (!contexts.includes(val as Context)) return;
          setContext(val as Context);
        }}
      />
    </>
  );
};

export default ContextSwitcher;
