# NextJS 14 Pages Router Development Guidelines

This project uses **NextJS 14 with the Pages Router** architecture. This Cline rule provides comprehensive guidance for working with NextJS 14 Pages Router patterns.

## Context7 Integration for NextJS Documentation

**IMPORTANT**: Always use context7 to access the latest NextJS documentation before implementing any NextJS features. This ensures accuracy and adherence to current best practices.

### Using Context7 for NextJS Documentation

```bash
# Use context7 to get NextJS documentation
context7_library_id: "/vercel/next.js"
```

When working with NextJS features, follow this pattern:

1. **First**: Use context7 to get relevant documentation for the feature you're implementing
2. **Then**: Apply the patterns to your specific use case
3. **Always**: Reference the official documentation patterns over assumptions

## Project Structure (Pages Router)

This project follows the Pages Router structure:

```
pages/
├── _app.tsx           # Custom App component
├── _document.tsx      # Custom Document
├── index.tsx          # Home page (/)
├── accounts/          # Accounts pages
├── projects/          # Projects pages
├── ...
└── [...slug].tsx      # Catch-all routes
```

## Page Components (Pages Router)

### Basic Page Structure

```typescript
// pages/accounts/index.tsx
import { useAccountsContext } from "@/api/ContextAccounts";      // data is being fetched using React Context or Hooks
import AccountsList from "@/components/accounts/AccountsList";
import MainLayout from "@/components/layouts/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/router";

const AccountsListPage = () => {
  const { accounts, createAccount } = useAccountsContext();
  const router = useRouter();

  const createAndOpenNewAccount = async () => {
    const account = await createAccount("New Account");
    if (!account) return;
    router.push(`/accounts/${account.id}`);
  };

  return (
    <MainLayout
      title="Accounts"
      sectionName="Accounts"
      addButton={{ label: "New", onClick: createAndOpenNewAccount }}
    >
      {!accounts ? (
        "Loading accounts…"
      ) : (
        <div>
          <AccountsList
            showProjects
            showContacts
            accounts={accounts.filter(
              (a) => !a.controller && a.latestQuota > 0
            )}
          />
          <div className="mt-8" />
          <Accordion type="single" collapsible>
            <AccordionItem value="invalid-accounts">
              <AccordionTrigger>
                Show accounts with no current responsibility
              </AccordionTrigger>
              <AccordionContent>
                <AccountsList
                  showProjects
                  showContacts
                  accounts={accounts.filter(
                    (a) => !a.controller && a.latestQuota === 0
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </MainLayout>
  );
};

export default AccountsListPage;
```

### Dynamic Pages

```typescript
// pages/accounts/[id].tsx
import { Account, useAccountsContext } from "@/api/ContextAccounts";
import AccountDetails from "@/components/accounts/AccountDetails";
import MainLayout from "@/components/layouts/MainLayout";
import { flow } from "lodash/fp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AccountDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const accountId = Array.isArray(id) ? id[0] : id;
  const { getAccountById } = useAccountsContext();
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [updateAccountFormOpen, setUpdateAccountFormOpen] = useState(false);

  useEffect(() => {
    flow(getAccountById, setAccount)(accountId);
  }, [accountId, getAccountById]);

  const handleBackBtnClick = () => {
    router.push("/accounts");
  };

  return (
    <MainLayout
      title={`${account?.name || "Loading…"}${
        !account?.controller ? "" : ` (Parent: ${account.controller.name})`
      }`}
      recordName={account?.name}
      sectionName="Accounts"
      onBackBtnClick={handleBackBtnClick}
      addButton={{
        label: "Edit",
        onClick: () => setUpdateAccountFormOpen(true),
      }}
    >
      {!account ? (
        "Loading account..."
      ) : (
        <AccountDetails
          account={account}
          showIntroduction
          showProjects
          showContacts
          showAwsAccounts
          showFinancials
          showResellerFinancials
          showTerritories
          updateFormControl={{
            open: updateAccountFormOpen,
            setOpen: setUpdateAccountFormOpen,
          }}
        />
      )}
    </MainLayout>
  );
};

export default AccountDetailPage;
```

