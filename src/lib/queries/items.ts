import { createClient } from "@/lib/supabase/server";

export type SortColumn =
  | "number"
  | "name"
  | "type"
  | "created_at"
  | "updated_at"
  | "is_active";
export type SortOrder = "asc" | "desc";

interface GetItemsParams {
  page: number;
  perPage: number;
  sortColumn: SortColumn;
  sortOrder: SortOrder;
  filterType?: string;
  searchTerm?: string;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export async function getItems({
  page = 1,
  perPage = DEFAULT_ITEMS_PER_PAGE,
  sortColumn = "number",
  sortOrder = "asc",
  filterType,
  searchTerm,
}: GetItemsParams) {
  try {
    const supabase = await createClient();

    // Calculate the range for pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Start the query
    let query = supabase.from("items").select("*", { count: "exact" });

    // Apply filters
    if (filterType) {
      query = query.eq("type", filterType.toUpperCase());
    }

    if (searchTerm) {
      // Use textSearch for safer search operations
      query = query.or(
        `number.ilike.${searchTerm ? `%${searchTerm}%` : "%"},name.ilike.${
          searchTerm ? `%${searchTerm}%` : "%"
        }`
      );
    }

    // Apply sorting and pagination
    const {
      data: items,
      count,
      error,
    } = await query
      .order(sortColumn, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) {
      throw error;
    }

    const totalPages = count ? Math.ceil(count / perPage) : 0;

    return {
      items: items || [],
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items. Please try again later.");
  }
}
