import { AuthHeader } from "@/components/layout/header/auth-header";
import { ComponentPreview } from "@/components/prismui/component-preview";
import Hero from "@/components/prismui/hero";
import { Icons } from "@/components/prismui/icons";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AuthHeader />
      <div className="flex-1">
        <div className="container grid h-full grid-cols-1 items-center lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Hero
              pill={{
                text: "Work in progress!",
              }}
              content={{
                title: "Concentrated Manufacturing Excellence",
                description:
                  "Replace scattered spreadsheets and paper trails with a beautiful, user-friendly, unified MES.",
                primaryAction: {
                  href: "/sign-up",
                  text: "Get Started",
                  icon: <Icons.component className="h-4 w-4" />,
                },
                secondaryAction: {
                  href: "/documentation",
                  text: "Documentation",
                  icon: <Icons.book className="h-4 w-4" />,
                },
              }}
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <ComponentPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
