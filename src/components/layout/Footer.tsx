import React from 'react';
import { RESUME_DATA, NAV_ITEMS } from '../../data/constants';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const elem = document.getElementById(href.replace('#', ''));
    if (elem) {
      const offsetPosition = elem.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className={`mt-8 border-t ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>John Philip Dalangin</p>
            <p className="mt-1 text-sm text-zinc-500">Frontend · IT Support · BSIT-4</p>
            <p className="mt-3 text-[13px] text-zinc-500">
              <a href={`mailto:${RESUME_DATA.contact.email}`} className="underline underline-offset-4">{RESUME_DATA.contact.email}</a>
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={RESUME_DATA.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              GitHub
            </a>
            <a
              href={RESUME_DATA.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${isDarkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              LinkedIn
            </a>
          </nav>
        </div>
        <p className="mt-8 text-[13px] text-zinc-500">© {new Date().getFullYear()} John Philip Dalangin</p>
      </div>
    </footer>
  );
};

export default Footer;
