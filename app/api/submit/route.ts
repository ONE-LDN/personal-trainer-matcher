import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { matchPTs, type MatchLeadInput, type MatchPT } from "@/lib/matching";
import { sendLeadNotificationEmail } from "@/lib/resend";

function splitName(fullName: string) {
  const trimmed = (fullName || "").trim();
  if (!trimmed) return { first_name: "", last_name: "" };
  const parts = trimmed.split(/\s+/);
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const leadInput: MatchLeadInput & {
      name: string;
      email: string;
      dob: string;
      goal_detail: string;
      anything_else: string;
    } = payload;

    if (!leadInput.name || !leadInput.email || !leadInput.goal || !leadInput.freq) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { first_name, last_name } = splitName(leadInput.name);
    const supabase = getSupabaseServiceClient();

    const { data: rosterData, error: rosterError } = await supabase
      .from("pt_roster")
      .select("*")
      .eq("active", true);
    if (rosterError) throw rosterError;

    const roster = (rosterData ?? []) as unknown as MatchPT[];
    const matches = matchPTs(leadInput, roster);

    const top = matches[0];
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .insert({
        first_name,
        last_name,
        email: leadInput.email,
        age: leadInput.dob,
        gender: leadInput.gender,
        goal: leadInput.goal,
        goal_detail: leadInput.goal_detail,
        freq: leadInput.freq,
        injuries: leadInput.injuries,
        pt_gender_pref: leadInput.pt_gender_pref,
        anything_else: leadInput.anything_else,
        status: "new",
        assigned_pt_id: top?.id ?? null,
      })
      .select("*")
      .single();
    if (leadError) throw leadError;

    await sendLeadNotificationEmail({
      first_name,
      last_name,
      email: leadInput.email,
      dob: leadInput.dob,
      gender: leadInput.gender,
      goal: leadInput.goal,
      goal_detail: leadInput.goal_detail,
      freq: leadInput.freq,
      pt_gender_pref: leadInput.pt_gender_pref,
      injuries: leadInput.injuries,
      anything_else: leadInput.anything_else,
      matches: matches.map((m) => ({ name: m.name, score: m.score ?? 0 })),
    });

    return NextResponse.json({ lead: leadData, matches });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit lead", detail: String(error) }, { status: 500 });
  }
}
