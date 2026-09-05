import React, { useRef, useEffect, useState } from 'react';

type RevealVariant = 'up' | 'fade' | 'left' | 'right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  width?: 'full' | 'auto';
  threshold?: number;
  once?: boolean;
}

const HIDDEN: Record<RevealVariant, string> = {
  up: 'opacity-0 translate-y-8',
  fade: 'opacity-0',
  left: 'opacity-0 -translate-x-8',
  right: 'opacity-0 translate-x-8',
  scale: 'opacity-0 scale-95',
};

const SHOWN: Record<RevealVariant, string> = {
  up: 'opacity-100 translate-y-0',
  fade: 'opacity-100',
  left: 'opacity-100 translate-x-0',
  right: 'opacity-100 translate-x-0',
  scale: 'opacity-100 scale-100',
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 1000,
  variant = 'up',
  width = "full",
  threshold = 0.1,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => setIsVisible(true));
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -50px 0px"
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`${width === 'full' ? 'w-full' : 'inline-block'} transform-gpu will-change-transform transition-all cubic-bezier(0.16, 1, 0.3, 1) ${className} ${
        isVisible
          ? SHOWN[variant]
          : HIDDEN[variant]
      }`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms`, backfaceVisibility: 'hidden' as const }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
