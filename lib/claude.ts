import Anthropic from "@anthropic-ai/sdk";

type CacheEntry = { content: string; fetchedAt: number };
const promptCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchPromptFile(url: string): Promise<string> {
  const now = Date.now();
  const hit = promptCache.get(url);
  if (hit && now - hit.fetchedAt < CACHE_TTL) return hit.content;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prompt fetch failed: ${url} → ${res.status}`);
  const content = await res.text();
  promptCache.set(url, { content, fetchedAt: now });
  return content;
}

export type AIMatch = { pt_id: number; reasoning: string; client_reasoning: string; caveat?: string | null };
export type AIMatchResponse = { matches: AIMatch[]; overall_reasoning: string };

export async function runMatchingCall(params: {
  systemPrompt: string;
  ptProfiles: string;
  ptIdReference: string;
  clientResponses: Record<string, unknown>;
}): Promise<AIMatchResponse> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userMessage = [
    "## PT Profiles",
    params.ptProfiles,
    "",
    "## PT database IDs",
    "Use these EXACT pt_id values in your response. Only recommend coaches in this list (these are the active roster); do not invent IDs.",
    params.ptIdReference,
    "",
    "## Client Responses",
    JSON.stringify(params.clientResponses, null, 2),
    "",
    "Return ONLY valid JSON (no markdown fences) matching this schema:",
    '{ "matches": [{ "pt_id": number, "reasoning": string, "client_reasoning": string, "caveat": string | null }, ...], "overall_reasoning": string }',
    "Include exactly 3 matches, ranked best-fit first.",
    "reasoning: 1–2 sentences in third person for the ops team (e.g. 'This client mentioned...'). client_reasoning: 1–2 sentences in second person addressed directly to the member (e.g. 'You mentioned...', 'Your focus on...', 'Given your...'). caveat is optional — only include if there is a genuine fit caveat the ops team should know (e.g. specialism mismatch, capacity note). Set null otherwise.",
  ].join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: params.systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = (message.content[0] as { type: "text"; text: string }).text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  return JSON.parse(raw) as AIMatchResponse;
}