## Using Layouts

```typescript
// components/layouts/MainLayout.tsx
import CategoryTitle, { CategoryTitleProps } from "@/components/CategoryTitle";
import Header from "@/components/header/Header";
import NavigationMenu from "@/components/navigation-menu/NavigationMenu";
import { Context, useContextContext } from "@/contexts/ContextContext";
import {
  NavMenuContextProvider,
  useNavMenuContext,
} from "@/contexts/NavMenuContext";
import { addKeyDownListener } from "@/helpers/keyboard-events/main-layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import CreateInboxItemDialog from "../inbox/CreateInboxItemDialog";

type MainLayoutProps = CategoryTitleProps & {
  context?: Context;
  recordName?: string;
  sectionName: string;
  children: ReactNode;
};

const MainLayoutInner: FC<MainLayoutProps> = ({
  children,
  recordName,
  sectionName,
  context: propsContext,
  ...categoryTitleProps
}) => {
  const { toggleMenu } = useNavMenuContext();
  const [isOpen, setIsOpen] = useState(false);
  const { context: storedContext, setContext } = useContextContext();
  const context = propsContext || storedContext || "family";
  const router = useRouter();

  useEffect(
    () =>
      addKeyDownListener(router, setContext, toggleMenu, () => setIsOpen(true)),
    [router, setContext, toggleMenu]
  );

  return (
    <>
      <Head>
        <title>{`Impulso ${
          recordName ? `- ${recordName}` : ""
        } · ${sectionName}`}</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full">
        <Header context={context} />
        <NavigationMenu />
        <main className="w-full xl:w-[64rem]">
          <div className="flex flex-col pb-0">
            <div className="px-2 md:px-8 lg:px-16 mb-4 md:mb-8">
              <div className="relative flex flex-col flex-1">
                <CategoryTitle {...(categoryTitleProps || {})} />
                <div className="flex flex-col flex-1 relative">{children}</div>
              </div>
            </div>
          </div>
          <CreateInboxItemDialog open={isOpen} onOpenChange={setIsOpen} />
        </main>
      </div>
    </>
  );
};

const MainLayout: FC<MainLayoutProps> = (props) => (
  <NavMenuContextProvider>
    <MainLayoutInner {...props} />
  </NavMenuContextProvider>
);

export default MainLayout;
```

## Routing and Navigation

### Using Next.js Link Component

```typescript
import Link from 'next/link'

function Navigation() {
  return (
    <nav>
      {/* Basic link */}
      <Link href="/dashboard">
        Dashboard
      </Link>

      {/* Dynamic link */}
      <Link href={`/posts/${postId}`}>
        View Post
      </Link>

      {/* Link with query parameters */}
      <Link
        href={{
          pathname: '/search',
          query: { q: 'nextjs', category: 'web' }
        }}
      >
        Search
      </Link>

      {/* External link */}
      <Link href="https://nextjs.org" target="_blank" rel="noopener">
        Next.js Docs
      </Link>
    </nav>
  )
}
```

### Programmatic Navigation

```typescript
import { useRouter } from 'next/router'
import { useCallback } from 'react'

function MyComponent() {
  const router = useRouter()

  const handleNavigation = useCallback(async () => {
    // Simple navigation
    await router.push('/dashboard')

    // Navigation with query
    await router.push({
      pathname: '/search',
      query: { term: 'react' }
    })

    // Replace current entry in history
    await router.replace('/login')

    // Go back
    router.back()
  }, [router])

  return (
    <button onClick={handleNavigation}>
      Navigate
    </button>
  )
}
```

## Data Fetching (Pages Router)

We are fetching data and cache them with SWR. This gives us the opportunity to update data, optimistically update the UI, and then re-validate/update the UI after the API response.

### Using Hooks

