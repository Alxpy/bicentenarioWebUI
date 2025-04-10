import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  key: string;
  header: string;
  className?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  caption?: string;
  className?: string;
  onRowClick?: (row: any) => void;
}

export const DataTable = ({
  columns,
  data,
  caption,
  className = "",
  onRowClick,
}: DataTableProps) => {
  return (
    <div className={`rounded-md border border-slate-200 dark:border-slate-800 w-full overflow-auto ${className}`}>
      <Table>
        {caption && <TableCaption className="text-slate-500 dark:text-slate-400">{caption}</TableCaption>}
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={`text-slate-600 dark:text-slate-300 ${column.className || ""}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow 
              key={rowIndex}
              className={`border-slate-100 dark:border-slate-800 ${
                onRowClick ? "hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer" : ""
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <TableCell 
                  key={`${rowIndex}-${column.key}`}
                  className={`text-slate-700 dark:text-slate-300 ${column.className || ""}`}
                >
                  {column.render 
                    ? column.render(row[column.key], row) 
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

