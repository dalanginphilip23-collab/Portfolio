import React, { useState, useEffect, useRef } from 'react';
import { RESUME_DATA } from '../../data/constants';

interface HeroProps {
  isDarkMode: boolean;
  onOpenResume: () => void;
}

// Local profile asset — you uploaded src/assets/profile.jpg (now copied to public/profile.jpg)
const FALLBACK_AVATAR = '/profile.jpg';
const seriousImage = FALLBACK_AVATAR;
const wakeImage = FALLBACK_AVATAR;
const sleepImage = FALLBACK_AVATAR;

const StaggeredText: React.FC<{ text: string; isDarkMode: boolean }> = ({ text, isDarkMode }) => {
  const words = text.split(' ');
  return (
    <p className={`text-base md:text-xl font-light leading-snug tracking-tight transition-colors duration-700 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} flex flex-wrap`}>
      {words.map((word, i) => (
        <span 
          key={i}
          className="inline-block mr-[0.25em] opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${400 + (i * 40)}ms` }}
        >
          {word}
        </span>
      ))}
    </p>
  );
};

const Hero: React.FC<HeroProps> = ({ isDarkMode, onOpenResume }) => {
  const [isAwake, setIsAwake] = useState(false);
  
  const line1Full = "JOHN PHILIP";
  const line2Full = "DALANGIN";
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [phase, setPhase] = useState(0);

  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) setIsAwake(false);
  }, [isDarkMode]);

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
    let timeout: ReturnType<typeof setTimeout>;
    const typeSpeed = 65;
    const deleteSpeed = 30;
    const holdDuration = 3500;
    const pauseBetweenLines = 150;

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
          timeout = setTimeout(() => setPhase(2), holdDuration);
        }
        break;
      case 2:
        timeout = setTimeout(() => setPhase(3), holdDuration);
        break;
      case 3:
        if (line2.length > 0) {
          timeout = setTimeout(() => { 
            setLine2(line2.substring(0, line2.length - 1)); 
          }, deleteSpeed);
        } else {
          timeout = setTimeout(() => setPhase(4), pauseBetweenLines);
        }
        break;
      case 4:
        if (line1.length > 0) {
          timeout = setTimeout(() => { 
            setLine1(line1.substring(0, line1.length - 1)); 
          }, deleteSpeed);
        } else {
          timeout = setTimeout(() => setPhase(0), 1000);
        }
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
            <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Frontend Developer
            </span>
            <h1 className={`text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase min-h-[1.8em] ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <div className="flex items-center">
                {line1}
                {(phase === 0 || phase === 4) && (
                  <span className={`inline-block w-[0.1em] h-[0.85em] bg-blue-500 ml-2 animate-cursor-blink align-middle shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                )}
              </div>
              <div className="flex items-center">
                {line2}
                {(phase === 1 || phase === 3) && (
                  <span className={`inline-block w-[0.1em] h-[0.85em] bg-blue-500 ml-2 animate-cursor-blink align-middle shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                )}
              </div>
            </h1>
          </div>

          {/* Bio summary — moved under name per fix: not above, now directly under JOHN PHILIP DALANGIN */}
          <div className={`p-6 md:p-8 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/40 border-white/10' : 'bg-zinc-50 border-black/5'}`}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border ${isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>
                BSIT 4TH YEAR — STC COLLEGE OF BATANGAS
              </span>
            </div>
            <p className={`text-sm md:text-base font-light leading-relaxed max-w-xl ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {RESUME_DATA.summary}
            </p>
            <div className={`mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <span>{RESUME_DATA.contact.email}</span>
              <span className="opacity-30">•</span>
              <span>{RESUME_DATA.contact.address}</span>
              <span className="opacity-30">•</span>
              <a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">GitHub</a>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact" 
                onClick={scrollToContact}
                className={`text-[10px] font-black uppercase tracking-[0.3em] px-6 md:px-8 py-3 border transition-all ${
                  isDarkMode ? 'bg-white text-black border-white hover:bg-zinc-200' : 'bg-black text-white border-black hover:bg-zinc-800'
                }`}
              >
                GET IN TOUCH
              </a>
              <button 
                onClick={onOpenResume}
                className={`text-[10px] font-black uppercase tracking-[0.3em] px-6 md:px-8 py-3 border transition-all inline-block text-center ${
                  isDarkMode ? 'border-white/20 text-white hover:bg-white hover:text-black hover:border-white' : 'border-black/20 text-black hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                VIEW CV
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative group">
          <div 
            onClick={() => !isDarkMode && setIsAwake(!isAwake)}
            className={`relative aspect-[3/4] overflow-hidden transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) select-none rounded-[2rem] bg-zinc-950 ${
              isDarkMode ? 'grayscale-[0.6] cursor-not-allowed' : 'grayscale-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <div 
              ref={parallaxRef} 
              className="absolute inset-0 w-full h-[115%] -top-[7.5%] will-change-transform"
            >
              <img 
                src={seriousImage} 
                alt="John Philip Dalangin" 
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_AVATAR; }}
                className="absolute inset-0 w-full h-full object-cover transform-gpu grayscale-[0.2]" 
              />
              
              <img 
                src={wakeImage} 
                alt="John Philip Dalangin awake" 
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) transform-gpu ${!isDarkMode && isAwake ? 'opacity-100' : 'opacity-0'}`} 
              />
              
              <div className={`absolute inset-0 transition-opacity duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) transform-gpu ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                <img 
                  src={sleepImage} 
                  alt="" 
                  aria-hidden="true"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  className="w-full h-full object-cover animate-slow-pulse transform-gpu" 
                />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
               <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${!isDarkMode && !isAwake ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute w-full h-full border-[1px] border-black/5 rounded-full animate-sonar-1"></div>
                  <div className="absolute w-full h-full border-[1px] border-black/10 rounded-full animate-sonar-2"></div>
                  <div className="absolute w-full h-full border-[1px] border-black/5 rounded-full animate-sonar-3"></div>
               </div>

               <div className={`absolute inset-0 transition-opacity duration-1000 ${!isDarkMode && isAwake ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                  <div className="absolute inset-0 animate-grid-scan" style={{ background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4), transparent)', height: '2px', width: '100%' }}></div>
                  <div className="absolute inset-0 animate-glitch-overlay opacity-10 bg-blue-500/10"></div>
               </div>

               <div className={`absolute inset-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-[80px] animate-orb-float-1"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-[100px] animate-orb-float-2"></div>
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full animate-twinkle-1"></div>
                  <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-twinkle-2"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-twinkle-3"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
