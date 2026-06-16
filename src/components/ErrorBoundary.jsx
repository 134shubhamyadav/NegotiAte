/**
 * @fileoverview React Error Boundary component for NegotiAte.
 * Catches unexpected JavaScript errors in child component trees,
 * preventing full application crashes and showing a user-friendly fallback UI.
 */

import { Component } from "react";
import PropTypes from "prop-types";

/**
 * @typedef {Object} ErrorBoundaryState
 * @property {boolean} hasError - Whether an error has been caught.
 * @property {string} errorMessage - The caught error's message string.
 */

/**
 * Top-level Error Boundary. Wraps the entire application to catch unexpected
 * render errors and display a friendly fallback rather than a blank screen.
 *
 * @extends {Component<{children: React.ReactNode}, ErrorBoundaryState>}
 */
class ErrorBoundary extends Component {
  /** @param {{ children: React.ReactNode }} props */
  constructor(props) {
    super(props);
    /** @type {ErrorBoundaryState} */
    this.state = { hasError: false, errorMessage: "" };
  }

  /**
   * Derives updated state when an error is thrown in a child component.
   * @param {Error} error
   * @returns {ErrorBoundaryState}
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message ?? "Unknown error" };
  }

  /**
   * Logs the error to the console for debugging.
   * @param {Error} error
   * @param {{ componentStack: string }} info
   */
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4"
        >
          <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 shadow-xl p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-500 mb-1">
              An unexpected error occurred. Please reload the page to continue.
            </p>
            {this.state.errorMessage && (
              <p className="text-xs text-red-400 font-mono bg-red-50 rounded-xl px-3 py-2 mt-3 mb-4 text-left break-words">
                {this.state.errorMessage}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** The child components to render and protect. */
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
