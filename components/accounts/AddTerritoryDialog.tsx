import { Account, useAccountsContext } from "@/api/ContextAccounts";
import useTerritories from "@/api/useTerritories";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type AddTerritoryDialogProps = {
  account: Account;
};

const AddTerritoryDialog: FC<AddTerritoryDialogProps> = ({
  account: { territoryIds, ...account },
}) => {
  const { assignTerritory, deleteTerritory } = useAccountsContext();
  const { territories } = useTerritories();
  const [open, setOpen] = useState(false);

  return !territories ? (
    "Loading territories…"
  ) : (
    <div>
      <Label className="font-semibold" htmlFor="territory">
        Territories
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <div>
          <PopoverTrigger asChild>
            <Button
              id="territory"
              variant="outline"
              role="combobox"
              size="sm"
              className="mt-2 w-[150px] justify-start text-muted-foreground font-normal"
            >
              Add territory…
            </Button>
          </PopoverTrigger>
          <div className="m-2">
            {territories
              .filter((t) => territoryIds.some((id) => id === t.id))
              .map(({ id, name }) => (
                <div
                  key={id}
                  className="flex flex-row gap-1 text-sm items-center"
                >
                  {name}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTerritory(account.id, id)}
                  >
                    <Trash2 className=" w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
        <PopoverContent className="p-0" side="right" align="start">
          <Command loop>
            <CommandInput placeholder="Search territory…" />
            <CommandList>
              <CommandEmpty>No territory found.</CommandEmpty>
              <CommandGroup>
                {territories.map(({ id, name }) => (
                  <CommandItem
                    key={id}
                    value={name}
                    onSelect={() => assignTerritory(account.id, id)}
                  >
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddTerritoryDialog;
