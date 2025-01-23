"use client";

import { type Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Columns3,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type SortColumn, type SortOrder } from "@/lib/queries/item";
import { cn } from "@/lib/utils/cn";

import { type Item } from "../../types/common/item-types";

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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(
    searchTerm || ""
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false,
    updated_at: false,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: sortColumn, desc: sortOrder === "desc" },
  ]);

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: "number",
        header: "Number",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("number")}</div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.getValue("name"),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => row.getValue("type"),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (row.getValue("is_active") ? "Active" : "Inactive"),
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) =>
          new Date(row.getValue("created_at")).toLocaleDateString(),
      },
      {
        accessorKey: "updated_at",
        header: "Updated",
        cell: ({ row }) =>
          new Date(row.getValue("updated_at")).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      const [sort] = newSorting;
      if (sort) {
        const queryString = createQueryString({
          sort: sort.id as SortColumn,
          order: sort.desc ? "desc" : "asc",
        });
        router.push(`${pathname}?${queryString}` as Route);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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

  const debouncedSearch = useCallback(
    (term: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
        const queryString = createQueryString({
          search: term || null,
          page: "1",
        });
        router.push(`${pathname}?${queryString}` as Route);
      }, 300);
    },
    [createQueryString, pathname, router]
  );

  const handleSearch = (term: string) => {
    setLocalSearchTerm(term);
    setIsSearching(true);
    debouncedSearch(term);
  };

  const handleFilter = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value, page: "1" });
    router.push(`${pathname}?${queryString}` as Route);
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="sticky top-0 z-20 bg-background">
        <div className="space-y-1 border-b px-4 py-2">
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            View the product catalog.
          </p>
        </div>

        <div className="border-b px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  className={cn(
                    "peer min-w-60 ps-9",
                    Boolean(localSearchTerm) && "pe-9",
                    isSearching && "animate-pulse"
                  )}
                  value={localSearchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Filter by number or name..."
                  type="text"
                  aria-label="Filter by number or name"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Search
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={cn(isSearching && "animate-spin")}
                  />
                </div>
                {Boolean(localSearchTerm) && (
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Clear filter"
                    onClick={() => {
                      setLocalSearchTerm("");
                      handleSearch("");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m15 9-6 6" />
                      <path d="m9 9 6 6" />
                    </svg>
                  </button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter
                      className="-ms-1 me-2 opacity-60"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Type
                    {filterType && (
                      <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                        1
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-36 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Filters
                    </div>
                    <div className="space-y-3">
                      {ITEM_TYPES.map((type, i) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            id={`type-${i}`}
                            checked={filterType?.toUpperCase() === type}
                            onCheckedChange={(checked) =>
                              handleFilter(
                                "type",
                                checked ? type.toLowerCase() : null
                              )
                            }
                          />
                          <Label
                            htmlFor={`type-${i}`}
                            className="flex grow justify-between gap-2 font-normal"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Columns3
                      className="-ms-1 me-2 opacity-60"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-3">
              <Button className="ml-auto">
                <Plus
                  className="-ms-1 me-2 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Create Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-1.5 font-medium"
                  >
                    {header.isPlaceholder ? null : (
                      <Button
                        variant="ghost"
                        onClick={header.column.getToggleSortingHandler()}
                        className="-ml-4 flex items-center gap-1 hover:bg-transparent"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ChevronsUpDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-1.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
