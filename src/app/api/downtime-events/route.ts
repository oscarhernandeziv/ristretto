import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  try {
    const json = await request.json();

    const { data, error } = await supabase.from("downtime_events").insert([
      {
        production_line_id: json.production_line_id,
        work_order_id: json.work_order_id,
        category: json.category,
        impact_level: json.impact_level,
        start_time: json.start_time,
        end_time: json.end_time,
        reason: json.reason,
        action_taken: json.action_taken,
        reported_by: user.id,
      },
    ]);

    if (error) throw error;

    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating downtime event" },
      {
        status: 500,
      }
    );
  }
}
