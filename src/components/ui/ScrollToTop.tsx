import React, { useEffect, useState } from 'react';

const ScrollToTop: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 600);
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-6 left-6 z-40 w-10 h-10 flex items-center justify-center rounded-full border text-sm transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${isDarkMode ? 'bg-[#09090B]/90 border-white/15 text-zinc-300' : 'bg-white/90 border-zinc-300 text-zinc-600'}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTop;
