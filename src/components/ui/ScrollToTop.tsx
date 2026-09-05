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
      className={`fixed bottom-8 left-8 z-40 w-12 h-12 flex items-center justify-center rounded-full border backdrop-blur-md transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } ${isDarkMode ? 'bg-zinc-900/90 text-white border-white/10 hover:bg-white hover:text-black' : 'bg-white/90 text-black border-black/10 hover:bg-black hover:text-white'}`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTop;
