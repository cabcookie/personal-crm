import { Context, useContextContext } from "@/contexts/ContextContext";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import { Label } from "../ui/label";

export const contexts: Context[] = ["family", "hobby", "work"];

const ContextSwitcher = () => {
  const { context, setContext } = useContextContext();
  return (
    <>
      <Label htmlFor="context-switcher" className="font-semibold">
        Switch context
      </Label>
      <ButtonGroup
        elementId="context-switcher"
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
