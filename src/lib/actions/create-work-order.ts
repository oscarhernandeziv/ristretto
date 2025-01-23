"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface CreateWorkOrderInput {
  itemNumber: string;
  itemName: string;
  productionLineId: string;
  plannedQuantity: number;
  plannedStartTime: string;
  notes?: string;
  workOrderNumber: string;
}

export async function createWorkOrder({
  itemNumber,
  itemName,
  productionLineId,
  plannedQuantity,
  plannedStartTime,
  notes,
  workOrderNumber,
}: CreateWorkOrderInput) {
  try {
    const supabase = await createClient();

    // First, get or create the item
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id")
      .eq("number", itemNumber)
      .maybeSingle();

    if (itemError) throw itemError;

    let itemId: string;

    if (!item) {
      // Create new item
      const { data: newItem, error: createItemError } = await supabase
        .from("items")
        .insert({
          number: itemNumber,
          name: itemName,
          type: "PACK", // Default type, you might want to make this configurable
          is_active: true,
        })
        .select("id")
        .single();

      if (createItemError) throw createItemError;
      itemId = newItem.id;
    } else {
      itemId = item.id;
    }

    // Ensure the planned start time is in ISO format with the correct timezone
    const plannedStartTimeISO = new Date(plannedStartTime).toISOString();

    // Create the work order
    const { data: workOrder, error: workOrderError } = await supabase
      .from("production_work_orders")
      .insert({
        work_order_number: workOrderNumber,
        production_line_id: productionLineId,
        item_id: itemId,
        status: "planned",
        planned_quantity: plannedQuantity,
        planned_start_time: plannedStartTimeISO,
        notes,
      })
      .select(
        `
        *,
        items (
          number,
          name,
          description
        ),
        production_lines (
          name
        )
      `
      )
      .single();

    if (workOrderError) throw workOrderError;

    revalidatePath("/make");

    return { data: workOrder, error: null };
  } catch (error) {
    console.error("Error creating work order:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
