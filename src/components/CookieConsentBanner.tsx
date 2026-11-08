"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { COOKIE_CONSENT_KEY } from "@/constants/storage";
import { COOKIE_PREFERENCES_EVENT } from "@/constants/events";

const CONSENT_CHANGED_EVENT = "giganchor-cookie-consent-changed";

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
  };
}

function readConsent() {
  return Boolean(localStorage.getItem(COOKIE_CONSENT_KEY));
}

export function CookieConsentBanner() {
  // The stored decision is the source of truth; `useSyncExternalStore` keeps
  // it in sync without a state update from an effect on mount.
  const hasDecided = useSyncExternalStore(subscribeToConsent, readConsent, () => true);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const handleOpenPreferences = () => setReopened(true);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
  }, []);

  const decide = useCallback((value: "accepted" | "rejected") => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    setReopened(false);
  }, []);

  const accept = useCallback(() => decide("accepted"), [decide]);
  const reject = useCallback(() => decide("rejected"), [decide]);

  const visible = reopened || !hasDecided;

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 animate-fadeInUp"
    >
      <div className="rounded-3xl bg-bg-elevated shadow-neu-raised px-6 py-5 flex flex-col gap-4">
        <p
          id="cookie-consent-title"
          className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-primary"
        >
          Privacy Notice
        </p>

        <p className="text-sm leading-relaxed text-content-secondary">
          We use cookies and analytics to improve your experience. Read our{" "}
          <Link
            href="/privacy"
            className="inline-flex items-center min-h-6 text-theme-primary font-semibold underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          to learn what data is collected and how it is used.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={accept}
            className="flex-1 min-w-0 inline-flex items-center justify-center min-h-11 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-black uppercase tracking-wider shadow-lg hover:bg-theme-primary-hover transition-colors"
          >
            Accept all
          </button>

          <button
            type="button"
            onClick={reject}
            className="flex-1 min-w-0 inline-flex items-center justify-center min-h-11 py-2.5 rounded-xl bg-bg-sunken shadow-neu-sunken-subtle text-content-secondary text-xs font-black uppercase tracking-wider hover:text-content-primary transition-colors"
          >
            Necessary only
          </button>
        </div>
      </div>
    </div>
  );
}
