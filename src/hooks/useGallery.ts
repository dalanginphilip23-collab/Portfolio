import { useCallback, useEffect, useRef, useState } from 'react';

interface UseGalleryOptions {
  /** ms between auto-advances; pass 0/null to disable autoplay */
  autoplayMs?: number | null;
  /** when false, autoplay pauses (e.g. not hovered) */
  autoplayWhen?: boolean;
}

/**
 * Shared gallery state — replaces duplicated slideshow logic
 * previously copy-pasted in Projects.tsx and ProjectDetailModal.tsx.
 */
export function useGallery(
  count: number,
  { autoplayMs = null, autoplayWhen = true }: UseGalleryOptions = {},
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    if (!autoplayMs || count <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, autoplayMs);
  }, [autoplayMs, count, stop]);

  const goTo = useCallback(
    (idx: number) => {
      stop();
      setCurrentIndex(((idx % count) + count) % count);
    },
    [count, stop],
  );

  const next = useCallback(() => {
    stop();
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count, stop]);

  const prev = useCallback(() => {
    stop();
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count, stop]);

  // Reset when image set changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [count]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (autoplayMs && autoplayWhen && count > 1) {
      start();
    } else {
      stop();
    }
    return () => stop();
  }, [autoplayMs, autoplayWhen, count, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { currentIndex, setCurrentIndex, goTo, next, prev, start, stop };
}
