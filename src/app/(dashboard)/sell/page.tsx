import { redirect } from "next/navigation";

import { OrderBoard } from "@/features/sell/components/order-board";
import { getUser } from "@/lib/queries/user";

export default async function SellPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Sales Dashboard</h1>
      <OrderBoard />
    </div>
  );
}
