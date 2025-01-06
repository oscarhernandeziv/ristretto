import { redirect } from "next/navigation";

import { ProductCatalog } from "@/features/items/components/product-catalog";
import { getUser } from "@/lib/queries/user";

export default async function ItemsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Product Database</h1>
      <ProductCatalog />
    </div>
  );
}
