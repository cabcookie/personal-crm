import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import usePeople from "@/api/usePeople";
import { useContextContext } from "@/contexts/ContextContext";
import { useNavMenuContext } from "@/contexts/NavMenuContext";
import { useCommandState } from "cmdk";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { BiConversation } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { IconType } from "react-icons/lib";
import { PiHandFist } from "react-icons/pi";
import { useCreateInboxItemContext } from "../inbox/CreateInboxItemDialog";
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
  const { isWorkContext } = useContextContext();
  const { menuIsOpen, toggleMenu } = useNavMenuContext();
  const { open: openCreateInboxItemDialog } = useCreateInboxItemContext();
  const { projects } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const { people } = usePeople();
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
    ...(isWorkContext()
      ? [
          { label: "Accounts", url: "/accounts", shortcut: "^A" },
          { label: "Territories", url: "/territories" },
          { label: "CRM Projects", url: "/crm-projects" },
        ]
      : []),
    { label: "Inbox", url: "/inbox", shortcut: "^I" },
  ];

  const Projects = () => {
    const search = useCommandState((state) => state.search);
    if (!search) return null;
    if (!projects) return null;
    return (
      <CommandGroup heading="Projects">
        {projects.map((p) => (
          <CommandItem
            key={p.id}
            value={`${p.project} ${accounts
              ?.filter((a) => p.accountIds.includes(a.id))
              .map((a) => a.name)
              .join(", ")}`}
            onSelect={() => {
              router.push(`/projects/${p.id}`);
              toggleMenu();
            }}
          >
            {p.project} (
            {accounts
              ?.filter((a) => p.accountIds.includes(a.id))
              .map((a) => a.name)
              .join(", ")}
            )
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  const People = () => {
    const search = useCommandState((state) => state.search);
    if (!search) return null;
    if (!people) return null;
    return (
      <CommandGroup heading="People">
        {people.map((p) => (
          <CommandItem
            key={p.id}
            onSelect={() => {
              router.push(`/people/${p.id}`);
              toggleMenu();
            }}
          >
            {p.name}
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  const Accounts = () => {
    const search = useCommandState((state) => state.search);
    if (!search) return null;
    if (!accounts) return null;
    return (
      <CommandGroup heading="Accounts">
        {accounts.map((a) => (
          <CommandItem
            key={a.id}
            onSelect={() => {
              router.push(`/accounts/${a.id}`);
              toggleMenu();
            }}
          >
            {a.name}
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

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
        <Projects />
        <Accounts />
        <People />
        <CommandItem forceMount onSelect={openCreateInboxItemDialog}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Create Inbox Item</span>
        </CommandItem>
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
