"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "cn";
import { toCSV, downloadCSV } from "@/lib/csv";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  /** Value used for CSV export. Defaults to row[key] when omitted. */
  exportValue?: (row: T) => string | number | null | undefined;
  /** Set false to leave this column out of the CSV export (e.g. an actions column). */
  exportable?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  emptyMessage?: string;
  pageSize?: number;
  toolbar?: React.ReactNode;
  /** Base filename (without extension) for the CSV export. Defaults to "export". */
  exportFilename?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  searchPlaceholder,
  searchFn,
  emptyMessage = "Nothing here yet.",
  pageSize = 10,
  toolbar,
  exportFilename = "export",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!searchFn || !query.trim()) return data;
    return data.filter((row) => searchFn(row, query.trim().toLowerCase()));
  }, [data, query, searchFn]);

  const exportColumns = useMemo(
    () => columns.filter((col) => col.exportable !== false && col.header !== ""),
    [columns]
  );

  function onExport() {
    const headers = exportColumns.map((col) => col.header);
    const rows = filtered.map((row) =>
      exportColumns.map((col) =>
        col.exportValue ? col.exportValue(row) ?? "" : ((row as Record<string, unknown>)[col.key] as string | number | undefined) ?? ""
      )
    );
    downloadCSV(exportFilename, toCSV(headers, rows));
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {searchFn ? (
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder ?? "Search..."}
            className="max-w-xs"
          />
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {toolbar}
          <Button variant="outline" size="sm" onClick={onExport} disabled={filtered.length === 0}>
            <Download /> Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {currentPage + 1} of {pageCount} &middot; {filtered.length} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
