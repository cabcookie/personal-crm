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
import { Responsibility } from "./ResponsibilityRecord";
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
  addResponsibility: (resp: Responsibility) => void;
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
      if (controllerId && controller?.id === controllerId) return true;
      if (controller) return false;
      const currentResponsibility =
        responsibilities.filter(
          ({ startDate, endDate }) =>
            startDate <= new Date() && (!endDate || endDate >= new Date())
        ).length > 0;
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

  const updateOrderNumbers =
    (newIndex: number) =>
    (list: Account[]): Account[] => {
      const current = list[newIndex];
      if (newIndex === 0) return [{ ...current, order: list[1].order + 1000 }];
      if (newIndex === list.length - 1)
        return [{ ...current, order: list[newIndex - 1].order - 1000 }];

      const orderPrev = list[newIndex - 1].order;
      const orderNext = list[newIndex + 1].order;
      const orderBetween =
        orderPrev > orderNext + 1
          ? Math.round((orderPrev + orderNext) / 2)
          : undefined;
      if (orderBetween) return [{ ...current, order: orderBetween }];

      return list
        .filter((_, index) => index <= newIndex)
        .map((account, idx) => ({
          ...account,
          order: orderNext + 1000 * (newIndex - idx + 1),
        }));
    };

  const moveItem = (items: Account[], oldIndex: number) => (newIndex: number) =>
    arrayMove(items, oldIndex, newIndex);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    flow(
      moveItem(items, oldIndex),
      updateOrderNumbers(newIndex),
      updateOrder
    )(newIndex);
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
