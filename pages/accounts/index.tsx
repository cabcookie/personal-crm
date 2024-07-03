import { useAccountsContext } from "@/api/ContextAccounts";
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
