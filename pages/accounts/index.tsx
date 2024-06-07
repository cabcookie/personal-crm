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
import { useState } from "react";

const AccountsListPage = () => {
  const { accounts, createAccount, addResponsibility } = useAccountsContext();
  const [validAccountsValue, setValidAccountsValue] = useState<
    string | undefined
  >(undefined);
  const [invalidAccountsValue, setInvalidAccountsValue] = useState<
    string | undefined
  >(undefined);

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
          <Accordion
            type="single"
            collapsible
            value={validAccountsValue}
            onValueChange={setValidAccountsValue}
          >
            <AccountsList
              accounts={accounts}
              showCurrentOnly
              addResponsibility={addResponsibility}
              selectedAccordionItem={validAccountsValue}
            />
          </Accordion>
          <div className="mt-8" />
          <Accordion type="single" collapsible>
            <AccordionItem value="invalid-accounts">
              <AccordionTrigger>
                Show accounts with no current responsibility
              </AccordionTrigger>
              <AccordionContent>
                <Accordion
                  type="single"
                  collapsible
                  value={invalidAccountsValue}
                  onValueChange={setInvalidAccountsValue}
                >
                  <AccountsList
                    accounts={accounts}
                    showInvalidOnly
                    addResponsibility={addResponsibility}
                    selectedAccordionItem={invalidAccountsValue}
                  />
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </MainLayout>
  );
};

export default AccountsListPage;
