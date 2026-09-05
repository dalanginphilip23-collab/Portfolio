import React, { useState, useEffect, useRef } from 'react';
import { RESUME_DATA } from '../../data/constants';

interface HeroProps {
  isDarkMode: boolean;
  onOpenResume: () => void;
}

// Local profile asset served from public/
const FALLBACK_AVATAR = '/profile.jpg';
const seriousImage = FALLBACK_AVATAR;

const Hero: React.FC<HeroProps> = ({ isDarkMode, onOpenResume }) => {
  const [isAwake, setIsAwake] = useState(false);
  
  const line1Full = "JOHN PHILIP";
  const line2Full = "DALANGIN";
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [phase, setPhase] = useState(0);

  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (parallaxRef.current) {
          const val = window.scrollY * 0.12;
          parallaxRef.current.style.transform = `translate3d(0, ${val}px, 0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Respect reduced motion: show full name instantly, no typing loop
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLine1(line1Full);
      setLine2(line2Full);
      setPhase(2);
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    const typeSpeed = 65;
    const pauseBetweenLines = 150;

    // Type once and hold — no delete loop (reduces re-render + screen-reader churn)
    switch (phase) {
      case 0:
        if (line1.length < line1Full.length) {
          timeout = setTimeout(() => {
            setLine1(line1Full.substring(0, line1.length + 1));
          }, typeSpeed);
        } else {
          timeout = setTimeout(() => setPhase(1), pauseBetweenLines);
        }
        break;
      case 1:
        if (line2.length < line2Full.length) {
          timeout = setTimeout(() => {
            setLine2(line2Full.substring(0, line2.length + 1));
          }, typeSpeed);
        } else {
          timeout = setTimeout(() => setPhase(2), 500);
        }
        break;
      case 2:
        // Hold final state — no further timers
        break;
    }
    return () => clearTimeout(timeout);
  }, [line1, line2, phase]);

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('contact');
    if (elem) {
      const offset = 100;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="home" className="pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-7 flex flex-col justify-end space-y-8 md:space-y-12">
          <div className="space-y-4">
            <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Frontend Developer (OJT-ready) · IT Support foundations
            </span>
            <h1 aria-label="John Philip Dalangin" className={`text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase min-h-[1.8em] ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <span className="flex items-center" aria-hidden="true">
                {line1}
                {phase === 0 && (
                  <span aria-hidden="true" className={`inline-block w-[0.1em] h-[0.85em] bg-blue-500 ml-2 animate-cursor-blink align-middle shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                )}
              </span>
              <span className="flex items-center" aria-hidden="true">
                {line2}
                {phase === 1 && (
                  <span aria-hidden="true" className={`inline-block w-[0.1em] h-[0.85em] bg-blue-500 ml-2 animate-cursor-blink align-middle shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                )}
              </span>
            </h1>
          </div>

          {/* Bio summary — short pitch, full summary lives in Resume modal */}
          <div className={`p-6 md:p-8 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/40 border-white/10' : 'bg-zinc-50 border-black/5'}`}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border ${isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>
                BSIT 4TH YEAR — STC COLLEGE OF BATANGAS
              </span>
              <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Open for OJT
              </span>
            </div>
            <p className={`text-sm md:text-base font-light leading-relaxed max-w-xl ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              I build responsive web apps with React + Tailwind and handle IT Support basics — cabling, PC assembly, OS installs, and troubleshooting. Vitalis PWA + POS System live on Vercel.
            </p>
            <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <a href={`mailto:${RESUME_DATA.contact.email}`} className="underline underline-offset-4 hover:text-blue-500">{RESUME_DATA.contact.email}</a>
              <span className="opacity-30" aria-hidden="true">•</span>
              <span>{RESUME_DATA.contact.address}</span>
              <span className="opacity-30" aria-hidden="true">•</span>
              <a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-blue-500 transition-colors">GitHub</a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                onClick={scrollToContact}
                className={`text-[11px] font-black uppercase tracking-[0.3em] px-8 py-4 rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${isDarkMode ? 'bg-white text-black border-white hover:bg-zinc-200' : 'bg-black text-white border-black hover:bg-zinc-800'
                  }`}
              >
                GET IN TOUCH
              </a>
              <button
                onClick={onOpenResume}
                className={`text-[11px] font-black uppercase tracking-[0.3em] px-8 py-4 rounded-xl border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${isDarkMode ? 'border-white/20 text-white hover:bg-white hover:text-black hover:border-white' : 'border-black/20 text-black hover:bg-black hover:text-white hover:border-black'
                  }`}
              >
                VIEW CV
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <button
            type="button"
            onClick={() => setIsAwake((v) => !v)}
            aria-pressed={isAwake}
            aria-label={isAwake ? 'Profile photo — activated view. Press to toggle effect.' : 'Profile photo of John Philip Dalangin. Press to toggle highlight effect.'}
            className={`group relative block w-full aspect-[3/4] overflow-hidden transition-all duration-700 select-none rounded-[2rem] bg-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${isDarkMode ? 'grayscale-[0.4]' : 'grayscale-0 hover:scale-[1.01] active:scale-[0.99]'
              }`}
          >
            <div
              ref={parallaxRef}
              className="absolute inset-0 w-full h-[115%] -top-[7.5%] will-change-transform"
            >
              <img
                src={seriousImage}
                alt="Portrait of John Philip Dalangin"
                width={600}
                height={800}
                fetchPriority="high"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_AVATAR; }}
                className="absolute inset-0 w-full h-full object-cover transform-gpu"
              />
              <div className={`absolute inset-0 transition-opacity duration-700 ${isDarkMode ? 'opacity-100' : isAwake ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
              </div>
            </div>

            <span className={`absolute bottom-4 left-4 z-10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] rounded-full backdrop-blur-md border ${isDarkMode ? 'bg-black/60 text-white border-white/20' : 'bg-white/70 text-black border-black/10'}`}>
              {isAwake ? 'Highlight on' : 'Bauan, Batangas'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
