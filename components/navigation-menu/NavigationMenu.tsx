import { useNavMenuContext } from "@/contexts/NavMenuContext";
import { useRouter } from "next/router";
import { BiConversation } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { IconType } from "react-icons/lib";
import { PiHandFist } from "react-icons/pi";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";
import Version from "../version/version";
import ContextSwitcher from "./ContextSwitcher";

type NavigationItem = {
  label: string;
  Icon?: IconType;
  shortcut?: string;
  url?: string;
};

const NavigationMenu = () => {
  const { menuIsOpen, toggleMenu } = useNavMenuContext();
  const router = useRouter();

  const mainNavigation: NavigationItem[] = [
    {
      label: "Today's Tasks",
      shortcut: "^T",
      Icon: GoTasklist,
      url: "/today",
    },
    {
      label: "Meetings",
      shortcut: "^M",
      Icon: BiConversation,
      url: "/meetings",
    },
    {
      label: "Commitments",
      shortcut: "^C",
      Icon: PiHandFist,
      url: "/commitments",
    },
  ];

  const otherNavigation: NavigationItem[] = [
    { label: "Projects", url: "/projects", shortcut: "^P" },
    { label: "Accounts", url: "/accounts", shortcut: "^A" },
    { label: "CRM Projects", url: "/crm-projects" },
    { label: "Inbox", url: "/inbox", shortcut: "^I" },
  ];

  return (
    <CommandDialog open={menuIsOpen} onOpenChange={toggleMenu}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandSeparator />
        <CommandItem>
          <ContextSwitcher />
        </CommandItem>
        <CommandSeparator />
        <CommandGroup heading="Suggestions">
          {mainNavigation.map(({ label, Icon, url, shortcut }, index) => (
            <CommandItem
              key={index}
              onSelect={() => {
                if (!url) return;
                router.push(url);
              }}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{label}</span>
              {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Others">
          {otherNavigation.map(({ label, Icon, url, shortcut }, index) => (
            <CommandItem
              key={index}
              onSelect={() => {
                if (!url) return;
                router.push(url);
              }}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{label}</span>
              {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandItem onSelect={() => {}}>
          <div className="px-2 text-muted-foreground text-xs">
            <Version />
          </div>
        </CommandItem>
      </CommandList>
    </CommandDialog>
  );
};

export default NavigationMenu;
