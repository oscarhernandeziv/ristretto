"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { RefreshCw, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWorkOrder } from "@/lib/actions/create-work-order";
import { useToast } from "@/lib/hooks/use-toast";
import {
  type ProductionLine,
  getProductionLines,
} from "@/lib/queries/work-order";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

// Add a more specific type for search results
interface ItemSearchResult {
  id: string;
  number: string;
  name: string;
  type: string;
}

const formSchema = z.object({
  itemNumber: z.string().min(1, "Item number is required"),
  itemName: z.string().min(1, "Item name is required"),
  productionLineId: z.string().min(1, "Production line is required"),
  plannedQuantity: z.coerce
    .number()
    .min(0.01, "Quantity must be greater than 0")
    .max(100000, "Quantity must be less than 100,000"),
  plannedStartTime: z.string().min(1, "Start time is required"),
  notes: z.string().optional(),
  workOrderNumber: z.string().min(1, "Work order number is required"),
});

interface CreateWorkOrderDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function CreateWorkOrderDialog({
  open,
  onOpenChangeAction,
}: CreateWorkOrderDialogProps) {
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ItemSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemNumber: "",
      itemName: "",
      productionLineId: "",
      plannedQuantity: 0,
      plannedStartTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      notes: "",
      workOrderNumber: `WO-${format(new Date(), "yyyyMMdd")}-${Math.floor(
        Math.random() * 1000
      )
        .toString()
        .padStart(3, "0")}`,
    },
  });

  useEffect(() => {
    async function loadProductionLines() {
      try {
        const lines = await getProductionLines();
        setProductionLines(lines);
      } catch (error) {
        console.error("Error loading production lines:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load production lines",
        });
      }
    }
    loadProductionLines();
  }, [toast]);

  useEffect(() => {
    if (!open) {
      form.reset({
        ...form.formState.defaultValues,
        workOrderNumber: `WO-${format(new Date(), "yyyyMMdd")}-${Math.floor(
          Math.random() * 1000
        )
          .toString()
          .padStart(3, "0")}`,
      });
      setItems([]);
      setSearchQuery("");
    }
  }, [open, form]);

  const debouncedSearch = useCallback(
    async (term: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setIsSearching(true);
      setItems([]);

      if (!term || term.length < 2) {
        setIsSearching(false);
        setShowDropdown(false);
        return;
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("items")
            .select("id, number, name, type")
            .or(`number.ilike.%${term}%,name.ilike.%${term}%`)
            .eq("type", "PACK")
            .order("number", { ascending: true })
            .limit(10);

          if (error) throw error;
          setItems(data || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error searching items:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to search items",
          });
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [toast]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const selectedItem = items.find(
        (item) => item.number === values.itemNumber
      );

      if (!selectedItem) {
        throw new Error("Please select a valid item from the search results");
      }

      const result = await createWorkOrder(values);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Work order created successfully",
      });
      onOpenChangeAction(false);
    } catch (error) {
      console.error("Error creating work order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create work order",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Work Order</DialogTitle>
          <DialogDescription>
            Enter the details for the new work order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workOrderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Order Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter work order number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="itemNumber"
                render={({ field: numberField }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by item number or name..."
                          value={searchQuery}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            setIsSearching(true);
                            setShowDropdown(true);
                            if (searchTimeoutRef.current) {
                              clearTimeout(searchTimeoutRef.current);
                            }
                            searchTimeoutRef.current = setTimeout(() => {
                              debouncedSearch(value);
                            }, 300);
                          }}
                          onFocus={() => {
                            if (items.length > 0) {
                              setShowDropdown(true);
                            }
                          }}
                          className={cn(
                            "pl-8",
                            Boolean(searchQuery) && "pr-9",
                            isSearching && "animate-pulse"
                          )}
                        />
                        {Boolean(searchQuery) && (
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                            onClick={() => {
                              setSearchQuery("");
                              setItems([]);
                              setShowDropdown(false);
                              form.setValue("itemNumber", "");
                              form.setValue("itemName", "");
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
                        <FormControl>
                          <Input type="hidden" {...numberField} />
                        </FormControl>
                      </div>
                      {isSearching ? (
                        <div className="flex items-center justify-center py-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm">Searching...</span>
                        </div>
                      ) : items.length > 0 && showDropdown ? (
                        <div className="max-h-[200px] overflow-y-auto rounded-md border border-input bg-background">
                          {items.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                form.setValue("itemNumber", item.number);
                                form.setValue("itemName", item.name);
                                setSearchQuery(`${item.number} - ${item.name}`);
                                setShowDropdown(false);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {item.number}
                                </span>
                                <span className="text-muted-foreground">
                                  {item.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery.length > 0 && showDropdown ? (
                        <p className="py-2 text-sm text-muted-foreground">
                          No items found.
                        </p>
                      ) : null}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="productionLineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Line</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a production line" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productionLines.map((line) => (
                        <SelectItem key={line.id} value={line.id}>
                          {line.name} - {line.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plannedQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter planned quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plannedStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChangeAction(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
