import { Metadata, type Route } from "next";

import { PackageIcon } from "lucide-react";

import { SidebarNav } from "@/components/layout/sidebar/sidebar-nav";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Items",
  description: "Manage your items and inventory.",
};

const sidebarNavItems = [
  {
    title: "Products",
    href: "/items/products" as Route,
    icon: <PackageIcon />,
  },
  {
    title: "Materials",
    href: "/items/materials" as Route,
    icon: <PackageIcon />,
  },
  {
    title: "On-Hand Inventory",
    href: "/items/inventory" as Route,
    icon: <PackageIcon />,
  },
];

interface ItemsLayoutProps {
  children: React.ReactNode;
}

export default function ItemsLayout({ children }: ItemsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="h-full">
          <div className="px-4 py-2">
            <h2 className="text-2xl font-bold tracking-tight">Items</h2>
            <p className="text-muted-foreground">
              Manage your items and inventory.
            </p>
          </div>
          <Separator />
          <div className="flex h-[calc(100vh-8rem)]">
            <aside className="w-48 border-r">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
