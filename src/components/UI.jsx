
export const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
    {children}
  </label>
);

export const Input = (props) => (
  <input
    {...props}
    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition bg-white"
  />
);

export const SelectEl = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition bg-white"
  >
    {children}
  </select>
);

export const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none"
  />
);

export function Btn({ children, onClick, variant = "primary", disabled, loading, className = "" }) {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-700 shadow-sm",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    green: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/15",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer ${variants[variant]} ${className}`}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />}
      {children}
    </button>
  );
}

export function StatCard({ label, value, sub, icon, accent = false }) {
  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group ${
        accent
          ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-emerald-500/15 shadow-md animate-glow-pulse"
          : "bg-white/80 backdrop-blur-md border-slate-100 hover:border-emerald-200/50 shadow-sm text-slate-900"
      }`}
    >
      <div className="flex justify-between items-start mb-2.5">
        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${accent ? "text-emerald-100/90" : "text-slate-400"}`}>
          {label}
        </p>
        <div
          className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-transform group-hover:scale-110 ${
            accent ? "bg-white/15 text-white" : "bg-slate-50 text-slate-500 border border-slate-100"
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none mb-1">{value}</p>
      {sub && <p className={`text-[10px] sm:text-xs font-medium ${accent ? "text-emerald-100/80" : "text-slate-400"}`}>{sub}</p>}
    </div>
  );
}

export function ProgressBar({ pct, color = "bg-emerald-500" }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

export function StepIndicator({ current }) {
  const steps = ["Commute", "Profile", "Impact", "Proposal"];
  const icons = ["📍", "👤", "📊", "📧"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = current > n, active = current === n;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : active
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 ring-4 ring-slate-900/5"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? "✓" : <span className="text-[11px]">{icons[i]}</span>}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-semibold mt-1.5 transition-colors ${
                  done ? "text-emerald-600" : active ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-14 mx-0.5 sm:mx-1 mb-4 rounded-full transition-all duration-500 ${
                  current > n ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export const ChartTooltip = ({ active, payload, label, unit = "kg" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value.toLocaleString()} {unit}</strong>
        </p>
      ))}
    </div>
  );
};
