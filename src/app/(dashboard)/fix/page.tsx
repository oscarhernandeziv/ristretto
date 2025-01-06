import { redirect } from "next/navigation";

import { MaintenanceBoard } from "@/features/fix/components/maintenance-board";
import { getUser } from "@/lib/queries/user";

export default async function FixPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Maintenance Dashboard
      </h1>
      <MaintenanceBoard />
    </div>
  );
}
