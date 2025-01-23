import { Metadata } from "next";
import { redirect } from "next/navigation";

import ItemsTemplate from "@/app/(dashboard)/items/template";
import { TableFooter } from "@/components/layout/table-footer";
import { ProductCatalog } from "@/features/items/product-catalog";
import { type SortColumn, type SortOrder, getItems } from "@/lib/queries/item";
import { getUser } from "@/lib/queries/user";

export const metadata: Metadata = {
  title: "Product List",
  description: "View and manage products.",
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

interface ProductsPageProps {
  searchParams: Promise<SearchParams> | SearchParams;
}

function getSearchParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const params = {
    page: Number(getSearchParam(resolvedParams?.page)) || 1,
    perPage: Number(getSearchParam(resolvedParams?.per_page)) || 20,
    sortColumn:
      (getSearchParam(resolvedParams?.sort) as SortColumn) || "number",
    sortOrder: (getSearchParam(resolvedParams?.order) as SortOrder) || "asc",
    filterType: getSearchParam(resolvedParams?.type),
    searchTerm: getSearchParam(resolvedParams?.search),
  };

  const user = await getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  try {
    const { items, totalPages } = await getItems(params);

    return (
      <ItemsTemplate
        footer={
          <TableFooter
            currentPage={params.page}
            totalPages={totalPages}
            itemsPerPage={params.perPage}
          />
        }
      >
        <div>
          <ProductCatalog
            items={items}
            currentPage={params.page}
            totalPages={totalPages}
            sortColumn={params.sortColumn}
            sortOrder={params.sortOrder}
            filterType={params.filterType}
            searchTerm={params.searchTerm}
            itemsPerPage={params.perPage}
          />
        </div>
      </ItemsTemplate>
    );
  } catch {
    return (
      <ItemsTemplate
        footer={
          <TableFooter
            currentPage={1}
            totalPages={1}
            itemsPerPage={params.perPage}
          />
        }
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Error Loading Products</h3>
            <p className="text-sm text-muted-foreground">
              There was an error loading the product list. Please try again
              later.
            </p>
          </div>
        </div>
      </ItemsTemplate>
    );
  }
}
