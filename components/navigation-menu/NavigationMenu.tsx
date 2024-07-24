import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import useMeetings from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { useContextContext } from "@/contexts/ContextContext";
import { useNavMenuContext } from "@/contexts/NavMenuContext";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { KeyboardEventHandler, useState } from "react";
import {
  BiCalendarEvent,
  BiCalendarWeek,
  BiConversation,
} from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { IconType } from "react-icons/lib";
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
import { DialogDescription, DialogTitle } from "../ui/dialog";
import ContextSwitcher from "./ContextSwitcher";
import SearchableDataGroup from "./SearchableDataGroup";

type UrlNavigationItem = {
  url: string;
  action?: never;
  forceMount?: never;
};

type ActionNavigationItem = {
  url?: never;
  action: (value: string) => void;
  forceMount?: boolean;
};

type NavigationItem = (UrlNavigationItem | ActionNavigationItem) & {
  label: string;
  Icon?: IconType;
  shortcut?: string;
};

const NavigationMenu = () => {
  const { isWorkContext, context } = useContextContext();
  const { menuIsOpen, toggleMenu } = useNavMenuContext();
  const { open: openCreateInboxItemDialog } = useCreateInboxItemContext();
  const { projects, createProject } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const { people, createPerson } = usePeople();
  const { createMeeting } = useMeetings({ context });
  const [metaPressed, setMetaPressed] = useState(false);
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
      label: "Daily Planning",
      shortcut: "^D",
      Icon: BiCalendarEvent,
      url: "/planday",
    },
    {
      label: "Weekly Planning",
      shortcut: "^K",
      Icon: BiCalendarWeek,
      url: "/planweek",
    },
    // {
    //   label: "Commitments",
    //   shortcut: "^C",
    //   Icon: PiHandFist,
    //   url: "/commitments",
    // },
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

  const createAndOpenMeeting = async () => {
    const meetingId = await createMeeting("New Meeting", context);
    if (!meetingId) return;
    router.push(`/meetings/${meetingId}`);
  };

  const createAndOpenPerson = async () => {
    const personId = await createPerson("New Person");
    if (!personId) return;
    router.push(`/people/${personId}`);
  };

  const createAndOpenProject = async () => {
    const project = await createProject("New Project");
    if (!project) return;
    router.push(`/projects/${project.id}`);
    toggleMenu();
  };

  const createItemsNavigation: NavigationItem[] = [
    {
      label: "Inbox Item",
      action: openCreateInboxItemDialog,
      forceMount: true,
    },
    { label: "Meeting", action: createAndOpenMeeting },
    { label: "Person", action: createAndOpenPerson },
    { label: "Project", action: createAndOpenProject },
  ];

  const keyboardEventHandler: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.metaKey && !event.altKey && !event.shiftKey) setMetaPressed(true);
    else if (event.key === "Enter") return;
    else setMetaPressed(false);
  };

  const routeToUrl = (url?: string) => () => {
    if (!url) return;
    if (metaPressed) window.open(url, "_blank");
    else router.push(url);
  };

  return (
    <CommandDialog open={menuIsOpen} onOpenChange={toggleMenu}>
      <VisuallyHidden.Root asChild>
        <DialogTitle>The Navigation Menu</DialogTitle>
      </VisuallyHidden.Root>
      <VisuallyHidden.Root asChild>
        <DialogDescription>
          Here you can jump into different parts of the applicatoon including
          meetings, people, accounts, and projects.
        </DialogDescription>
      </VisuallyHidden.Root>
      <CommandInput
        placeholder="Type a command or search…"
        onKeyDown={keyboardEventHandler}
        onKeyUp={keyboardEventHandler}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandSeparator />
        <CommandItem>
          <ContextSwitcher />
        </CommandItem>
        <CommandSeparator />
        <CommandGroup heading="Suggestions">
          {mainNavigation.map(({ label, Icon, url, shortcut }, index) => (
            <CommandItem key={index} onSelect={routeToUrl(url)}>
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{label}</span>
              {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Others">
          {otherNavigation.map(({ label, Icon, url, shortcut }, index) => (
            <CommandItem key={index} onSelect={routeToUrl(url)}>
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{label}</span>
              {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
        <SearchableDataGroup
          heading="Accounts"
          metaPressed={metaPressed}
          items={accounts?.map(({ id, name }) => ({
            id,
            value: name,
            link: `/accounts/${id}`,
          }))}
        />
        <SearchableDataGroup
          heading="People"
          metaPressed={metaPressed}
          items={people?.map(({ id, name }) => ({
            id,
            value: name,
            link: `/people/${id}`,
          }))}
        />
        <SearchableDataGroup
          heading="Projects"
          metaPressed={metaPressed}
          items={projects
            ?.filter((p) => !p.done)
            .map(({ id, project, accountIds }) => ({
              id,
              value: `${project} (${accounts
                ?.filter((a) => accountIds.includes(a.id))
                .map((a) => a.name)
                .join(", ")})`,
              link: `/projects/${id}`,
            }))}
        />
        {createItemsNavigation.map(({ label, action, forceMount }, index) => (
          <CommandItem key={index} forceMount={forceMount} onSelect={action}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create {label}</span>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default NavigationMenu;
