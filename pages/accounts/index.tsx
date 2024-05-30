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
  const { accounts, createAccount, addResponsibility } = useAccountsContext();
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
        "Loading accounts..."
      ) : (
        <div>
          <div className="text-left md:text-center">
            Drag to change the priority of your accounts.
          </div>
          <Accordion type="multiple" className="w-full">
            <AccountsList
              accounts={accounts}
              showCurrentOnly
              addResponsibility={addResponsibility}
            />
          </Accordion>
          <div className="mt-8" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="invalid-accounts">
              <AccordionTrigger>
                Show accounts with no current responsibility
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full">
                  <AccountsList
                    accounts={accounts}
                    showInvalidOnly
                    addResponsibility={addResponsibility}
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
