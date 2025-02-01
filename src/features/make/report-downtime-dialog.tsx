"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/hooks/use-toast";

const downtimeFormSchema = z.object({
  category: z.enum(["planned", "unplanned", "maintenance", "setup", "quality"]),
  impact_level: z.enum(["none", "partial", "complete"]),
  reason: z.string().min(1, "Reason is required"),
  action_taken: z.string().optional(),
  start_time: z.string(),
  end_time: z.string(),
});

type DowntimeFormValues = z.infer<typeof downtimeFormSchema>;

interface ReportDowntimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productionLineId: string;
  workOrderId?: string;
}

export function ReportDowntimeDialog({
  open,
  onOpenChange,
  productionLineId,
  workOrderId,
}: ReportDowntimeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DowntimeFormValues>({
    resolver: zodResolver(downtimeFormSchema),
    defaultValues: {
      category: "unplanned",
      impact_level: "complete",
      reason: "",
      action_taken: "",
      start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const createDowntimeEvent = async (data: DowntimeFormValues) => {
    const response = await fetch("/api/downtime-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        production_line_id: productionLineId,
        work_order_id: workOrderId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create downtime event");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createDowntimeEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downtimeEvents"] });
      toast({
        title: "Success",
        description: "Downtime event has been recorded",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  function onSubmit(data: DowntimeFormValues) {
    setIsSubmitting(true);
    mutation.mutate(data);
    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Downtime</DialogTitle>
          <DialogDescription>
            Record a downtime event for the production line.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="unplanned">Unplanned</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="setup">Setup</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="impact_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select impact level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the reason for downtime"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="action_taken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action Taken</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any actions taken to resolve the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
