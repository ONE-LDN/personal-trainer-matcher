import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const assignedBy = session?.user?.email;
    if (!assignedBy) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId, ptId, status } = await request.json();
    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();
    const nextStatus = status || "assigned";

    if (ptId) {
      const { error: assignmentError } = await supabase.from("lead_assignments").insert({
        lead_id: leadId,
        pt_id: ptId,
        assigned_by: assignedBy,
      });
      if (assignmentError) throw assignmentError;
    }

    const { data: updatedLead, error: leadError } = await supabase
      .from("leads")
      .update({ assigned_pt_id: ptId ?? null, status: nextStatus })
      .eq("id", leadId)
      .select("*")
      .single();
    if (leadError) throw leadError;

    return NextResponse.json({ ok: true, lead: updatedLead });
  } catch (error) {
    return NextResponse.json({ error: "Failed assignment", detail: String(error) }, { status: 500 });
  }
}
