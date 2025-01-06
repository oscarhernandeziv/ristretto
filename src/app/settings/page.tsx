import { redirect } from "next/navigation";

import { getUser } from "@/lib/queries/user";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }
  redirect("/settings/account");
}
