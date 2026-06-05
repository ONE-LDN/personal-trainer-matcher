import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPtEmail } from "@/lib/pt-emails";
import { sendPtBriefEmail } from "@/lib/email";
import { getSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sentBy = session?.user?.email;
    if (!sentBy) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId } = await request.json();
    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();
    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const ptId = lead.assigned_pt_id;
    if (!ptId) {
      return NextResponse.json({ error: "Assign a PT before sending a brief" }, { status: 400 });
    }

    const { data: pt, error: ptError } = await supabase
      .from("pt_roster")
      .select("id, name")
      .eq("id", ptId)
      .single();
    if (ptError || !pt) {
      return NextResponse.json({ error: "Assigned PT not found" }, { status: 404 });
    }

    const ptEmail = getPtEmail(pt.id);
    if (!ptEmail) {
      return NextResponse.json(
        { error: "No email on file for this coach. Add it in lib/pt-emails.ts" },
        { status: 400 }
      );
    }

    await sendPtBriefEmail({
      ptName: pt.name,
      ptEmail,
      first_name: lead.first_name,
      last_name: lead.last_name ?? "",
      email: lead.email,
      dob: lead.age ?? "",
      gender: lead.gender ?? "",
      goal: lead.goal ?? "",
      goal_detail: lead.goal_detail ?? "",
      freq: lead.freq ?? "",
      pt_gender_pref: lead.pt_gender_pref ?? "",
      injuries: lead.injuries ?? "",
      anything_else: lead.anything_else ?? "",
      sentBy,
    });

    return NextResponse.json({ ok: true, ptName: pt.name, ptEmail });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send brief", detail: String(error) }, { status: 500 });
  }
}
