import { redirect } from "next/navigation";

import { AnalyticsDashboard } from "@/features/insights/components/analytics-dashboard";
import { getUser } from "@/lib/queries/user";

export default async function InsightsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
      <AnalyticsDashboard />
    </div>
  );
}
