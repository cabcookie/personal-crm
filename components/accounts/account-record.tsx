import { Account } from "@/api/ContextAccounts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { FC } from "react";
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
      <AccordionTrigger className="font-bold tracking-tight hover:no-underline hover:bg-muted">
        <div className="flex flex-row gap-2 start-0 align-middle">
          <div>{account.name}</div>
          <div className="font-normal">
            <small className="hover:underline">
              <Link href={`/accounts/${account.id}`}>Open</Link>
            </small>
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
