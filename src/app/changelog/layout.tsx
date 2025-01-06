import { AuthHeader } from "@/components/layout/header/auth-header";
import { Separator } from "@/components/ui/separator";

export default function ChangelogLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="flex-1 p-4">
        <div className="hidden space-y-6 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Changelog</h2>
            <p className="text-muted-foreground">
              View the latest changes to ristretto.app.
            </p>
          </div>
          <Separator className="my-6" />
        </div>
      </main>
    </div>
  );
}
