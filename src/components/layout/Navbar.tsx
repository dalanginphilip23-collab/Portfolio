import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../../data/constants';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 100;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
        <nav className={`pointer-events-auto h-14 px-5 md:px-8 flex items-center justify-between md:justify-start rounded-full space-x-0 md:space-x-8 w-full md:w-auto max-w-lg md:max-w-fit border transition-all duration-500 ${
          isDarkMode 
            ? 'bg-black/20 backdrop-blur-md border-white/10 text-white' 
            : 'bg-white/50 backdrop-blur-md border-black/10 text-black shadow-sm'
        }`}>
          <a 
            href="#home" 
            onClick={(e) => scrollToSection(e, '#home')}
            className="text-xs font-black tracking-[0.3em] hover:opacity-70 transition-opacity z-50"
          >
            JOHN
          </a>

          <div className={`h-4 w-[1px] hidden md:block ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
          
          <div className="hidden md:flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-[10px] opacity-50 hover:opacity-100 transition-opacity font-black uppercase tracking-widest"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex-1 md:hidden"></div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all duration-300 ${
                isDarkMode ? 'border-white/20 hover:bg-white hover:text-black' : 'border-black/20 hover:bg-black hover:text-white'
              }`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-full border transition-all duration-300 z-50 ${
                isDarkMode ? 'border-white/20 hover:bg-white hover:text-black' : 'border-black/20 hover:bg-black hover:text-white'
              } ${isMenuOpen ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : ''}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      <div className={`fixed inset-0 z-40 backdrop-blur-3xl transition-all duration-500 md:hidden flex flex-col justify-center items-center space-y-10 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      } ${isDarkMode ? 'bg-black/90' : 'bg-white/90'}`}>
         {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`text-3xl font-black uppercase tracking-[0.2em] transition-all duration-500 transform hover:scale-110 active:scale-95 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } ${isDarkMode ? 'text-white' : 'text-black'}`}
              style={{ transitionDelay: `${100 + idx * 100}ms` }}
            >
              {item.label}
            </a>
          ))}
      </div>
    </>
  );
};

export default Navbar;
