export interface Item {
  id: string;
  number: string;
  name: string;
  description: string | null;
  type: "PACK" | "ROAST" | "GREEN" | "MATERIAL";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
