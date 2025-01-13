"use client";

import { type Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type SortColumn, type SortOrder } from "@/lib/queries/items";
import { cn } from "@/lib/utils/cn";

import { type Item } from "../../../types/common/item-types";

interface ProductCatalogProps {
  items: Item[];
  currentPage: number;
  totalPages: number;
  sortColumn: SortColumn;
  sortOrder: SortOrder;
  filterType?: string;
  filterActive?: string;
  searchTerm?: string;
  itemsPerPage: number;
}

const ITEM_TYPES = ["PACK", "ROAST", "GREEN", "MATERIAL"];

interface Column {
  id: SortColumn;
  label: string;
}

const COLUMNS: Column[] = [
  { id: "number", label: "Number" },
  { id: "name", label: "Name" },
  { id: "type", label: "Type" },
  { id: "is_active", label: "Status" },
  { id: "created_at", label: "Created" },
  { id: "updated_at", label: "Updated" },
];

const SortIcon = ({
  column,
  currentColumn,
  currentOrder,
}: {
  column: SortColumn;
  currentColumn: SortColumn;
  currentOrder: SortOrder;
}) => {
  if (column !== currentColumn) {
    return <ChevronsUpDown className="h-4 w-4" />;
  }
  return currentOrder === "asc" ? (
    <ChevronUp className="h-4 w-4" />
  ) : (
    <ChevronDown className="h-4 w-4" />
  );
};

export function ProductCatalog({
  items,
  sortColumn,
  sortOrder,
  filterType,
  searchTerm,
}: ProductCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visibleColumns, setVisibleColumns] = useState<SortColumn[]>(
    COLUMNS.map((col) => col.id)
  );

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleSort = (column: SortColumn) => {
    const newOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";
    const queryString = createQueryString({ sort: column, order: newOrder });
    router.push(`${pathname}?${queryString}` as Route);
  };

  const handleFilter = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value, page: "1" });
    router.push(`${pathname}?${queryString}` as Route);
  };

  const handleSearch = (term: string) => {
    const queryString = createQueryString({
      search: term || null,
      page: "1",
    });
    router.push(`${pathname}?${queryString}` as Route);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="bg-background">
        <div className="px-4 py-2">
          <h2 className="text-2xl font-bold">Products</h2>
        </div>
        <div className="border-b">
          <div className="flex items-center justify-between px-4 py-2">
            <Tabs
              value={filterType?.toUpperCase() || "ALL"}
              onValueChange={(value) =>
                handleFilter(
                  "type",
                  value === "ALL" ? null : value.toLowerCase()
                )
              }
              className="w-full"
            >
              <TabsList className="inline-flex h-9 items-center justify-start rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger
                  value="ALL"
                  className="rounded-none border-b-2 border-transparent px-3 py-1.5 font-medium data-[state=active]:border-primary"
                >
                  ALL
                </TabsTrigger>
                {ITEM_TYPES.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="rounded-none border-b-2 border-transparent px-3 py-1.5 font-medium data-[state=active]:border-primary"
                  >
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="w-[280px] pl-8"
                value={searchTerm || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="hover:bg-transparent">
              {COLUMNS.filter((column) =>
                visibleColumns.includes(column.id)
              ).map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "px-4 py-2 font-medium",
                    column.id === "number" && "pl-4"
                  )}
                >
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column.id)}
                    className="-ml-3 flex items-center gap-1 hover:bg-transparent"
                  >
                    {column.label}
                    <SortIcon
                      column={column.id}
                      currentColumn={sortColumn}
                      currentOrder={sortOrder}
                    />
                  </Button>
                </TableHead>
              ))}
              <TableHead className="w-[40px] px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-transparent"
                    >
                      <Settings2 className="h-4 w-4" />
                      <span className="sr-only">Column Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {COLUMNS.map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={visibleColumns.includes(column.id)}
                        onCheckedChange={() => {
                          setVisibleColumns((current) =>
                            current.includes(column.id)
                              ? current.filter((id) => id !== column.id)
                              : [...current, column.id]
                          );
                        }}
                      >
                        {column.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                {visibleColumns.includes("number") && (
                  <TableCell className="px-4 py-1.5">{item.number}</TableCell>
                )}
                {visibleColumns.includes("name") && (
                  <TableCell className="px-4 py-1.5">{item.name}</TableCell>
                )}
                {visibleColumns.includes("type") && (
                  <TableCell className="px-4 py-1.5">{item.type}</TableCell>
                )}
                {visibleColumns.includes("is_active") && (
                  <TableCell className="px-4 py-1.5">
                    {item.is_active ? "Active" : "Inactive"}
                  </TableCell>
                )}
                {visibleColumns.includes("created_at") && (
                  <TableCell className="px-4 py-1.5">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                )}
                {visibleColumns.includes("updated_at") && (
                  <TableCell className="px-4 py-1.5">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </TableCell>
                )}
                <TableCell className="w-[40px] px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-transparent"
                  >
                    <span className="sr-only">More options</span>
                    <svg
                      width="4"
                      height="16"
                      viewBox="0 0 4 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-muted-foreground"
                    >
                      <path
                        d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
