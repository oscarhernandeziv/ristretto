"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Book, HelpCircle } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils/cn";

const publicRoutes = [
  {
    href: "/documentation",
    label: "Documentation",
    icon: Book,
  },
  {
    href: "/help",
    label: "Help",
    icon: HelpCircle,
  },
] as const;

interface AuthNavProps {
  userId?: string | null;
}

export function AuthNav({ userId }: AuthNavProps) {
  const pathname = usePathname();
  // Check for actual route paths instead of the group prefix
  const isDashboardRoute =
    pathname.includes("/items") ||
    pathname.includes("/insights") ||
    pathname.includes("/docs") ||
    pathname.includes("/buy") ||
    pathname.includes("/sell") ||
    pathname.includes("/make") ||
    pathname.includes("/fix") ||
    pathname.includes("/people");

  // Case 1: User signed in + on dashboard route
  if (userId && isDashboardRoute) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex w-full justify-end gap-4">
          <SignOutButton />
          <Button asChild>
            <Link href="/settings/account" passHref>
              Settings
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Case 2 & 3: User signed in but not on dashboard OR not signed in
  return (
    <div className="flex items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          {publicRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <NavigationMenuItem key={route.href}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center space-x-2",
                      pathname === route.href && "bg-accent"
                    )}
                    active={pathname === route.href}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex w-full justify-end gap-4">
        {userId ? (
          // Case 2: User signed in but not on dashboard
          <>
            <SignOutButton />
            <Button asChild>
              <Link href="/items" passHref>
                Dashboard
              </Link>
            </Button>
          </>
        ) : (
          // Case 3: User not signed in
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/sign-in" passHref>
                Sign in
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up" passHref>
                Get started
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
