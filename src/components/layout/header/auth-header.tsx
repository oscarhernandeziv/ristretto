import { getUser } from "@/lib/queries/user";

import { AuthNav } from "./auth-nav";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export async function AuthHeader() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Logo className="mr-6" />
        <div className="ml-auto flex items-center space-x-4">
          <AuthNav userId={user?.id} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
