"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart,
  Database,
  Factory,
  FileText,
  ShoppingCart,
  TruckIcon,
  Users,
  Wrench,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils/cn";

const routes = [
  {
    href: "/make",
    label: "Make",
    icon: Factory,
    description: "Track and manage production operations",
  },
  {
    href: "/sell",
    label: "Sell",
    icon: ShoppingCart,
    description: "Manage orders and customer information",
  },
  {
    href: "/buy",
    label: "Buy",
    icon: TruckIcon,
    description: "Handle inventory and purchasing",
  },
  {
    href: "/fix",
    label: "Fix",
    icon: Wrench,
    description: "Equipment maintenance and repairs",
  },
  {
    href: "/items",
    label: "Items",
    icon: Database,
    description: "Product and specification management",
  },
  {
    href: "/insights",
    label: "Insights",
    icon: BarChart,
    description: "Performance metrics and reporting",
  },
  {
    href: "/people",
    label: "People",
    icon: Users,
    description: "Schedule and manage staff",
  },
  {
    href: "/docs",
    label: "Docs",
    icon: FileText,
    description: "Documentation and procedures",
  },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {routes.map((route) => {
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
                  <span className="hidden md:inline-block">{route.label}</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
