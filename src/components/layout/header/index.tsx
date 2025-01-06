import { Suspense } from "react";

import { AuthNavWrapper } from "./auth-nav-wrapper";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { NavSkeleton } from "./nav-skeleton";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Logo className="mr-6" />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto">
            <Suspense fallback={<NavSkeleton />}>
              <MainNav />
            </Suspense>
          </div>
          <div className="flex items-center gap-2">
            <Suspense fallback={<NavSkeleton />}>
              <AuthNavWrapper />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
