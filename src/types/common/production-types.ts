export type ProductionLineType = "roasting" | "packaging" | "grinding";
export type ProductionLineStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "setup";

export interface ProductionLine {
  id: string;
  name: string;
  description: string | null;
  type: ProductionLineType;
  status: ProductionLineStatus;
  target_output_per_hour: number;
  output_unit: string;
  current_item_id: string | null;
  current_operator_id: string | null;
  last_changeover_at: string | null;
  created_at: string;
  updated_at: string;
}
