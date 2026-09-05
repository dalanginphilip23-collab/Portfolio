import React, { useRef, useEffect, useState } from 'react';

type Variant = 'up' | 'fade' | 'left' | 'right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: Variant;
  width?: 'full' | 'auto';
  threshold?: number;
  once?: boolean;
}

const HIDDEN: Record<Variant, string> = {
  up: 'opacity-0 translate-y-6',
  fade: 'opacity-0',
  left: 'opacity-0 -translate-x-6',
  right: 'opacity-0 translate-x-6',
  scale: 'opacity-0 scale-[0.97]',
};

const SHOWN: Record<Variant, string> = {
  up: 'opacity-100 translate-y-0',
  fade: 'opacity-100',
  left: 'opacity-100 translate-x-0',
  right: 'opacity-100 translate-x-0',
  scale: 'opacity-100 scale-100',
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 700,
  variant = 'up',
  width = 'full',
  threshold = 0.12,
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
          // Small rAF so paint feels smooth when scrolling fast
          requestAnimationFrame(() => setIsVisible(true));
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -8% 0px',
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`${width === 'full' ? 'w-full' : 'inline-block'} transform-gpu transition-all ease-[cubic-bezier(0.21,1,0.36,1)] will-change-transform ${
        isVisible ? SHOWN[variant] : HIDDEN[variant]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
