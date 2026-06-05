import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { fetchPromptFile, runMatchingCall } from "@/lib/claude";
import { sendLeadNotificationEmail } from "@/lib/email";

function splitName(fullName: string) {
  const trimmed = (fullName || "").trim();
  if (!trimmed) return { first_name: "", last_name: "" };
  const parts = trimmed.split(/\s+/);
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const {
      name,
      email,
      dob,
      gender,
      goal,
      goal_detail,
      freq,
      injuries,
      pt_gender_pref,
      anything_else,
    } = payload as {
      name: string;
      email: string;
      dob: string;
      gender: string;
      goal: string;
      goal_detail: string;
      freq: string;
      injuries: string;
      pt_gender_pref: string;
      anything_else: string;
    };

    if (!name || !email || !goal || !freq) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { first_name, last_name } = splitName(name);
    const supabase = getSupabaseServiceClient();

    // Fetch active roster and prompt files in parallel
    const [{ data: rosterData, error: rosterError }, systemPrompt, ptProfiles] =
      await Promise.all([
        supabase.from("pt_roster").select("*").eq("active", true),
        fetchPromptFile(process.env.MATCHING_PROMPT_URL!),
        fetchPromptFile(process.env.PT_PROFILES_URL!),
      ]);

    if (rosterError) throw rosterError;
    const roster = rosterData ?? [];

    // Hard constraint: a stated trainer gender preference is non-negotiable.
    // Remove non-matching PTs from the candidate pool entirely so the AI
    // physically cannot recommend them (and any stray match is dropped on enrichment).
    const genderPref =
      pt_gender_pref && pt_gender_pref !== "no_preference" ? pt_gender_pref : null;
    const candidates = genderPref
      ? roster.filter((r) => r.gender === genderPref)
      : roster;

    // Build an id→name reference so Claude returns real database IDs (candidate pool only)
    const ptIdReference = candidates
      .map((r) => `${r.id} = ${r.name}`)
      .join("\n");

    // Call Claude to match the client
    const aiResponse = await runMatchingCall({
      systemPrompt,
      ptProfiles,
      ptIdReference,
      clientResponses: { goal, freq, injuries, gender, pt_gender_pref, goal_detail, anything_else },
    });

    // Enrich AI matches with full PT data from the candidate pool
    const matches = aiResponse.matches
      .map((m) => {
        const pt = candidates.find((r) => r.id === m.pt_id);
        if (!pt) return null;
        return {
          ...pt,
          bestFor: pt.best_for, // normalise snake_case → camelCase for client
          reasoning: m.reasoning,
          caveat: m.caveat ?? null,
        };
      })
      .filter(Boolean);

    // Insert lead
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .insert({
        first_name,
        last_name,
        email,
        age: dob,
        gender,
        goal,
        goal_detail,
        freq,
        injuries,
        pt_gender_pref,
        anything_else,
        status: "new",
        assigned_pt_id: matches[0]?.id ?? null,
      })
      .select("*")
      .single();
    if (leadError) throw leadError;

    // Write to match_log
    await supabase.from("match_log").insert({
      lead_id: leadData.id,
      client_responses: payload,
      ai_matches: aiResponse.matches,
      ai_reasoning: { overall: aiResponse.overall_reasoning },
      selected_pt_id: matches[0]?.id ?? null,
    });

    // Send ops notification email
    await sendLeadNotificationEmail({
      first_name,
      last_name,
      email,
      dob,
      gender,
      goal,
      goal_detail,
      freq,
      pt_gender_pref,
      injuries,
      anything_else,
      matches: matches.map((m) => ({
        name: m!.name,
        reasoning: m!.reasoning ?? null,
        caveat: m!.caveat ?? null,
      })),
    });

    return NextResponse.json({ lead: leadData, matches });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit lead", detail: String(error) },
      { status: 500 }
    );
  }
}
