import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase";

function mapLead(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
    email: row.email,
    age: row.age,
    gender: row.gender,
    goal: row.goal,
    goal_detail: row.goal_detail,
    freq: row.freq,
    injuries: row.injuries,
    pt_gender_pref: row.pt_gender_pref,
    anything_else: row.anything_else,
    status: row.status,
    assignedPT: row.assigned_pt_id,
    submittedAt: row.created_at || "",
    notes: "",
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ leads: (data ?? []).map(mapLead) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load leads", detail: String(error) }, { status: 500 });
  }
}
