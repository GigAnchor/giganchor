"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { CTA_DISMISSED_KEY } from "@/constants/storage";

const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function FloatingCTA() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Don't show on community page (has registration form)
  const isExcludedPage = pathname === "/community";

  useEffect(() => {
    // Check if dismissed recently
    const dismissedAt = localStorage.getItem(CTA_DISMISSED_KEY);
    if (dismissedAt) {
      const parsed = parseInt(dismissedAt, 10);
      if (!Number.isFinite(parsed) || parsed < 0) {
        localStorage.removeItem(CTA_DISMISSED_KEY);
      } else {
        const elapsed = Date.now() - parsed;
        if (elapsed < DISMISS_DURATION) {
          return;
        }
        localStorage.removeItem(CTA_DISMISSED_KEY);
      }
    }

    // Animate in shortly after the page settles. Both writes are scheduled,
    // which keeps the effect free of synchronous state updates.
    if (isExcludedPage) return;

    const enter = setTimeout(() => setIsAnimating(true), 0);
    const reveal = setTimeout(() => setIsVisible(true), 50);

    return () => {
      clearTimeout(enter);
      clearTimeout(reveal);
    };
  }, [isExcludedPage]);

  // Navigating to an excluded page hides the CTA by derivation instead of
  // writing state from an effect; the first effect re-arms it on the way back.
  const visible = isVisible && !isExcludedPage;

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
      localStorage.setItem(CTA_DISMISSED_KEY, Date.now().toString());
    }, 300);
  };

  const handleClick = () => {
    // Navigate to home page waitlist section using client-side navigation
    router.push("/#waitlist-form");
  };

  if (!isAnimating) return null;

  return (
    <div
        aria-hidden={!visible}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-[opacity,transform] duration-300 ease-out print:hidden ${visible
          ? "opacity-100 translate-y-0 scale-100"
          : "pointer-events-none opacity-0 translate-y-4 scale-95"
          }`}
      >
        {/* Main CTA Card */}
        <div className="relative group">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 min-w-11 min-h-11 w-11 h-11 rounded-full bg-bg-base shadow-neu-raised-sm flex items-center justify-center text-content-secondary hover:text-content-primary hover:shadow-neu-raised-hover transition-[box-shadow,color] z-20"
            aria-label="Dismiss"
          >
            <X size={12} aria-hidden="true" />
          </button>

          {/* Animated border wrapper */}
          <div className="animated-border-wrapper shadow-neu-raised hover:shadow-neu-raised-hover transition-shadow duration-300 group-hover:translate-y-0.5">
            {/* CTA Card */}
            <button
              type="button"
              onClick={handleClick}
              className="animated-border-inner appearance-none border-0 text-left cursor-pointer px-4 py-3 md:px-6 md:py-5 max-w-[240px] md:max-w-[280px] w-full"
            >
              <div className="flex flex-col">
                {/* Content */}
                <div>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-theme-primary mb-1">
                    Early Access
                  </p>
                  <p className="text-xs md:text-sm font-bold text-content-primary leading-tight">
                    Join the Waitlist
                  </p>
                  <p className="text-[10px] md:text-xs text-content-secondary mt-1 leading-relaxed">
                    Be first to integrate secure escrow payments
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-3 md:mt-4 w-full py-2 md:py-2.5 rounded-xl bg-theme-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-theme-primary-hover transition-colors group/btn">
                Get Started
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="group-hover/btn:translate-x-0.5 transition-transform"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
  );
}
