"use server";

import { revalidateTag } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function startWorkOrder(
  workOrderId: string,
  productionLineId: string
) {
  const supabase = await createClient();

  try {
    // First verify the work order exists and is in a valid state
    const { data: workOrderCheck, error: checkError } = await supabase
      .from("production_work_orders")
      .select("status")
      .eq("id", workOrderId)
      .single();

    if (checkError) {
      throw new Error("Work order not found");
    }

    if (
      workOrderCheck.status !== "planned" &&
      workOrderCheck.status !== "released"
    ) {
      throw new Error(
        `Cannot start work order in ${workOrderCheck.status} status`
      );
    }

    // Check for existing active orders
    const { data: existingOrders, error: existingError } = await supabase
      .from("production_work_orders")
      .select()
      .eq("production_line_id", productionLineId)
      .eq("status", "started");

    if (existingError) throw existingError;

    if (existingOrders && existingOrders.length > 0) {
      throw new Error("Another work order is already in progress");
    }

    const now = new Date().toISOString();

    // Update work order status with maybeSingle() instead of single()
    const { data: workOrder, error: workOrderError } = await supabase
      .from("production_work_orders")
      .update({
        status: "started",
        actual_start_time: now,
      })
      .eq("id", workOrderId)
      .select(
        `
        *,
        item:items (
          id,
          number,
          name,
          description
        )
      `
      )
      .maybeSingle();

    if (workOrderError) throw workOrderError;
    if (!workOrder) throw new Error("Failed to update work order");

    // Update production line
    const { error: lineError } = await supabase
      .from("production_lines")
      .update({
        current_item_id: workOrder.item_id,
        last_changeover_at: now,
      })
      .eq("id", productionLineId);

    if (lineError) throw lineError;

    // Revalidate cached data
    revalidateTag("workOrders");
    revalidateTag("productionLines");

    return { data: workOrder, error: null };
  } catch (error) {
    console.error("Error starting work order:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
