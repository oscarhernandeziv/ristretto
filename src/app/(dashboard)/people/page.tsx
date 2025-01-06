import { redirect } from "next/navigation";

import { SchedulePlanner } from "@/features/people/components/schedule-planner";
import { getUser } from "@/lib/queries/user";

export default async function PeoplePage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Workforce Management
      </h1>
      <SchedulePlanner />
    </div>
  );
}
