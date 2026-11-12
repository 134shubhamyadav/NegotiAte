import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Target,
  ArrowUpRight,
  Shield,
  MessageSquare,
  Mail,
  PhoneCall,
} from "lucide-react";
import { counterRange, USER_PRIORITIES } from "../engine/counterRange.js";
import { benchmark } from "../engine/benchmark.js";
import {
  generateNegotiationScripts,
  buildDeterministicScripts,
} from "../ai/generateNegotiationScripts.js";

export default function Col3Playbook({ offer, apiKey, onToast }) {
  const [activeTab, setActiveTab] = useState("email"); // 'email' | 'whatsapp' | 'phone'
  const [tone, setTone] = useState("collaborative"); // 'collaborative' | 'direct' | 'curious'
  const [priority, setPriority] = useState(USER_PRIORITIES.CASH);
  const [showProof, setShowProof] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiDrafts, setAiDrafts] = useState(null);

  // 1. Calculate deterministic counter-offer boundaries
  const benchmarkResult = benchmark({
    role: offer.role || "Software Engineer",
    city: offer.city || "Bengaluru",
    companyTier: offer.companyTier || "product",
    employmentType: offer.employmentType || "fulltime",
  });

  const counterPlan = counterRange({
    offer,
    benchmarkResult,
    userPriorities: priority,
  });

  // 2. Generate deterministic baseline scripts immediately
  const deterministicScripts = buildDeterministicScripts({
    offer,
    counter: counterPlan,
    benchmark: benchmarkResult,
    userPreferences: { tone, recipient: "hr" },
  });

  // Active drafts: either AI generated or deterministic baseline
  const currentScripts = aiDrafts || deterministicScripts;

  // Handle Copy to clipboard
  const handleCopy = async () => {
    let textToCopy = "";
    if (activeTab === "email") {
      textToCopy = `Subject: ${currentScripts.email?.subject || ""}\n\n${currentScripts.email?.body || ""}`;
    } else if (activeTab === "whatsapp") {
      textToCopy = currentScripts.whatsapp?.message || "";
    } else if (activeTab === "phone") {
      const points = currentScripts.phone?.openingTalkingPoints || currentScripts.phone?.talkingPoints || [];
      const objections = currentScripts.phone?.objectionResponses || [];
      textToCopy = `LIVE TALKING POINTS:\n${points.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\nOBJECTION HANDLING:\n${objections
        .map((o) => `Q: ${o.objection}\nA: ${o.response}`)
        .join("\n\n")}`;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onToast) onToast("Draft copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + C
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && window.getSelection().toString() === "") {
        handleCopy();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Handle AI Script Generation
  const handleGenerateAi = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await generateNegotiationScripts({
        engineOutputs: {
          offer,
          counter: counterPlan,
          benchmark: benchmarkResult,
        },
        userPreferences: {
          tone,
          recipient: activeTab === "whatsapp" ? "hiring_manager" : "hr",
        },
        apiKey,
      });

      setAiDrafts(res);
      if (res.isRateLimited) {
        if (onToast) onToast("AI rate limit reached: loaded pre-calculated drafts.");
      } else {
        if (onToast) onToast("Calibrated negotiation drafts generated!");
      }
    } catch (err) {
      if (onToast) onToast(`Using calculated drafts: ${err.message}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Column Header */}
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 tracking-tight dark:text-zinc-100">
          3. The Playbook
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Defensible numbers, non-salary levers, and ready-to-send messages.
        </p>
      </div>

      {/* Strategic Numbers Grid: Anchor, Target, Floor */}
      <div className="grid grid-cols-3 gap-2">
        {/* Anchor */}
        <div className="rounded-md border border-teal-200 bg-teal-50/50 p-2.5 text-center dark:border-teal-900/60 dark:bg-teal-950/20">
          <span className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#0F766E] uppercase tracking-wide dark:text-teal-400">
            <ArrowUpRight className="h-3 w-3" />
            Anchor (Ask)
          </span>
          <p className="tabular-nums font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
            {counterPlan.anchorFormatted}
          </p>
          <span className="text-[10px] text-zinc-500">Opening proposal</span>
        </div>

        {/* Target */}
        <div className="rounded-md border border-zinc-200 bg-white p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <span className="flex items-center justify-center gap-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-wide dark:text-zinc-400">
            <Target className="h-3 w-3 text-zinc-500" />
            Target (Settle)
          </span>
          <p className="tabular-nums font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
            {counterPlan.targetFormatted}
          </p>
          <span className="text-[10px] text-zinc-500">Realistic goal</span>
        </div>

        {/* Floor */}
        <div className="rounded-md border border-zinc-200 bg-white p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <span className="flex items-center justify-center gap-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-wide dark:text-zinc-400">
            <Shield className="h-3 w-3 text-zinc-500" />
            Floor (Walk)
          </span>
          <p className="tabular-nums font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
            {counterPlan.floorFormatted}
          </p>
          <span className="text-[10px] text-zinc-500">Private reserve</span>
        </div>
      </div>

      {/* "How this was calculated" Mathematical Proof Expander */}
      <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => setShowProof(!showProof)}
          className="flex w-full items-center justify-between text-left text-xs font-medium text-zinc-800 hover:text-[#0F766E] dark:text-zinc-200"
        >
          <span className="flex items-center gap-1.5 font-semibold">
            <HelpCircle className="h-3.5 w-3.5 text-[#0F766E]" />
            How this strategy was calculated
          </span>
          {showProof ? (
            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          )}
        </button>

        {showProof && (
          <div className="mt-2.5 flex flex-col gap-2 border-t border-zinc-100 pt-2.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            {counterPlan.reasoningSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-mono text-[11px] font-semibold text-[#0F766E] dark:text-teal-400">
                  {idx + 1}.
                </span>
                <p className="text-[11px] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 3 Concrete Asks */}
      <div className="rounded-md border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Top 3 Concrete Asks
          </span>
          <div className="flex gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setPriority(USER_PRIORITIES.CASH)}
              className={`rounded px-1.5 py-0.5 ${priority === USER_PRIORITIES.CASH
                  ? "bg-teal-50 font-semibold text-[#0F766E] dark:bg-teal-950/60"
                  : "text-zinc-500"
                }`}
            >
              Cash
            </button>
            <button
              type="button"
              onClick={() => setPriority(USER_PRIORITIES.GROWTH)}
              className={`rounded px-1.5 py-0.5 ${priority === USER_PRIORITIES.GROWTH
                  ? "bg-teal-50 font-semibold text-[#0F766E] dark:bg-teal-950/60"
                  : "text-zinc-500"
                }`}
            >
              Growth
            </button>
            <button
              type="button"
              onClick={() => setPriority(USER_PRIORITIES.FLEXIBILITY)}
              className={`rounded px-1.5 py-0.5 ${priority === USER_PRIORITIES.FLEXIBILITY
                  ? "bg-teal-50 font-semibold text-[#0F766E] dark:bg-teal-950/60"
                  : "text-zinc-500"
                }`}
            >
              Flex
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex flex-col gap-2">
          {counterPlan.topAsks.map((ask, idx) => (
            <div
              key={idx}
              className="rounded border border-zinc-100 bg-zinc-50/70 p-2 text-xs dark:border-zinc-800/80 dark:bg-zinc-800/40"
            >
              <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-[#0F766E] dark:bg-teal-900/60 dark:text-teal-300">
                  {idx + 1}
                </span>
                <span>{ask.title}</span>
              </div>
              <p className="mt-1 pl-5.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                {ask.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Copy-Pasteable Drafts (Tabs: Email, WhatsApp, Phone Script) */}
      <div className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Channel Tabs */}
          <div className="flex rounded-md bg-zinc-100 p-0.5 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors ${activeTab === "email"
                  ? "bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
            >
              <Mail className="h-3 w-3" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors ${activeTab === "whatsapp"
                  ? "bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
            >
              <MessageSquare className="h-3 w-3" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("phone")}
              className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors ${activeTab === "phone"
                  ? "bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
            >
              <PhoneCall className="h-3 w-3" />
              <span>Phone</span>
            </button>
          </div>

          {/* Action buttons: Tone & Copy */}
          <div className="flex items-center gap-1.5">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="collaborative">Collaborative</option>
              <option value="firm">Firm & Direct</option>
              <option value="curious">Curious / Exploring</option>
            </select>

            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-semibold shadow-2xs transition-colors ${copied
                  ? "border-teal-500 bg-teal-50 text-[#0F766E] dark:bg-teal-950 dark:border-teal-700 dark:text-teal-300"
                  : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Preview Box */}
        <div className="mt-2 rounded border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950">
          {activeTab === "email" && (
            <div className="flex flex-col gap-2">
              <div className="border-b border-zinc-200 pb-1.5 font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                <span className="text-[10px] text-zinc-500">Subject: </span>
                {currentScripts.email?.subject}
              </div>
              <div className="whitespace-pre-line text-zinc-700 leading-relaxed dark:text-zinc-300">
                {currentScripts.email?.body}
              </div>
            </div>
          )}

          {activeTab === "whatsapp" && (
            <div className="whitespace-pre-line text-zinc-800 leading-relaxed dark:text-zinc-200">
              {currentScripts.whatsapp?.message}
            </div>
          )}

          {activeTab === "phone" && (
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Live Talking Points:
                </p>
                <ul className="mt-1 flex flex-col gap-1.5 pl-4 list-disc text-zinc-700 dark:text-zinc-300">
                  {(
                    currentScripts.phone?.openingTalkingPoints ||
                    currentScripts.phone?.talkingPoints ||
                    []
                  ).map((p, i) => (
                    <li key={i} className="leading-snug">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Handling Common Pushbacks:
                </p>
                <div className="mt-1.5 flex flex-col gap-2">
                  {(currentScripts.phone?.objectionResponses || []).map((o, idx) => (
                    <div
                      key={idx}
                      className="rounded border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <p className="font-medium text-amber-800 text-[11px] dark:text-amber-300">
                        Counterpart: &ldquo;{o.objection}&rdquo;
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                        You: {o.response}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Polish Button */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>
            {aiDrafts ? "Generated with Groq Llama 3.3 70B" : "Using instant calculated templates"}
          </span>
          <button
            type="button"
            disabled={isGeneratingAi}
            onClick={handleGenerateAi}
            className="inline-flex items-center gap-1 font-medium text-[#0F766E] hover:underline disabled:opacity-50 dark:text-teal-400"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isGeneratingAi ? "Generating..." : "Polish Language with AI"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

Col3Playbook.propTypes = {
  offer: PropTypes.shape({
    role: PropTypes.string,
    city: PropTypes.string,
    companyTier: PropTypes.string,
    employmentType: PropTypes.string,
    fixedCtc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variable: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    joiningBonus: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    hasOutsideOffer: PropTypes.bool,
    outsideOfferValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  apiKey: PropTypes.string,
  onToast: PropTypes.func,
};