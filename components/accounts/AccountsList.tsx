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
import AccountRecord from "./account-record";

type ShowInvalidOnly = {
  showCurrentOnly?: false;
  showInvalidOnly: true;
  controllerId?: never;
};

type ShowCurrentOnly = {
  showCurrentOnly: true;
  showInvalidOnly?: false;
  controllerId?: never;
};

type ShowSubsidaries = {
  showCurrentOnly?: false;
  showInvalidOnly?: false;
  controllerId: string;
};

type AccountsListProps = (
  | ShowInvalidOnly
  | ShowCurrentOnly
  | ShowSubsidaries
) & {
  accounts: Account[];
  addResponsibility: (
    accountId: string,
    startDate: Date,
    endDate?: Date
  ) => void;
};

type GetSortedAccountsProps = {
  accounts: Account[];
  controllerId?: string;
  showCurrentOnly?: boolean;
  showInvalidOnly?: boolean;
};

const getSortedAccounts = ({
  accounts,
  controllerId,
  showCurrentOnly,
  showInvalidOnly,
}: GetSortedAccountsProps) =>
  accounts
    .filter(({ controller, responsibilities }) => {
      if (controllerId && controller && controller.id === controllerId)
        return true;
      if (controller) return false;
      const currentResponsibility = responsibilities.some(
        ({ startDate, endDate }) =>
          startDate <= new Date() && (!endDate || endDate >= new Date())
      );
      return (
        (showCurrentOnly && currentResponsibility) ||
        (showInvalidOnly && !currentResponsibility)
      );
    })
    .sort((a, b) =>
      a.order === b.order
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.order - a.order
    );

const AccountsList: FC<AccountsListProps> = ({
  accounts,
  showCurrentOnly,
  showInvalidOnly,
  controllerId,
  addResponsibility,
}) => {
  const { updateOrder } = useAccountsContext();
  const [items, setItems] = useState(
    getSortedAccounts({
      accounts,
      controllerId,
      showCurrentOnly,
      showInvalidOnly,
    })
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  useEffect(
    () =>
      setItems(
        getSortedAccounts({
          accounts,
          controllerId,
          showCurrentOnly,
          showInvalidOnly,
        })
      ),
    [accounts, controllerId, showCurrentOnly, showInvalidOnly]
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
              addResponsibility={addResponsibility}
              className="px-2"
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default AccountsList;
