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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', onKey); };
  }, [isMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const elem = document.getElementById(href.replace('#', ''));
    if (elem) {
      const offsetPosition = elem.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${isDarkMode ? 'bg-[#09090B]/80 border-white/10 backdrop-blur-md' : 'bg-[#FAFAF9]/80 border-zinc-200 backdrop-blur-md'}`}>
        <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className={`text-sm font-semibold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}
          >
            John Philip
            <span className={`ml-2 text-xs font-normal ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>— Portfolio</span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`text-sm transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${isDarkMode ? 'border-white/15 text-zinc-300 hover:border-white/30' : 'border-zinc-300 text-zinc-600 hover:border-zinc-400'}`}
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`text-sm px-3 py-1.5 rounded-full border ${isDarkMode ? 'border-white/15 text-zinc-300' : 'border-zinc-300 text-zinc-600'}`}
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className={`px-3 py-1.5 text-sm rounded-full border ${isDarkMode ? 'border-white/15 text-zinc-200' : 'border-zinc-300 text-zinc-700'}`}
            >
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className={`md:hidden border-t ${isDarkMode ? 'border-white/10 bg-[#09090B]' : 'border-zinc-200 bg-white'}`}>
            <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`py-3 text-[15px] border-b last:border-0 ${isDarkMode ? 'text-zinc-200 border-white/5' : 'text-zinc-800 border-zinc-100'}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
