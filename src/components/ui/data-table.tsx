import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpNarrowWide, ArrowDownNarrowWide } from "lucide-react";

interface DataTableMeta {
  toggleRowExpanded: (rowId: string, e?: React.MouseEvent) => void;
  expandedRows: Record<string, boolean>;
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> extends DataTableMeta {}
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  pageSize?: number;
  columnBorders?: boolean;
  enableResizing?: boolean;
  renderExpandedRow?: (row: any) => React.ReactNode;
}

// Add some CSS for the resizable table
const tableStyles = `
  table {
    width: 100%;
    border-spacing: 0;
    table-layout: fixed;
  }

  .resizing {
    cursor: col-resize;
    user-select: none;
  }

  .resize-handle {
    display: inline-block;
    position: absolute;
    width: 4px;
    height: 100%;
    right: 0;
    top: 0;
    background-color: transparent;
    cursor: col-resize;
    touch-action: none;
    z-index: 10;
  }

  .resize-handle:hover,
  .resize-handle.resizing {
    background-color: rgba(23, 37, 84, 0.2);
  }
`;

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = false,
  pageSize = 10,
  columnBorders = true,
  enableResizing = true,
  renderExpandedRow,
}: DataTableProps<TData, TValue>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRowExpanded = (rowId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Make this function available to the table context
  const tableContext = React.useMemo(() => ({
    toggleRowExpanded
  }), []);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    ...(pagination ? { initialState: { pagination: { pageSize } } } : {}),
    enableColumnResizing: enableResizing,
    meta: {
      toggleRowExpanded, // Make the toggle function available in column definitions
      expandedRows, // Make expanded state available too
    },
  });

  return (
    <div className="rounded-md border overflow-hidden bg-card shadow-sm">
      <style>{tableStyles}</style>
      <div className="relative w-full">
        <Table
          className="w-full"
        >
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  style={{
                    position: "relative",
                    ...(columnBorders ? { borderRight: "1px solid var(--border)" } : {}),
                    width: header.getSize(),
                  }}
                  className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                >
                  <div className="flex items-center justify-between gap-1 pr-4 overflow-hidden">
                    <div className="truncate">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {header.column.getCanSort() ? {
                        asc: <ArrowUpNarrowWide className="h-3.5 w-3.5 text-primary" />,
                        desc: <ArrowDownNarrowWide className="h-3.5 w-3.5 text-primary" />,
                      }[header.column.getIsSorted() as string] : null}
                    </div>
                  </div>
                  {enableResizing && header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resize-handle ${header.column.getIsResizing() ? "resizing" : ""}`}
                    ></div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  className={`hover:bg-muted/30 transition-colors ${expandedRows[row.id] ? 'bg-muted/20' : ''}`}
                  style={{cursor: 'default'}}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      style={{
                        ...(columnBorders ? { borderRight: "1px solid var(--border)" } : {}),
                        width: cell.column.getSize(),
                      }}
                      className="overflow-hidden"
                    >
                      <div className="truncate">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                {renderExpandedRow && expandedRows[row.id] && (
                  <TableRow className="bg-muted/10 border-b">
                    <TableCell colSpan={columns.length} className="p-4">
                      {renderExpandedRow(row.original)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length
            )}{" "}
            of {data.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
