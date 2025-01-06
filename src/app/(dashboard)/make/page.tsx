import { redirect } from "next/navigation";

import { ProductionDashboard } from "@/features/make/components/production-dashboard";
import { getUser } from "@/lib/queries/user";

export default async function MakePage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Production Dashboard
      </h1>
      <ProductionDashboard />
    </div>
  );
}
