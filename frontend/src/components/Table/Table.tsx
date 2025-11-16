import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import AppIconButton from "../Button/AppIconButton";
import type { IDropdownOption } from "../../types/IDropDownProps";
import AppDropdown from "../Dropdown/AppDropdown";
import { ArrowUp, ArrowDown } from "lucide-react";

interface GenericTableProps<T extends { id: string }> {
  data: T[];
  columns: {
    accessorKey: keyof T;
    header: string;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onAddClick?: () => void;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onAddClick,
}: GenericTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const dropOpt: IDropdownOption[] = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "30", value: "30" },
    { label: "40", value: "40" },
    { label: "50", value: "50" },
  ];

  const tableColumns: ColumnDef<T>[] = [
    ...columns.map((col) => ({
      accessorKey: col.accessorKey as string,
      header: col.header,
    })),
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <AppIconButton
              onClick={() => {
                console.log(row.original);
              }}
              iconName="Trash"
            />
          )}
          {onDelete && (
            <AppIconButton
              onClick={() => {
                console.log(row.original.id);
              }}
              iconName="Trash"
            />
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
  });

  const { pageIndex, pageSize } = pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {onAddClick && (
          <AppIconButton
            onClick={() => {
              console.log("oiii");
            }}
            iconName="Trash"
          />
        )}

        <input
          type="text"
          placeholder="Filtrar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <table className="w-full border text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left border px-2 py-1 cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc"
                    ? <ArrowUp size={15}/>
                    : header.column.getIsSorted() === "desc"
                    ? <ArrowDown size={15}/>
                    : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 justify-end mt-2 flex-nowrap w-[400px]">
        <AppIconButton
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          iconName="ArrowLeftToLine"
        />
        <AppIconButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          iconName="ArrowLeft"
        />
        <span>
          Página{" "}
          <strong>
            {pageIndex + 1} de {table.getPageCount()}
          </strong>
        </span>
        <AppIconButton
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          iconName="ArrowRight"
        />

        <AppIconButton
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          iconName="ArrowRightToLine"
        />
        <AppDropdown
          label="Teste"
          options={dropOpt}
          onChange={(e) => {
            console.log(e, 888);
            setPagination({ pageIndex: 0, pageSize: Number(e) });
          }}
        ></AppDropdown>
      </div>
    </div>
  );
}
