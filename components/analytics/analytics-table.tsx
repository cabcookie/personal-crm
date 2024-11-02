import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { get } from "lodash/fp";
import { useState } from "react";

interface AnalyticsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const stickyCss =
  "left-0 bg-inherit opacity-95 sticky z-20 shadow-[inset_-4px_0_4px_-4px_lightgray]" as const;

const AnalyticsTable = <TData, TValue>({
  columns,
  data,
}: AnalyticsTableProps<TData, TValue>) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const table = useReactTable({
    data,
    columns,
    state: { expanded, columnVisibility: { id: false, isReseller: false } },
    onExpandedChange: setExpanded,
    getSubRows: (row) => get("children")(row),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-white">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    header.id === "accountOrPayer" &&
                      `font-semibold ${stickyCss}`,
                    header.id !== "accountOrPayer" && "text-right"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                row.depth === 0 ? "bg-white" : "bg-slate-50",
                "hover:bg-slate-100"
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    cell.id.includes("accountOrPayer") &&
                      cn(
                        row.depth === 0 ? "font-semibold" : "pl-2 md:pl-4",
                        stickyCss
                      ),
                    !cell.id.includes("accountOrPayer") && "text-right",
                    !cell.id.includes("accountOrPayer") &&
                      row.depth === 0 &&
                      "cursor-pointer"
                  )}
                  onClick={
                    cell.id.includes("accountOrPayer")
                      ? undefined
                      : row.getToggleExpandedHandler()
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnalyticsTable;
