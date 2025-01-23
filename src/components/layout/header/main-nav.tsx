"use client";

import { Route as NextRoute } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart,
  Database,
  Factory,
  FileText,
  LucideIcon,
  ShoppingCart,
  TruckIcon,
  Users,
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
    href: "/sell",
    label: "Sell",
    icon: ShoppingCart,
    description: "Manage orders and customer information",
    subItems: [
      {
        href: "/sell/customers",
        label: "Customers",
        description: "Manage customer information and relationships",
      },
      {
        href: "/sell/orders",
        label: "Orders",
        description: "View and manage customer orders",
      },
      {
        href: "/sell/quotes",
        label: "Quotes",
        description: "Create and manage customer quotes",
      },
    ],
  },
  {
    href: "/buy",
    label: "Buy",
    icon: TruckIcon,
    description: "Handle inventory and purchasing",
    subItems: [
      {
        href: "/buy/purchasing",
        label: "Purchasing",
        description: "Create and manage purchase orders",
      },
      {
        href: "/buy/suppliers",
        label: "Suppliers",
        description: "Manage supplier information and relationships",
      },
      {
        href: "/buy/receiving",
        label: "Receiving",
        description: "Handle incoming shipments and materials",
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
  {
    href: "/insights",
    label: "Insights",
    icon: BarChart,
    description: "Performance metrics and reporting",
    subItems: [
      {
        href: "/insights/reports",
        label: "Reports",
        description: "Generate and view business reports",
      },
      {
        href: "/insights/analytics",
        label: "Analytics",
        description: "Analyze business performance metrics",
      },
      {
        href: "/insights/dashboard",
        label: "Dashboard",
        description: "View key performance indicators",
      },
    ],
  },
  {
    href: "/people",
    label: "People",
    icon: Users,
    description: "Schedule and manage staff",
    subItems: [
      {
        href: "/people/employees",
        label: "Employees",
        description: "Manage employee information",
      },
      {
        href: "/people/schedule",
        label: "Schedule",
        description: "View and manage work schedules",
      },
      {
        href: "/people/teams",
        label: "Teams",
        description: "Organize and manage team structures",
      },
    ],
  },
  {
    href: "/docs",
    label: "Docs",
    icon: FileText,
    description: "Documentation and procedures",
    subItems: [
      {
        href: "/docs/procedures",
        label: "Procedures",
        description: "Standard operating procedures",
      },
      {
        href: "/docs/manuals",
        label: "Manuals",
        description: "Equipment and process manuals",
      },
      {
        href: "/docs/guides",
        label: "Guides",
        description: "Training and reference guides",
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
