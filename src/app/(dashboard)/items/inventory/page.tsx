import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory On-Hand",
  description: "View current inventory levels.",
};

export default function InventoryOnHandPage() {
  return (
    <div className="flex flex-col px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Inventory On-Hand
          </h2>
          <p className="text-sm text-muted-foreground">
            View and manage current inventory levels across all items.
          </p>
        </div>
      </div>
    </div>
  );
}
