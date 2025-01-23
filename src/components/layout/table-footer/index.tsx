"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFooterProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export function TableFooter({
  currentPage,
  totalPages,
  itemsPerPage,
}: TableFooterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`?${params.toString()}`);
  };

  const handlePerPageChange = (value: string) => {
    const newPerPage = parseInt(value, 10);
    if (isNaN(newPerPage)) return;

    updateSearchParams({
      per_page: value,
      page: "1",
    });
  };

  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t bg-background px-4 py-2">
      <div className="flex items-center gap-2">
        <Select
          value={String(itemsPerPage)}
          onValueChange={handlePerPageChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">rows per page</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-transparent"
            disabled={currentPage <= 1}
            onClick={() => updateSearchParams({ page: "1" })}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-transparent"
            disabled={currentPage <= 1}
            onClick={() =>
              updateSearchParams({ page: String(currentPage - 1) })
            }
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-transparent"
            disabled={currentPage >= totalPages}
            onClick={() =>
              updateSearchParams({ page: String(currentPage + 1) })
            }
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-transparent"
            disabled={currentPage >= totalPages}
            onClick={() => updateSearchParams({ page: String(totalPages) })}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
