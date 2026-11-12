import PropTypes from "prop-types";
import { ArrowLeftRight, Key, RefreshCw } from "lucide-react";

export default function Navbar({
  onOpenCompare,
  onOpenApiKey,
  onReset,
  hasOffer,
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F766E] text-white shadow-xs">
            <span className="font-mono text-sm font-bold tracking-tight">NA</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 tracking-tight dark:text-zinc-100">
                NegotiAte
              </span>
              <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-[#0F766E] border border-teal-200 dark:bg-teal-950/50 dark:border-teal-800 dark:text-teal-300">
                Fresher & Intern Copilot
              </span>
            </div>
            <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
              Paste your offer. Know what it&apos;s really worth, what to ask for, and what to say.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasOffer && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
              title="Reset all fields (Cmd/Ctrl + K)"
            >
              <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Reset</span>
              <kbd className="hidden rounded bg-zinc-100 px-1 text-[10px] text-zinc-500 md:inline dark:bg-zinc-800">⌘K</kbd>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCompare}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-[#0F766E]" />
            <span>Compare Offers</span>
          </button>

          <button
            type="button"
            onClick={onOpenApiKey}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
            title="Groq API Key Settings"
          >
            <Key className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  onOpenCompare: PropTypes.func.isRequired,
  onOpenApiKey: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  hasOffer: PropTypes.bool.isRequired,
};