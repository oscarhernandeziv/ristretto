import { createClient } from "@/lib/supabase/client";

export interface WorkOrder {
  id: string;
  work_order_number: string;
  production_line_id: string;
  item_id: string;
  status: "planned" | "released" | "started" | "completed" | "cancelled";
  planned_quantity: number;
  actual_quantity: number | null;
  planned_start_time: string;
  planned_end_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  item: {
    id: string;
    number: string;
    name: string;
    description: string | null;
  };
}

export interface ProductionLine {
  id: string;
  name: string;
  description: string | null;
  type: "roasting" | "packaging" | "grinding";
  status: "active" | "inactive" | "maintenance" | "setup";
  target_output_per_hour: number;
  output_unit: string;
}

export async function getProductionLines() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("production_lines")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as ProductionLine[];
}

export async function getWorkOrders(productionLineId: string | null) {
  if (!productionLineId) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("production_work_orders")
    .select(
      `
      *,
      item:items(
        id,
        number,
        name,
        description
      )
    `
    )
    .eq("production_line_id", productionLineId)
    .in("status", ["planned", "released", "started"])
    .order("planned_start_time");

  if (error) throw error;
  return data as WorkOrder[];
}

export async function updateWorkOrderQuantity(
  workOrderId: string,
  actualQuantity: number
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("production_work_orders")
    .update({
      actual_quantity: actualQuantity,
    })
    .eq("id", workOrderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelWorkOrder(workOrderId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("production_work_orders")
    .update({
      status: "cancelled",
      actual_end_time: new Date().toISOString(),
    })
    .eq("id", workOrderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCompletedWorkOrders(productionLineId: string | null) {
  if (!productionLineId) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("production_work_orders")
    .select(
      `
      *,
      item:items(
        id,
        number,
        name,
        description
      )
    `
    )
    .eq("production_line_id", productionLineId)
    .in("status", ["completed", "cancelled"])
    .order("actual_end_time", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data as WorkOrder[];
}
