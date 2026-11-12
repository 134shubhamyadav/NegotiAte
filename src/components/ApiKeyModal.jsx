import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Key, ShieldCheck, Check } from "lucide-react";
import { getStoredApiKey, setStoredApiKey, checkServerProxyStatus } from "../utils/apiKeyStorage.js";

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [keyInput, setKeyInput] = useState(() => getStoredApiKey());
  const [hasServerKey, setHasServerKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    if (isOpen) {
      checkServerProxyStatus().then((configured) => {
        if (active) setHasServerKey(configured);
      });
    }
    return () => {
      active = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(keyInput);
    setSavedSuccess(true);
    if (onKeySaved) onKeySaved(keyInput.trim());
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput("");
    setStoredApiKey("");
    if (onKeySaved) onKeySaved("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-[#0F766E]" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Groq API Key (Optional)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-3.5 text-xs">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
              <div className="text-[11px] leading-relaxed">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Zero Client-Side Leakage Guarantee
                </p>
                <p className="mt-0.5 text-zinc-500 dark:text-zinc-400">
                  By default, AI requests route via the secure backend proxy at <code>/api/groq</code>. If you supply a custom key, it is stored in ephemeral browser <code>sessionStorage</code> and cleared when you close the tab.
                </p>
                {hasServerKey && (
                  <p className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">
                    ✓ Server environment key is configured and active.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
              Personal Groq API Key (gsk_...)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="gsk_..."
              className="w-full rounded border border-zinc-200 bg-white p-2 font-mono text-xs text-zinc-900 focus:border-[#0F766E] focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {keyInput ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:underline dark:text-red-400"
              >
                Clear Custom Key
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded bg-[#0F766E] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#115E59]"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

ApiKeyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onKeySaved: PropTypes.func,
};