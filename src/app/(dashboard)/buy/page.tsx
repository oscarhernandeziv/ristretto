import { redirect } from "next/navigation";

import { InventoryDashboard } from "@/features/buy/components/inventory-dashboard";
import { getUser } from "@/lib/queries/user";

export default async function BuyPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Purchasing Dashboard
      </h1>
      <InventoryDashboard />
    </div>
  );
}
