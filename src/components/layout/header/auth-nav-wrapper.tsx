import { getUser } from "@/lib/queries/user";

import { AuthNav } from "./auth-nav";

export async function AuthNavWrapper() {
  const user = await getUser();

  return <AuthNav userId={user?.id} />;
}
