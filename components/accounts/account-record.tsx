import { Account, useAccountsContext } from "@/api/ContextAccounts";
import useTerritories from "@/api/useTerritories";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import AccountDetails from "./AccountDetails";

type AccountRecordProps = {
  account: Account;
  className?: string;
  selectedAccordionItem?: string;
  showContacts?: boolean;
  showIntroduction?: boolean;
  showNotes?: boolean;
  showProjects?: boolean;
  showSubsidaries?: boolean;
};

const AccountRecord: FC<AccountRecordProps> = ({
  account,
  className,
  selectedAccordionItem,
  showContacts,
  showIntroduction,
  showNotes,
  showProjects,
  showSubsidaries = true,
}) => {
  const { territories } = useTerritories();
  const { accounts } = useAccountsContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: account.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DefaultAccordionItem
      value={account.id}
      ref={setNodeRef}
      style={style}
      className={className}
      triggerTitle={account.name}
      triggerSubTitle={[
        ...(territories
          ?.filter((t) => account.territoryIds.includes(t.id))
          .map((t) => t.name) || []),
        ...(accounts
          ?.filter((a) => account.id === a.controller?.id)
          .map((a) => a.name) || []),
      ]
        .filter((t) => t !== "")
        .join(", ")}
      link={`/accounts/${account.id}`}
      accordionSelectedValue={selectedAccordionItem}
      {...attributes}
      {...listeners}
    >
      <AccountDetails
        account={account}
        showContacts={showContacts}
        showIntroduction={showIntroduction}
        showNotes={showNotes}
        showProjects={showProjects}
        showSubsidaries={showSubsidaries}
      />
    </DefaultAccordionItem>
  );
};

export default AccountRecord;
