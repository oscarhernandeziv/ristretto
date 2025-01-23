import { redirect } from "next/navigation";

import OperatorPanel from "@/features/make/operator-panel";
import { getUser } from "@/lib/queries/user";

export default async function OperatorPanelPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="flex flex-1 flex-col px-4 py-2">
      <OperatorPanel />
    </div>
  );
}
