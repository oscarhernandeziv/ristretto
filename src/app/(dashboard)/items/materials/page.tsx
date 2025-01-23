import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Material List",
  description: "View and manage material items.",
};

export default function MaterialListPage() {
  return (
    <div className="flex flex-col px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Material List</h2>
          <p className="text-sm text-muted-foreground">
            View and manage material items in your inventory.
          </p>
        </div>
      </div>
    </div>
  );
}
