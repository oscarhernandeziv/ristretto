"use client";

import { Route as NextRoute } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart,
  Calendar,
  Database,
  Factory,
  LucideIcon,
  Wrench,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils/cn";

interface SubItem {
  href: NextRoute;
  label: string;
  description: string;
}

interface Route {
  href: NextRoute;
  label: string;
  icon: LucideIcon;
  description: string;
  subItems?: SubItem[];
}

const routes: Route[] = [
  {
    href: "/plan",
    label: "Plan",
    icon: Calendar,
    description: "Product and specification management",
    subItems: [
      {
        href: "/plan/forecast",
        label: "Forecast",
        description: "Create and manage production forecasts",
      },
      {
        href: "/plan/schedule",
        label: "Schedule",
        description: "Schedule production runs and manage capacity",
      },
      {
        href: "/plan/orders",
        label: "Orders",
        description: "Manage customer orders and production demands",
      },
    ],
  },
  {
    href: "/make",
    label: "Make",
    icon: Factory,
    description: "Track and manage production operations",
    subItems: [
      {
        href: "/make/production",
        label: "Production",
        description: "View and manage active production orders",
      },
      {
        href: "/make/planning",
        label: "Planning",
        description: "Schedule and plan production runs",
      },
      {
        href: "/make/operator-panel",
        label: "Operator Panel",
        description: "View and manage operator panel",
      },
    ],
  },
  {
    href: "/track",
    label: "Track",
    icon: BarChart,
    description: "Performance metrics and reporting",
    subItems: [
      {
        href: "/track/reports",
        label: "Reports",
        description: "Generate and view business reports",
      },
      {
        href: "/track/analytics",
        label: "Analytics",
        description: "Analyze business performance metrics",
      },
      {
        href: "/track/dashboard",
        label: "Dashboard",
        description: "View key performance indicators",
      },
    ],
  },
  {
    href: "/fix",
    label: "Fix",
    icon: Wrench,
    description: "Equipment maintenance and repairs",
    subItems: [
      {
        href: "/fix/equipment",
        label: "Equipment",
        description: "View and manage equipment inventory",
      },
      {
        href: "/fix/maintenance",
        label: "Maintenance",
        description: "Schedule and track equipment maintenance",
      },
      {
        href: "/fix/repairs",
        label: "Repairs",
        description: "Manage equipment repairs and issues",
      },
    ],
  },
  {
    href: "/items",
    label: "Items",
    icon: Database,
    description: "Product and specification management",
    subItems: [
      {
        href: "/items/products",
        label: "Products",
        description: "View the product catalog",
      },
      {
        href: "/items/materials",
        label: "Materials",
        description: "View raw materials and components",
      },
      {
        href: "/items/inventory",
        label: "Inventory",
        description: "View stock levels and locations",
      },
    ],
  },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {routes.map((route) => {
          const Icon = route.icon;

          if (route.subItems) {
            const isGridLayout = route.subItems.length > 3;
            return (
              <NavigationMenuItem key={route.href}>
                <NavigationMenuTrigger
                  className={cn(
                    "flex items-center space-x-2 bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50",
                    pathname.startsWith(route.href) && "text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline-block">{route.label}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      "w-[300px] gap-3 p-4",
                      isGridLayout
                        ? "grid md:w-[400px] md:grid-cols-2"
                        : "flex flex-col"
                    )}
                  >
                    {route.subItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md bg-transparent p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/50 focus:bg-accent/50",
                              pathname === item.href && "bg-accent/50"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.label}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={route.href}>
              <Link href={route.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center space-x-2 bg-transparent",
                    pathname === route.href && "bg-accent/50"
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
