"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className={cn("min-w-full divide-y divide-gray-200", className)}>
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return <thead className={cn("bg-gray-50", className)}>{children}</thead>;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn("divide-y divide-gray-200 bg-white", className)}>
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors hover:bg-gray-50",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th
      scope="col"
      className={cn(
        "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td
      className={cn(
        "px-6 py-4 whitespace-nowrap text-sm text-gray-700",
        className,
      )}
    >
      {children}
    </td>
  );
}
