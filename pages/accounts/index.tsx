import { useAccountsContext } from "@/api/ContextAccounts";
import useTerritories from "@/api/useTerritories";
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
  const { territories } = useTerritories();
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
          <div className="text-left md:text-center">
            Drag to change the priority of your accounts.
          </div>
          <AccountsList
            accounts={accounts.filter(
              (a) =>
                !a.controller &&
                territories?.some(
                  (t) => t.latestQuota > 0 && a.territoryIds.includes(t.id)
                )
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
                    (a) =>
                      !a.controller &&
                      !territories?.some(
                        (t) =>
                          t.latestQuota > 0 && a.territoryIds.includes(t.id)
                      )
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
