"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useDeclareProduction } from "@/lib/hooks/use-declare-production";
import { type WorkOrder } from "@/lib/queries/work-order";

const formSchema = z.object({
  quantity: z.coerce
    .number()
    .min(0.01, "Quantity must be greater than 0")
    .max(100000, "Quantity must be less than 100,000"),
  complete: z.boolean().default(false),
});

interface DeclareProductionDialogProps {
  workOrder: WorkOrder;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function DeclareProductionDialog({
  workOrder,
  open,
  onOpenChangeAction,
}: DeclareProductionDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      complete: false,
    },
  });

  const declareProduction = useDeclareProduction({
    onSuccess: () => {
      form.reset();
      onOpenChangeAction(false);
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    declareProduction.mutate({
      workOrderId: workOrder.id,
      quantity: values.quantity,
      complete: values.complete,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Declare Production</DialogTitle>
          <DialogDescription>
            Enter the quantity produced for work order{" "}
            {workOrder.work_order_number}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="complete"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Complete work order</FormLabel>
                  </div>
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
              <Button type="submit" disabled={declareProduction.isPending}>
                {declareProduction.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Declaring...
                  </>
                ) : (
                  "Declare"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
