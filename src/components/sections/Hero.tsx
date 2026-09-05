import React from 'react';
import { RESUME_DATA } from '../../data/constants';

interface HeroProps {
  isDarkMode: boolean;
  onOpenResume: () => void;
}

const Hero: React.FC<HeroProps> = ({ isDarkMode, onOpenResume }) => {
  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('contact');
    if (elem) {
      const offsetPosition = elem.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-28 md:pt-36 pb-14 md:pb-16">
      <div className="flex items-start gap-5">
        <img
          src="/profile.jpg"
          alt="Portrait of John Philip Dalangin"
          width={72}
          height={72}
          fetchPriority="high"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          className="w-[72px] h-[72px] rounded-full object-cover shrink-0 border border-zinc-200 dark:border-white/10"
        />
        <div className="pt-1">
          <p className={`flex items-center gap-2 text-[13px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Open for OJT — Bauan, Batangas
          </p>
          <h1 className={`mt-2 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
            John Philip Dalangin
          </h1>
          <p className={`mt-2 text-[15px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Frontend Developer · IT Support foundations · BSIT-4
          </p>
        </div>
      </div>

      <p className={`mt-8 text-base md:text-lg leading-relaxed max-w-2xl ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
        I build responsive web apps with React and Tailwind, and handle IT support basics —
        cabling, PC assembly, OS installs, and troubleshooting. Vitalis PWA and POS System are live on Vercel.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#contact"
          onClick={scrollToContact}
          className={`text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${isDarkMode ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-700'}`}
        >
          Get in touch
        </a>
        <button
          onClick={onOpenResume}
          className={`text-sm font-medium px-5 py-2.5 rounded-full border transition-colors ${isDarkMode ? 'border-white/15 text-zinc-200 hover:border-white/30' : 'border-zinc-300 text-zinc-700 hover:border-zinc-400'}`}
        >
          View CV
        </button>
        <a
          href={RESUME_DATA.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm px-2 py-2.5 underline underline-offset-4 ${isDarkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          GitHub
        </a>
      </div>

      <p className={`mt-6 text-[13px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
        {RESUME_DATA.contact.email} · {RESUME_DATA.contact.address}
      </p>
    </section>
  );
};

export default Hero;
