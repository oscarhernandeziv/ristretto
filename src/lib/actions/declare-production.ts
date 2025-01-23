"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface DeclareProductionInput {
  workOrderId: string;
  quantity: number;
  complete?: boolean;
}

export async function declareProduction({
  workOrderId,
  quantity,
  complete = false,
}: DeclareProductionInput) {
  try {
    const supabase = await createClient();
    // Get current work order
    const { data: workOrder } = await supabase
      .from("production_work_orders")
      .select("*")
      .eq("id", workOrderId)
      .maybeSingle();

    if (!workOrder) {
      throw new Error("Work order not found");
    }

    if (workOrder.status !== "started") {
      throw new Error("Work order must be started to declare production");
    }

    const updateData = {
      actual_quantity: workOrder.actual_quantity + quantity,
      status: complete ? "completed" : workOrder.status,
      actual_end_time: complete
        ? new Date().toISOString()
        : workOrder.actual_end_time,
    };

    // Update the actual quantity and optionally complete the work order
    const { data: updatedWorkOrder, error } = await supabase
      .from("production_work_orders")
      .update(updateData)
      .eq("id", workOrderId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/make");

    return updatedWorkOrder;
  } catch (error) {
    throw error;
  }
}
