import { useState } from "react";
import { Btn } from "./UI.jsx";

export default function Step4Proposal({ proposal, savings, commuteForm, profileForm, onBack, onRestart }) {
  const [tab, setTab] = useState("talking");
  const [copied, setCopied] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false]);

  const fullEmail = `Subject: ${proposal.subject}\n\n${proposal.emailBody}`;

  function copy() {
    navigator.clipboard.writeText(fullEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const shareText = `I just calculated my commute carbon footprint — ${Math.round(
    savings.savedAnnualKg
  )} kg CO₂e/year could be saved by working from home ${commuteForm.wfhDaysRequested} day(s)/week! 🌱`;
  const shareUrl = "https://negotiate-webapp.vercel.app";

  const toggleCheck = (i) => setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const downloadCarbonCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 780;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 780);
    grad.addColorStop(0, "#022c22"); // Dark forest green
    grad.addColorStop(0.5, "#0f172a"); // Slate dark
    grad.addColorStop(1, "#115e59"); // Teal green
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 780);

    // 2. Decorative elements (glow circles)
    ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
    ctx.beginPath();
    ctx.arc(100, 150, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(20, 184, 166, 0.08)";
    ctx.beginPath();
    ctx.arc(500, 650, 220, 0, Math.PI * 2);
    ctx.fill();

    // 3. Border accent
    ctx.strokeStyle = "rgba(52, 211, 153, 0.2)";
    ctx.lineWidth = 12;
    ctx.strokeRect(16, 16, 568, 748);

    ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, 552, 732);

    // 4. Header title
    ctx.fillStyle = "#34d399"; // emerald-400
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMMUTE SUSTAINABILITY PASSPORT", 300, 70);

    // 5. Leaf Icon or Emblem
    ctx.fillStyle = "rgba(52, 211, 153, 0.1)";
    ctx.beginPath();
    ctx.arc(300, 280, 90, 0, Math.PI * 2);
    ctx.fill();

    // Leaf Icon
    ctx.font = "52px sans-serif";
    ctx.fillText("🌱", 300, 145);

    // 6. Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(profileForm.name || "Employee Name", 300, 215);

    // 7. Role & Company
    ctx.fillStyle = "#94a3b8"; // slate-400
    ctx.font = "16px sans-serif";
    ctx.fillText(`${profileForm.role || "Professional"} at ${profileForm.company || "Company"}`, 300, 245);

    // 8. Divider line
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 280);
    ctx.lineTo(520, 280);
    ctx.stroke();

    // 9. CO2 saved label and huge stat
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText(`${Math.round(savings.savedAnnualKg)}`, 300, 360);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("KG CO₂e SAVED / YEAR", 300, 395);

    // 10. Secondary Stats layout (Trees and Time saved)
    // Left Column - Trees
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(`${savings.treesEquiv}`, 180, 480);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    ctx.fillText("Trees Planted Eq.", 180, 505);

    // Right Column - Hours
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(`${Math.round(savings.savedHoursPerYear)}h`, 420, 480);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    ctx.fillText("Commute Hours Cut", 420, 505);

    // Another divider
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.beginPath();
    ctx.moveTo(80, 550);
    ctx.lineTo(520, 550);
    ctx.stroke();

    // 11. Custom Footprint reduction & cash saved row
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(`TRANSIT FOOTPRINT CUT BY ${savings.pctReduction}%`, 300, 590);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px sans-serif";
    ctx.fillText(`Annual savings of approx ₹${Math.round(savings.savedFuelCost).toLocaleString()}`, 300, 620);

    // 12. Footer / Watermark
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "11px sans-serif";
    ctx.fillText("GENERATED VIA NEGOTIATE APP", 300, 690);

    ctx.font = "12px sans-serif";
    ctx.fillText("💡 Turn your commute into hybrid leverage", 300, 715);

    // Trigger download
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${profileForm.name.replace(/\s+/g, "-").toLowerCase() || "commute"}-sustainability-card.png`;
    link.href = image;
    link.click();
  };

  const tabs = [
    { id: "talking", label: "🗣️ Talking points" },
    { id: "objections", label: "🛡️ Objections" },
    { id: "impact", label: "📊 Carbon Card" },
    { id: "timeline", label: "📅 Trial Timeline" },
  ];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Proposal Ready</span>
        </div>
        <h2 className="text-lg font-bold leading-tight mb-1 tracking-tight">{proposal.subject}</h2>
        <p className="text-slate-400 text-xs">
          Prepared for {profileForm.name} · {profileForm.role} at {profileForm.company} · Saves{" "}
          <span className="text-emerald-400 font-semibold">{Math.round(savings.savedAnnualKg)} kg CO₂e/yr</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Email Draft (Always visible) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">📧 Email Draft</span>
              <button
                onClick={copy}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1 active:scale-95 cursor-pointer border-0 bg-transparent"
              >
                {copied ? (
                  "✓ Copied!"
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="px-4 sm:px-5 py-4 max-h-[380px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">{proposal.emailBody}</pre>
            </div>
            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 flex justify-end bg-slate-50/55">
              <Btn variant="green" onClick={copy} className="text-xs">
                {copied ? "✓ Copied to clipboard" : "Copy full email"}
              </Btn>
            </div>
          </div>
        </div>

        {/* Right Column: Objections, Talking points, etc. tabs */}
        <div className="md:col-span-5 space-y-4">
          {/* Tabs header */}
          <div role="tablist" aria-label="Proposal options" className="flex gap-1 bg-slate-100 rounded-2xl p-1 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={`tabpanel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`flex-1 min-w-fit py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border-0 ${
                  tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 bg-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[160px]">
            {tab === "talking" && (
              <div id="tabpanel-talking" role="tabpanel" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm animate-fade-in">
                <p className="text-xs font-bold text-slate-800 mb-3">Key Talking Points (use in person)</p>
                {proposal.talkingPoints.length > 0 ? (
                  <div className="space-y-2">
                    {proposal.talkingPoints.map((pt, i) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-slate-600">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="leading-relaxed">{pt}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Talking points are embedded in the email draft.</p>
                )}
              </div>
            )}

            {tab === "objections" && (
              <div id="tabpanel-objections" role="tabpanel" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm animate-fade-in">
                <p className="text-xs font-bold text-slate-800 mb-3">Objection Handling</p>
                {proposal.objections.length > 0 ? (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {proposal.objections.map((obj, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 leading-relaxed border border-slate-100"
                      >
                        {obj}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Objection handling points are listed in the email.</p>
                )}
              </div>
            )}

            {tab === "impact" && (
              <div id="tabpanel-impact" role="tabpanel" className="animate-fade-in space-y-4">
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 text-white rounded-3xl p-5 sm:p-6 shadow-xl aspect-[5/7] max-w-[280px] mx-auto flex flex-col justify-between group hover:shadow-emerald-500/5 transition-all duration-300">
                  {/* Glow effects */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header */}
                  <div className="text-center space-y-1 z-10">
                    <p className="text-[8px] font-bold text-emerald-400 tracking-widest uppercase">
                      Commute Sustainability Passport
                    </p>
                    <div className="h-px w-8 bg-emerald-500/30 mx-auto" />
                  </div>

                  {/* Main Profile Info */}
                  <div className="text-center space-y-1.5 z-10 my-3">
                    <div className="text-2xl">🌱</div>
                    <h3 className="text-base font-black text-white tracking-tight leading-tight">
                      {profileForm.name || "Your Name"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium leading-none">{profileForm.role || "Your Role"}</p>
                    <p className="text-[9px] text-slate-500 font-normal leading-none">{profileForm.company || "Company"}</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-800 my-1 z-10" />

                  {/* Large Metric */}
                  <div className="text-center space-y-0.5 z-10">
                    <p className="text-3xl font-black text-emerald-400 leading-none tracking-tight">
                      {Math.round(savings.savedAnnualKg)}
                    </p>
                    <p className="text-[8px] text-slate-300 font-bold uppercase tracking-wider">Kg CO₂e Saved / Year</p>
                  </div>

                  {/* Sub metrics */}
                  <div className="grid grid-cols-2 gap-2 text-center z-10 mt-2 pt-2 border-t border-slate-900">
                    <div>
                      <p className="text-sm font-bold text-white leading-none">{savings.treesEquiv}</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">Trees Eq.</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none">{Math.round(savings.savedHoursPerYear)}h</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">Hours Cut</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center space-y-1 pt-2 border-t border-slate-800 z-10">
                    <p className="text-[9px] text-emerald-400/90 font-bold uppercase tracking-wide">
                      Transit Footprint Cut by {savings.pctReduction}%
                    </p>
                    <p className="text-[7px] text-slate-500 uppercase tracking-widest">Verified by NegotiAte</p>
                  </div>
                </div>

                <div className="text-center max-w-[280px] mx-auto">
                  <button
                    onClick={downloadCarbonCard}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-95 transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer border-0"
                  >
                    <span>💾</span> Download Card (PNG)
                  </button>
                </div>
              </div>
            )}

            {tab === "timeline" && (
              <div id="tabpanel-timeline" role="tabpanel" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm animate-fade-in space-y-4">
                <div className="mb-1">
                  <p className="text-xs font-bold text-slate-800">Structured WFH Trial Timeline</p>
                  <p className="text-[10px] text-slate-400">Step-by-step checklist to assure managers of output safety.</p>
                </div>
                <div className="relative pl-5 border-l border-emerald-100 space-y-4 py-1">
                  <div className="relative">
                    <div className="absolute -left-[24.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow" />
                    <p className="text-xs font-bold text-slate-800 leading-none">Day 1: Set Core Hours</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Publish availability on Calendar.</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                      Configure remote dev environment, sync calendar with Slack/Teams core overlap hours, and notify teammates of WFH
                      days.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[24.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow" />
                    <p className="text-xs font-bold text-slate-800 leading-none">Day 30: Productivity Review</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Collect early qualitative check-in feedback.</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                      Briefly sync with your manager about velocity deliverables. Validate that communication pipelines are operating
                      without delays.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[24.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-teal-500 border-2 border-white shadow" />
                    <p className="text-xs font-bold text-slate-800 leading-none">Day 60: Velocity Audit & Sign-off</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Review metrics and Scope 3 carbon savings.</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                      Compare sprint logs to establish zero velocity loss, present carbon passport achievements, and transition from
                      trial to permanent schedule.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps Checklist */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">🚀</span>
              <p className="text-xs font-bold text-slate-800">What to do next</p>
            </div>
            <div className="space-y-2">
              {[
                "Copy the email draft above",
                "Paste into your email client & review",
                "Schedule a 15-min chat with your manager",
                "Send the email before the meeting",
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  role="checkbox"
                  aria-checked={checklist[i]}
                  onClick={() => toggleCheck(i)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer group ${
                    checklist[i]
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-700"
                      : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 text-[10px] ${
                      checklist[i] ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 group-hover:border-slate-400"
                    }`}
                  >
                    {checklist[i] && "✓"}
                  </span>
                  <span className={`text-xs font-medium transition-all ${checklist[i] ? "line-through opacity-60" : ""}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
            {checklist.every(Boolean) && (
              <div className="mt-3 pt-3 border-t border-emerald-100 text-center animate-scale-in">
                <p className="text-xs font-bold text-emerald-700">🎉 You're all set! Go get that WFH approval.</p>
              </div>
            )}
          </div>

          {/* Share Your Impact */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/30 rounded-3xl p-4 sm:p-5 shadow-sm text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <span className="text-sm">📣</span>
              <p className="text-xs font-bold text-white">Share your impact</p>
            </div>
            <p className="text-[10px] text-slate-400 mb-3 relative z-10">Inspire others to calculate their commute footprint.</p>
            <div className="flex flex-wrap gap-2 relative z-10">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/25 transition active:scale-95 text-decoration-none"
              >
                💬 WhatsApp
              </a>
              <a
                href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-500/15 border border-slate-500/30 text-slate-300 text-xs font-semibold hover:bg-slate-500/25 transition active:scale-95 text-decoration-none"
              >
                𝕏 Post
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/25 transition active:scale-95 text-decoration-none"
              >
                💼 LinkedIn
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent("Check out my commute carbon savings!")}&body=${encodeURIComponent(
                  shareText + "\n\n" + shareUrl
                )}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold hover:bg-white/15 transition active:scale-95 text-decoration-none"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pb-4 border-t border-slate-100 pt-4">
        <Btn variant="secondary" onClick={onBack}>
          ← Edit details
        </Btn>
        <Btn variant="secondary" onClick={onRestart}>
          Start over
        </Btn>
      </div>
    </div>
  );
}
