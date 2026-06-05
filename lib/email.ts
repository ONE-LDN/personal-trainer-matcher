import nodemailer from "nodemailer";

// Email is sent through Google Workspace SMTP (a real @oneldn.com mailbox),
// which reuses the SPF/DKIM already configured for the domain — no Resend
// domain verification or DNS changes required.
//
// Required env vars:
//   SMTP_USER  — the @oneldn.com mailbox to authenticate as (e.g. saffron@oneldn.com)
//   SMTP_PASS  — a Google App Password for that mailbox (16 chars, 2FA required)
// Optional:
//   SMTP_FROM  — display From; must be SMTP_USER or a configured send-as alias.
//                Defaults to "ONE LDN PT Matcher <SMTP_USER>".
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL =
  process.env.SMTP_FROM || (SMTP_USER ? `ONE LDN PT Matcher <${SMTP_USER}>` : "");

let transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

type MatchItem = { name: string; reasoning?: string | null; caveat?: string | null };

const GOAL_LABELS: Record<string, string> = {
  performance: "Performance",
  play: "Play & social fitness",
  consistency: "Consistency",
  longevity: "Longevity & health",
  aesthetics: "Aesthetics",
  mindset: "Mindset & resilience",
  other: "Other",
};

const FREQ_LABELS: Record<string, string> = {
  never: "New to training",
  "1_2": "1–2× / week",
  "3_4": "3–4× / week",
  "5_6": "5–6× / week",
  "7plus": "7+ × / week",
};

const PT_GENDER_PREF_LABELS: Record<string, string> = {
  no_preference: "No preference",
  male: "Male",
  female: "Female",
};

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  prefer_not: "Prefer not to say",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDob(dob: string): string {
  if (!dob) return "—";
  const d = new Date(dob);
  if (isNaN(d.getTime())) return dob;
  const day = d.getUTCDate();
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const now = new Date();
  let age = now.getUTCFullYear() - year;
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return `${day} ${month} ${year} (age ${age})`;
}

function labelOr(map: Record<string, string>, value: string, fallback = "—"): string {
  if (!value) return fallback;
  return map[value] ?? value;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Render a list of [label, value] pairs (plus standalone lines) as both
// plain text and HTML with bold labels. `lines` items are either tuples
// (label + value) or single strings (rendered verbatim, no bold).
type BriefLine = [string, string] | string;
function renderBrief(lines: BriefLine[]): { text: string; html: string } {
  const text = lines
    .map((l) => (typeof l === "string" ? l : `${l[0]}: ${l[1]}`))
    .join("\n");
  const htmlInner = lines
    .map((l) =>
      typeof l === "string"
        ? escHtml(l)
        : `<strong>${escHtml(l[0])}:</strong> ${escHtml(l[1])}`,
    )
    .join("\n");
  const html = `<pre style="font-family:'Courier New',monospace;font-size:14px;line-height:1.5;white-space:pre-wrap;margin:0">${htmlInner}</pre>`;
  return { text, html };
}

export async function sendLeadNotificationEmail(params: {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  gender: string;
  goal: string;
  goal_detail: string;
  freq: string;
  pt_gender_pref: string;
  injuries: string;
  anything_else: string;
  matches: MatchItem[];
}) {
  const {
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
    matches,
  } = params;

  const to = process.env.RESEND_NOTIFY_EMAIL;
  if (!to) return;

  const tx = getTransporter();
  if (!tx) {
    console.error("Email not sent — SMTP_USER/SMTP_PASS not configured.");
    return;
  }

  const goalLabel = labelOr(GOAL_LABELS, goal);
  const lines: BriefLine[] = [
    ["Name", `${first_name} ${last_name}`.trim()],
    ["Email", email],
    ["Date of birth", formatDob(dob)],
    ["Gender", labelOr(GENDER_LABELS, gender)],
    ["Goal", goalLabel],
    ["More detail", goal_detail || "—"],
    ["Training frequency", labelOr(FREQ_LABELS, freq)],
    ["PT gender preference", labelOr(PT_GENDER_PREF_LABELS, pt_gender_pref, "No preference")],
    ["Injuries / medical", injuries || "None noted"],
    ["Anything else", anything_else || "—"],
    "",
    "TOP MATCHES",
    "───────────",
  ];
  matches.forEach((m, i) => {
    lines.push(`${i + 1}. ${m?.name ?? "N/A"}`);
    if (m?.reasoning) lines.push(["   Why", m.reasoning]);
    if (m?.caveat) lines.push(["   ⚠ Caveat", m.caveat]);
    lines.push("");
  });
  const { text, html } = renderBrief(lines);

  try {
    await tx.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `New PT Match — ${first_name} ${last_name} (${goalLabel})`,
      text,
      html,
    });
  } catch (err) {
    console.error("Lead-notification email failed:", err);
  }
}

export async function sendPtBriefEmail(params: {
  ptName: string;
  ptEmail: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  gender: string;
  goal: string;
  goal_detail: string;
  freq: string;
  pt_gender_pref: string;
  injuries: string;
  anything_else: string;
  sentBy: string;
}) {
  const {
    ptName,
    ptEmail,
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
    sentBy,
  } = params;

  const tx = getTransporter();
  if (!tx) {
    console.error("PT brief not sent — SMTP_USER/SMTP_PASS not configured.");
    return;
  }

  const memberName = `${first_name} ${last_name}`.trim();
  const goalLabel = labelOr(GOAL_LABELS, goal);
  const { text, html } = renderBrief([
    `Hi ${ptName},`,
    "",
    "You have been assigned a new PT lead at ONE LDN. Please contact them within 24–48 hours to arrange their intro session.",
    "",
    "MEMBER BRIEF",
    "────────────",
    ["Name", memberName],
    ["Email", email],
    ["Date of birth", formatDob(dob)],
    ["Gender", labelOr(GENDER_LABELS, gender)],
    ["Goal", goalLabel],
    ["More detail", goal_detail || "—"],
    ["Training frequency", labelOr(FREQ_LABELS, freq)],
    ["PT gender preference", labelOr(PT_GENDER_PREF_LABELS, pt_gender_pref, "No preference")],
    ["Injuries / medical", injuries || "None noted"],
    ["Anything else", anything_else || "—"],
    "",
    `Sent by: ${sentBy}`,
    "ONE LDN PT Matcher",
  ]);

  const ops = process.env.RESEND_NOTIFY_EMAIL;
  try {
    await tx.sendMail({
      from: FROM_EMAIL,
      to: ptEmail,
      ...(ops ? { cc: [ops] } : {}),
      subject: `New PT Lead — ${memberName} (${goalLabel})`,
      text,
      html,
    });
  } catch (err) {
    console.error("PT-brief email failed:", err);
  }
}
