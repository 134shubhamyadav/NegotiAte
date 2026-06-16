/**
 * @fileoverview Groq LLM API integration and prompt engineering utilities
 * for generating WFH proposal emails in NegotiAte.
 */

import { MODE_LABELS } from "./constants.js";

/**
 * Calls the Groq Chat Completions API with the given prompt and returns
 * the generated text content.
 *
 * @param {string} apiKey - The Groq API key (Bearer token).
 * @param {string} prompt - The user-role prompt to send to the model.
 * @returns {Promise<string>} The raw text response from the model.
 * @throws {Error} If the API responds with a non-OK status.
 */
export async function callGroq(apiKey, prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.72,
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

/**
 * @typedef {Object} PromptInputs
 * @property {string} name - Employee's full name.
 * @property {string} role - Employee's job title.
 * @property {string} industry - Industry sector.
 * @property {string} company - Company name.
 * @property {string} [managerName] - Manager's name (optional).
 * @property {string} [extraContext] - Additional context for personalisation.
 * @property {number} distanceKm - One-way commute distance in km.
 * @property {string} mode - Transport mode key.
 * @property {number} officeDaysPerWeek - Current weekly office days.
 * @property {number} wfhDaysRequested - Requested WFH days per week.
 * @property {import('./calculations').SavingsResult} savings - Computed savings metrics.
 * @property {string} tone - Proposal tone: 'corporate' | 'collaborative' | 'analytical'.
 */

/**
 * Builds a structured, tone-aware prompt for the Groq LLM to generate
 * a professional WFH negotiation email.
 *
 * @param {PromptInputs} inputs
 * @returns {string} The fully constructed prompt string.
 */
export function buildPrompt({
  name,
  role,
  industry,
  company,
  managerName,
  extraContext,
  distanceKm,
  mode,
  officeDaysPerWeek,
  wfhDaysRequested,
  savings,
  tone,
}) {
  const manager = managerName || "Manager";

  const toneGuideline =
    tone === "collaborative"
      ? `Write using a collaborative, warm, and professional tone. Focus on team trust, collaborative alignment, and productivity. Frame the hybrid schedule as a mutual win: maintaining close team connection, scheduling key collaborative sessions on in-office days, and using WFH days for deep execution. Mention the Scope 3 carbon reduction of ${Math.round(
          savings.savedAnnualKg
        )} kg CO2e/year as an alignment with modern environmental standards.`
      : tone === "analytical"
      ? `Write using a highly direct, logical, and analytical tone. Lead with metrics, efficiency indicators, and data. Highlight the exact hours reclaimed (${Math.round(
          savings.savedHoursPerYear
        )}h/yr) and the carbon offset footprint reduction of ${Math.round(
          savings.savedAnnualKg
        )} kg CO2e/year (${savings.pctReduction}% cut). Keep the email structured, objective, and outcome-focused. Avoid personal narrative; focus on empirical productivity gains.`
      : `Write using a highly formal, professional, and corporate tone suitable for an executive proposal. Focus entirely on business benefits, uninterrupted deep-work time, productivity metrics, and corporate ESG (Scope 3 carbon reduction) alignment. Do not use casual language or focus on personal convenience (e.g. avoid phrases like "work-life balance" or "benefit me").`;

  return `You are an expert executive workplace negotiation coach. Write a highly persuasive and professional hybrid work proposal email.

EMPLOYEE: ${name}, ${role} at ${company} (${industry})
MANAGER: ${manager}
COMMUTE: ${distanceKm}km one-way via ${MODE_LABELS[mode]}, currently ${officeDaysPerWeek} days/week in office
REQUESTING: ${wfhDaysRequested} WFH day(s)/week
CO2 IMPACT: Currently emitting ${Math.round(savings.currentAnnualKg)}kg CO2e/year from commuting. WFH would save ${Math.round(
    savings.savedAnnualKg
  )}kg CO2e/year (${savings.pctReduction}% reduction, = ${savings.treesEquiv} trees planted).
FINANCIAL: Employee saves approx ₹${Math.round(savings.savedFuelCost).toLocaleString()}/year in fuel/transport.
EXTRA CONTEXT: ${extraContext || "None"}

TONE REQUIREMENT: ${toneGuideline}

Respond in EXACTLY this format:

Subject: [Formal and compelling subject line, e.g. Proposal for Optimized Hybrid Work Schedule]

Dear ${manager},

[Paragraph 1: Context and request. Frame the proposal as a strategic operational initiative to optimize focus time and output.]

[Paragraph 2: Business Case & Productivity. Introduce 3 structured bullet points detailing operational benefits:
• [Point 1: Uninterrupted focus blocks for complex tasks and deep-work efficiency]
• [Point 2: Commute time conversion to active work hours and core meeting synchronization]
• [Point 3: Low-overhead, high-autonomy collaboration methods]
Make the bullet points concise, formal, and action-oriented.]

[Paragraph 3: Sustainability and ESG Impact. Explain how the reduction of ${Math.round(
    savings.savedAnnualKg
  )} kg CO2e/year directly aligns with the corporate sustainability goals of ${company} and contributes to Scope 3 carbon offsets. Mention the equivalent trees planted (${
    savings.treesEquiv
  }) or percentage reduction (${savings.pctReduction}%).]

[Paragraph 4: Structured Trial Period. Propose a structured 60-day trial with specific checkpoints to review deliverables, align with team communication guidelines, and establish key performance indicators (KPIs) to ensure zero drop in team velocity. Close with a call to action to discuss in person.]

Sincerely,

${name}
${role}

TALKING_POINTS:
- [point 1 - lead with the carbon offset metric]
- [point 2 - productivity/focus block argument]
- [point 3 - retention/modern workplace standards argument]

OBJECTIONS:
- [Objection 1]: [response in 1-2 sentences]
- [Objection 2]: [response in 1-2 sentences]`;
}

/**
 * @typedef {Object} ParsedProposal
 * @property {string} subject - Email subject line.
 * @property {string} emailBody - Full email body text.
 * @property {string[]} talkingPoints - Array of talking point strings.
 * @property {string[]} objections - Array of objection+response strings.
 */

/**
 * Parses a raw LLM response string into structured proposal sections.
 *
 * @param {string} raw - The raw text output from the LLM.
 * @returns {ParsedProposal} The parsed and structured proposal.
 */
export function parseProposal(raw) {
  const subjectMatch = raw.match(/Subject:\s*(.+)/i);
  const subject = subjectMatch?.[1]?.trim().replace(/\*\*/g, "") ?? "WFH Proposal";
  const tpIdx = raw.indexOf("TALKING_POINTS:");
  const objIdx = raw.indexOf("OBJECTIONS:");
  const emailEnd = tpIdx > -1 ? tpIdx : raw.length;
  const emailBody = raw
    .slice(0, emailEnd)
    .replace(/^Subject:\s*.+\n?/im, "")
    .replace(/\*\*/g, "")
    .trim();
  const tpRaw = tpIdx > -1 ? raw.slice(tpIdx + 15, objIdx > -1 ? objIdx : undefined) : "";
  const objRaw = objIdx > -1 ? raw.slice(objIdx + 11) : "";

  /**
   * Splits a raw bullet-point section into a clean string array.
   * @param {string} s
   * @returns {string[]}
   */
  const parseList = (s) =>
    s
      .split("\n")
      .map((l) => l.replace(/^[-•*\d.)\s]+/, "").trim())
      .filter(Boolean);

  return { subject, emailBody, talkingPoints: parseList(tpRaw), objections: parseList(objRaw) };
}

