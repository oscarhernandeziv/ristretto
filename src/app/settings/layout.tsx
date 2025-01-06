import { Metadata, Route } from "next";

import { AuthHeader } from "@/components/layout/header/auth-header";
import { SidebarNav } from "@/components/layout/sidebar/sidebar-nav";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings and set preferences.",
};

const sidebarNavItems: { title: string; href: Route }[] = [
  {
    title: "Account",
    href: "/settings/account" as Route,
  },
  {
    title: "Appearance",
    href: "/settings/appearance" as Route,
  },
  {
    title: "Notifications",
    href: "/settings/notifications" as Route,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="flex-1 p-4">
        <div className="hidden space-y-6 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set preferences.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
