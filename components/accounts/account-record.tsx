import { Account } from "@/api/ContextAccounts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import AccountDetails from "./AccountDetails";

type AccountRecordProps = {
  account: Account;
  className?: string;
  addResponsibility: (
    accountId: string,
    startDate: Date,
    endDate?: Date
  ) => void;
  selectedAccordionItem?: string;
};

const AccountRecord: FC<AccountRecordProps> = ({
  account,
  className,
  addResponsibility,
  selectedAccordionItem,
}) => {
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
      link={`/accounts/${account.id}`}
      accordionSelectedValue={selectedAccordionItem}
      {...attributes}
      {...listeners}
    >
      <AccountDetails account={account} addResponsibility={addResponsibility} />
    </DefaultAccordionItem>
  );
};

export default AccountRecord;
