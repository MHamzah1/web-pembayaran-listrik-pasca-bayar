"use client";

import { Search, X } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchInput({
  onSearch,
  placeholder = "Cari...",
  className,
  defaultValue = "",
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  const handleClear = useCallback(() => {
    setValue("");
    onSearch("");
  }, [onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch(value);
      }
    },
    [onSearch, value],
  );

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-10 py-2 text-base text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
