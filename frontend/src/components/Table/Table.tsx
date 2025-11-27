import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import AppIconButton from "../Button/AppIconButton";
import type { IDropdownOption } from "../../types/interfaces/IDropDownProps";
import AppDropdown from "../Dropdown/AppDropdown";
import { ArrowUp, ArrowDown, Search, Plus } from "lucide-react";

interface GenericTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T, any>[]; 
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
    { label: "5 por pág.", value: "5" },
    { label: "10 por pág.", value: "10" },
    { label: "20 por pág.", value: "20" },
    { label: "50 por pág.", value: "50" },
  ];

  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const baseColumns = [...columns];

    if (onEdit || onDelete) {
      baseColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-3"> 
            {onEdit && (
              <AppIconButton
                onClick={() => onEdit(row.original)}
                iconName="Pencil" 
                className="text-blue-600 hover:bg-blue-50"
                title="Editar"
              />
            )}
            {onDelete && (
              <AppIconButton
                onClick={() => onDelete(row.original.id)}
                iconName="Trash"
                className="text-red-600 hover:bg-red-50" 
                title="Excluir"
              />
            )}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [columns, onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns: tableColumns, 
    state: { sorting, pagination, globalFilter },
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
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div>
      <div className="px-6 py-4 flex justify-between bg-gray-100 items-center border-b border-gray-200 ">
        <div className="relative w-72 ">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search size={18} className="text-gray-400" />
           </div>
           <input
            type="text"
            placeholder="Filtrar registros..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary w-full transition-colors"
          />
        </div>

        {onAddClick && (
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={18} />
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none group hover:bg-gray-100 transition-colors ${header.column.id === 'actions' ? 'text-center' : ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className={`flex items-center gap-2 ${header.column.id === 'actions' ? 'justify-center' : ''}`}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="text-gray-400 group-hover:text-gray-600">
                        {header.column.getIsSorted() === "asc"
                          ? <ArrowUp size={14} className="text-primary"/> 
                          : header.column.getIsSorted() === "desc"
                          ? <ArrowDown size={14} className="text-primary"/>
                          : null} 
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-sm text-gray-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-700 hidden sm:block">
          Mostrando <span className="font-medium">{pageIndex * pageSize + 1}</span> até{" "}
          <span className="font-medium">
            {Math.min((pageIndex + 1) * pageSize, totalRows)}
          </span>{" "}
          de <span className="font-medium">{totalRows}</span> resultados
        </div>

        <div className="flex items-center gap-2 flex-1 justify-between sm:justify-end">
           <div className="w-32">
              <AppDropdown
                label={`${pageSize} / pág`}
                options={dropOpt}
                onChange={(e) => {
                  setPagination({ pageIndex: 0, pageSize: Number(e) });
                }}
              />
           </div>
          <div className="flex items-center rounded-md  overflow-hidden">
            <AppIconButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              iconName="ChevronLeft"
              className="rounded-none border-r border-gray-300 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-300"
            />
             <span className="px-4 py-2 text-sm border-l border-r border-gray-300 bg-white font-medium">
                {pageIndex + 1}
             </span>
            <AppIconButton
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              iconName="ChevronRight" 
              className="rounded-none hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-300"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}