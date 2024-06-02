import { Account } from "@/api/ContextAccounts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { FC } from "react";
import { BiLinkExternal } from "react-icons/bi";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import AccountDetails from "./AccountDetails";

type AccountRecordProps = {
  account: Account;
  className?: string;
  addResponsibility: (
    accountId: string,
    startDate: Date,
    endDate?: Date
  ) => void;
};

const AccountRecord: FC<AccountRecordProps> = ({
  account,
  className,
  addResponsibility,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: account.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <AccordionItem
      value={account.id}
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
    >
      <AccordionTrigger className="font-bold tracking-tight">
        <div className="flex flex-row gap-2 start-0 align-middle">
          <div>{account.name}</div>
          <Link
            href={`/accounts/${account.id}`}
            className="mt-1 text-muted-foreground hover:text-primary"
          >
            <BiLinkExternal />
          </Link>
          <div className="font-normal space-x-2">
            <small className="font-normal">(Prio: {account.priority})</small>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <AccountDetails
          account={account}
          addResponsibility={addResponsibility}
        />
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccountRecord;
