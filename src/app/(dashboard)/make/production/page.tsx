import { Metadata } from "next";

import {
  type SortColumn,
  type WorkOrder,
  WorkOrdersTable,
} from "@/features/make/work-orders-table";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Work Orders",
  description: "View and manage work orders.",
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

interface ProductionPageProps {
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

interface GetWorkOrdersParams {
  sortColumn?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  itemsPerPage?: number;
  status?: string;
  production_line?: string;
  search?: string;
}

async function getWorkOrders({
  sortColumn = "item_number",
  sortOrder = "desc",
  page = 1,
  itemsPerPage = 10,
  status,
  production_line,
  search,
}: GetWorkOrdersParams) {
  try {
    const supabase = await createClient();

    // Calculate offset based on page number and items per page
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Start building the query
    let query = supabase.from("production_work_orders").select(
      `
      *,
      items!inner (
        number,
        name
      ),
      production_lines!inner (
        name
      )
    `,
      { count: "exact" }
    );

    // Add filters if provided
    if (status) {
      query = query.eq("status", status.toLowerCase());
    }

    if (production_line) {
      query = query.eq("production_line_id", production_line);
    }

    if (search) {
      query = query.or(
        `work_order_number.ilike.%${search}%,items.number.ilike.%${search}%,items.name.ilike.%${search}%`
      );
    }

    // Handle sorting
    const orderByMap: Record<
      string,
      { column: string; foreignTable?: string }
    > = {
      item_number: { column: "number", foreignTable: "items" },
      item_name: { column: "name", foreignTable: "items" },
      work_order_number: { column: "work_order_number" },
      status: { column: "status" },
      planned_quantity: { column: "planned_quantity" },
      due_date: { column: "planned_start_time" },
      start_time: { column: "planned_start_time" },
      planned_end_time: { column: "planned_end_time" },
      production_line_name: {
        column: "name",
        foreignTable: "production_lines",
      },
      created_at: { column: "created_at" },
      updated_at: { column: "updated_at" },
    };

    const orderBy = orderByMap[sortColumn] || { column: sortColumn };

    // Apply sorting and pagination
    const { data, count, error } = await query
      .order(orderBy.column, {
        ascending: sortOrder === "asc",
        foreignTable: orderBy.foreignTable,
      })
      .range(from, to);

    if (error) {
      console.error("Error fetching work orders:", error);
      throw error;
    }

    // Transform the data to match our WorkOrder interface
    const workOrders: WorkOrder[] = (data || []).map((row) => ({
      id: row.id,
      work_order_number: row.work_order_number,
      production_line_id: row.production_line_id,
      item_id: row.item_id,
      status: row.status,
      planned_quantity: row.planned_quantity,
      actual_quantity: row.actual_quantity,
      planned_start_time: row.planned_start_time,
      planned_end_time: row.planned_end_time,
      actual_start_time: row.actual_start_time,
      actual_end_time: row.actual_end_time,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      item_number: row.items.number,
      item_name: row.items.name,
      production_line_name: row.production_lines.name,
    }));

    return {
      workOrders,
      totalPages: count ? Math.ceil(count / itemsPerPage) : 0,
    };
  } catch (error) {
    console.error("Error fetching work orders:", error);
    return {
      workOrders: [],
      totalPages: 0,
    };
  }
}

export default async function MakeProductionPage({
  searchParams,
}: ProductionPageProps) {
  const resolvedParams = await searchParams;

  const params = {
    page: Number(getSearchParam(resolvedParams?.page)) || 1,
    sortColumn:
      (getSearchParam(resolvedParams?.sort) as SortColumn) || "item_number",
    sortOrder:
      (getSearchParam(resolvedParams?.order) as "asc" | "desc") || "desc",
    status: getSearchParam(resolvedParams?.status),
    production_line: getSearchParam(resolvedParams?.production_line),
    search: getSearchParam(resolvedParams?.search),
  };

  const { workOrders, totalPages } = await getWorkOrders({
    page: params.page,
    sortColumn: params.sortColumn,
    sortOrder: params.sortOrder,
    status: params.status,
    production_line: params.production_line,
    search: params.search,
  });

  return (
    <WorkOrdersTable
      workOrders={workOrders}
      currentPage={params.page}
      totalPages={totalPages}
      sortColumn={params.sortColumn}
      sortOrder={params.sortOrder}
      filterStatus={params.status}
      filterProductionLine={params.production_line}
      searchTerm={params.search}
      itemsPerPage={10}
    />
  );
}
