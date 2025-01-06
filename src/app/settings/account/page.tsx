import { redirect } from "next/navigation";

import AccountForm from "@/components/settings/account-form";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/queries/user";

export default async function AccountPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <AccountForm user={user} />
    </div>
  );
}