```typescript
// api/useMeeting.ts
import { type Schema } from "@/amplify/data/resource";
import { Context } from "@/contexts/ContextContext";
import { generateClient } from "aws-amplify/data";
import { useRouter } from "next/router";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { mapMeeting } from "./useMeetings";
const client = generateClient<Schema>();

export type Meeting = {
  id: string;
  topic: string;
  context?: Context;
  meetingOn: Date;
  participantIds: string[];
};

export const meetingSelectionSet = [
  "id",
  "topic",
  "context",
  "meetingOn",
  "createdAt",
  "participants.id",
] as const;

type MeetingData = SelectionSet<
  Schema["Meeting"]["type"],
  typeof meetingSelectionSet
>;

export type MeetingUpdateProps = {
  meetingOn: Date;
  title: string;
};

const fetchMeeting = (meetingId?: string) => async () => {
  if (!meetingId) return;
  const { data, errors } = await client.models.Meeting.get(
    { id: meetingId },
    { selectionSet: meetingSelectionSet }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading meeting");
    throw errors;
  }
  if (!data) throw new Error("fetchMeeting didn't retrieve data");
  try {
    return mapMeeting(data);
  } catch (error) {
    console.error("fetchMeeting", { error });
    throw error;
  }
};

const useMeeting = (meetingId?: string) => {
  const {
    data: meeting,
    error: errorMeeting,
    isLoading: loadingMeeting,
    mutate: mutateMeeting,
  } = useSWR(`/api/meetings/${meetingId}`, fetchMeeting(meetingId));
  const router = useRouter();

  const updateMeeting = async ({ meetingOn, title }: MeetingUpdateProps) => {
    if (!meeting) return;
    const updated: Meeting = { ...meeting, topic: title, meetingOn };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.Meeting.update({
      id: meeting.id,
      topic: title,
      meetingOn: toISODateTimeString(meetingOn),
    });
    if (errors) handleApiErrors(errors, "Error updating the meeting");
    mutateMeeting(updated);
    return data?.id;
  };

  const createMeetingParticipant = async (personId: string) => {
    if (!meeting) return;

    const updated: Meeting = {
      ...meeting,
      participantIds: [...(meeting?.participantIds || []), personId],
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.MeetingParticipant.create({
      personId,
      meetingId: meeting.id,
      createdAt: newDateTimeString(),
    });
    if (errors) handleApiErrors(errors, "Error creating meeting participant");
    mutateMeeting(updated);
    return data?.meetingId;
  };

  const getMeetingParticipantId = (personId: string) => {
    if (!meeting) return;
    return meeting.participantMeetingIds[
      meeting.participantIds.findIndex((id) => id === personId)
    ];
  };

  const removeMeetingParticipant = async (personId: string) => {
    if (!meeting) return;
    const updated: Meeting = {
      ...meeting,
      participantIds: meeting.participantIds.filter((id) => id !== personId),
    };
    mutateMeeting(updated, false);
    const meetingParticipantId = getMeetingParticipantId(personId);
    if (!meetingParticipantId) return;
    const { data, errors } = await client.models.MeetingParticipant.delete({
      id: meetingParticipantId,
    });
    if (errors)
      handleApiErrors(errors, "Error deleting entry meeting participant");
    mutateMeeting(updated);
    return data?.id;
  };

  const deleteMeeting = async () => {
    if (!meeting) return;
    const { data, errors } = await client.models.Meeting.delete({
      id: meeting.id,
    });
    if (errors) handleApiErrors(errors, "Deleting meeting failed");
    if (data)
      // handle delete
      router.replace("/meetings");
  };

  return {
    meeting,
    errorMeeting,
    loadingMeeting,
    updateMeeting,
    createMeetingParticipant,
    removeMeetingParticipant,
    deleteMeeting,
  };
};

export default useMeeting;
```

## Context7 Usage Patterns

### Getting NextJS Documentation

Always use context7 before implementing NextJS features:

```typescript
// Example: Before implementing API routes
// 1. Get documentation from context7
const apiRoutesDocs = await context7.getLibraryDocs({
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "api routes pages router",
  tokens: 5000,
});

// 2. Apply patterns from documentation to your implementation
```

### Common Context7 Queries for NextJS

Use these specific topics when querying context7:

- `"pages router routing"` - For routing patterns
- `"dynamic routes pages"` - For dynamic routing
- `"link component navigation"` - For navigation patterns
