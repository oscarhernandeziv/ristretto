import { redirect } from "next/navigation";

import { DocumentLibrary } from "@/features/docs/components/document-library";
import { getUser } from "@/lib/queries/user";

export default async function DocsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Documentation</h1>
      <DocumentLibrary />
    </div>
  );
}
