import { Account, useAccountsContext } from "@/api/ContextAccounts";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import { Accordion } from "../ui/accordion";
import AccountRecord from "./account-record";

type AccountsListProps = {
  controllerId?: string;
  accounts: Account[];
  showContacts?: boolean;
  showIntroduction?: boolean;
  showNotes?: boolean;
  showProjects?: boolean;
  showSubsidaries?: boolean;
};

const getSortedAccounts = (accounts: Account[], controllerId?: string) =>
  accounts
    .filter(
      ({ controller }) =>
        !controllerId || (controller && controller.id === controllerId)
    )
    .sort((a, b) =>
      a.order === b.order
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.order - a.order
    );

const AccountsList: FC<AccountsListProps> = ({
  accounts,
  controllerId,
  showContacts,
  showIntroduction,
  showNotes,
  showProjects,
  showSubsidaries = true,
}) => {
  const { updateOrder } = useAccountsContext();
  const [items, setItems] = useState(getSortedAccounts(accounts, controllerId));
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(
    undefined
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  useEffect(
    () => setItems(getSortedAccounts(accounts, controllerId)),
    [accounts, controllerId]
  );

  const updateOrderNumbers = (list: Account[]): Account[] =>
    list.map((account, idx) => ({
      ...account,
      order: (list.length - idx) * 10,
    }));

  const moveItem = (items: Account[], oldIndex: number) => (newIndex: number) =>
    arrayMove(items, oldIndex, newIndex);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    flow(moveItem(items, oldIndex), updateOrderNumbers, updateOrder)(newIndex);
  };

  return items.length === 0 ? (
    "No accounts"
  ) : (
    <Accordion
      type="single"
      collapsible
      value={selectedAccount}
      onValueChange={(val) =>
        setSelectedAccount(val === selectedAccount ? undefined : val)
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div>
            {items.map((account) => (
              <AccountRecord
                key={account.id}
                account={account}
                className="px-2"
                selectedAccordionItem={selectedAccount}
                showContacts={showContacts}
                showIntroduction={showIntroduction}
                showNotes={showNotes}
                showProjects={showProjects}
                showSubsidaries={showSubsidaries}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Accordion>
  );
};

export default AccountsList;
