"use client";

import { useEffect, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function LoadingBar() {
    // The bar starts at 30% (the pre-existing "loading" state) and fills in when
    // the page settles; progress is derived from state during render instead of
    // being written back from an effect.
    const [loadProgress, setLoadProgress] = useState(0.3);
    const [isLoading, setIsLoading] = useState(true);
    const [scrollableHeight, setScrollableHeight] = useState(0);
    const scrollY = useScrollProgress(!isLoading);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadProgress(1);
            setTimeout(() => setIsLoading(false), 500);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const measure = () =>
            setScrollableHeight(document.documentElement.scrollHeight - window.innerHeight);

        const observer = new ResizeObserver(measure);
        observer.observe(document.documentElement);
        window.addEventListener("resize", measure);

        const frame = requestAnimationFrame(measure);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const progress = isLoading
        ? loadProgress
        : scrollableHeight > 0
            ? Math.min(scrollY / scrollableHeight, 1)
            : 0;

    return (
        <div
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-theme-primary to-[#22e0e2] z-[9999] origin-left"
            style={{ transform: `scaleX(${progress})`, transition: isLoading ? "transform 0.4s ease" : "none" }}
        />
    );
}