/**
 * Generates a realistic mock proposal for demo / fallback mode.
 * Mirrors the structure of a real LLM response so the UI renders identically.
 *
 * @param {{
 *   name: string,
 *   role: string,
 *   company: string,
 *   managerName?: string,
 *   wfhDaysRequested: number,
 *   savings: import('./calculations').SavingsResult,
 * }} inputs
 * @returns {string} A raw mock proposal string in the same format as LLM output.
 */
export function getMockProposal({ name, role, company, managerName, wfhDaysRequested, savings }) {
  const manager = managerName || "Team Lead";
  const carbonSaved = Math.round(savings.savedAnnualKg);
  const timeSaved = Math.round(savings.savedHoursPerYear);

  return `Subject: WFH Proposal: Enhancing Productivity & ESG Impact

Dear ${manager},

I am writing to formally propose a hybrid work schedule of ${wfhDaysRequested} work-from-home day(s) per week, while continuing to work from the office on the remaining days. After analyzing my current workflow and commute, I am confident this arrangement will optimize my focus time while maintaining close collaboration with the team.

This hybrid schedule will directly benefit our output in several key ways:
• Reclaiming ${timeSaved} hours of weekly commute time, which will be reinvested into focused engineering work.
• Establishing dedicated, uninterrupted focus blocks for complex developer tasks like architecture review and coding.
• Maintaining team alignment by scheduling all core syncs and client meetings on my in-office days.

Additionally, this proposal aligns directly with modern environmental, social, and governance (ESG) targets. By working remotely ${wfhDaysRequested} day(s) per week, I will eliminate ${carbonSaved} kg of CO₂e commute emissions annually (a ${
    savings.pctReduction
  }% reduction in my transit footprint). This represents a measurable contribution toward sustainability goals that can be reflected in corporate Scope 3 reporting.

I propose we try this schedule for a 60-day trial period, after which we can review performance metrics and output to ensure team velocity remains high. Thank you for your support, and I look forward to discussing how we can make this work for our team.

Best regards,

${name}
${role}, ${company}

TALKING_POINTS:
- Commute elimination cuts my transit carbon footprint by ${carbonSaved} kg CO₂e/year (= ${savings.treesEquiv} trees planted).
- Reclaims ${timeSaved} hours of weekly travel time to convert directly into focused, deep-work engineering output.
- Lowers company office resource consumption while supporting team retention and modern hybrid standards.

OBJECTIONS:
- How will we ensure communication doesn't slip?: I will be fully available on Slack/Teams during core business hours and will structure my in-office days around team synchronization and meetings.
- Will this set a precedent for the entire team?: Each request can be evaluated on individual role requirements and performance, starting with this structured 60-day trial to measure results.`;
}
