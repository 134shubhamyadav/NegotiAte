import { LeafIcon } from "./Icons.jsx";
import { Label, Input, SelectEl, Textarea, Btn } from "./UI.jsx";
import { INDUSTRY_OPTIONS } from "../utils/calculations.js";

export default function Step2({ form, setForm, savings, onBack, onNext, loading, error }) {
  const valid = form.name.trim() && form.role.trim() && form.company.trim();
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
      {/* Left Column: Summary and instructions */}
      <div className="md:col-span-5 space-y-4 md:sticky md:top-20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
            Personalize your <span className="text-emerald-500">proposal</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Our AI will generate a highly tailored professional email proposal based on your name, role, company culture, chosen tone, and your commute savings.
          </p>
        </div>

        {/* Mini savings pill */}
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <LeafIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-emerald-700 leading-none">{Math.round(savings.savedAnnualKg)} kg</p>
            <p className="text-[11px] text-emerald-600/95 font-medium">CO₂e saved / year (negotiation headline)</p>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="md:col-span-7 space-y-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="full-name-input">Your full name</Label>
              <Input id="full-name-input" placeholder="Priya Sharma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="role-input">Job title / role</Label>
              <Input id="role-input" placeholder="Senior Engineer" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="company-input">Company name</Label>
              <Input id="company-input" placeholder="Acme Corp" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="manager-name-input">Manager's name (optional)</Label>
              <Input id="manager-name-input" placeholder="Rahul Gupta" value={form.managerName} onChange={e => setForm(p => ({ ...p, managerName: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label htmlFor="industry-select">Industry</Label>
            <SelectEl id="industry-select" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
              {INDUSTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </SelectEl>
          </div>

          {/* Proposal Tone Selector */}
          <div>
            <Label id="tone-group-label">Proposal Tone</Label>
            <div role="radiogroup" aria-labelledby="tone-group-label" className="grid grid-cols-3 gap-2">
              {[
                { id: "corporate", label: "💼 Corporate", desc: "Scope 3 carbon metrics and structured trial blocks." },
                { id: "collaborative", label: "🤝 Collaborative", desc: "Warm, trust-first team velocity & alignment." },
                { id: "analytical", label: "📊 Analytical", desc: "Data-driven, focus hours and commute savings." }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={form.tone === t.id}
                  onClick={() => setForm(p => ({ ...p, tone: t.id }))}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all duration-300 relative overflow-hidden group active:scale-95 cursor-pointer
                    ${form.tone === t.id
                      ? "border-emerald-500 bg-emerald-50/50 text-slate-900 ring-2 ring-emerald-500/20"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 text-slate-600"}`}
                >
                  <span className="font-bold text-[11px] leading-tight">{t.label}</span>
                  <span className="text-[9px] text-slate-400 font-normal leading-tight mt-1 block line-clamp-3">{t.desc}</span>
                  {form.tone === t.id && (
                    <span className="absolute bottom-1.5 right-2 text-emerald-600 text-[10px] font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="extra-context-textarea">Extra context for AI (optional)</Label>
            <Textarea id="extra-context-textarea" rows={3} placeholder="e.g. I've been here 3 years, our team already does hybrid, the company has a net-zero 2030 pledge..."
              value={form.extraContext} onChange={e => setForm(p => ({ ...p, extraContext: e.target.value }))} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">{error}</div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Btn variant="secondary" onClick={onBack}>← Back</Btn>
          <Btn variant="green" onClick={onNext} disabled={!valid} loading={loading}>
            {loading ? "Generating..." : "Generate proposal ✨"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
