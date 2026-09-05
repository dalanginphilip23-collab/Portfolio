import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Project } from '../../types';
import { PROJECTS } from '../../data/constants';
import { useGallery } from '../../hooks/useGallery';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  isDarkMode: boolean;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, isDarkMode }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
      setIsRendered(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      document.body.style.overflow = 'hidden';
      // Move focus to close button for keyboard users
      setTimeout(() => closeBtnRef.current?.focus(), 60);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setCurrentProject(null);
        document.body.style.overflow = 'unset';
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [project]);

  useEffect(() => {
    if (!isRendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isRendered, onClose]);

  useEffect(() => {
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const images = useMemo(() => currentProject ? [currentProject.image, ...(currentProject.gallery || [])] : [], [currentProject]);

  const { currentIndex, goTo, next, prev, stop } = useGallery(images.length, {
    autoplayMs: isRendered ? 3500 : null,
    autoplayWhen: isRendered,
  });

  // Reset to first image whenever a new project opens
  useEffect(() => {
    if (project) goTo(0);
  }, [project, goTo]);

  if (!isRendered || !currentProject) return null;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    stop();
    next();
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    stop();
    prev();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`${currentProject.title} details`} className={`fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-zoom-out" 
        onClick={onClose} 
      />
      
      <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-[2.5rem] md:rounded-[3rem] border shadow-2xl transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform-gpu ${
        isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-12 opacity-0'
      } ${
        isDarkMode ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'
      }`}>
        
        <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden group/modal-gallery shrink-0">
          {images.map((src, idx) => (
            <a
              key={src}
              href={currentProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute inset-0 w-full h-full block cursor-pointer transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                currentIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 blur-xl z-0 pointer-events-none'
              }`}
              aria-label={`View ${currentProject.title} live`}
            >
              <img 
                src={src} 
                alt={`${currentProject.title} - Preview ${idx + 1} of ${images.length}`} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/10">
                 <span className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md border shadow-xl transform translate-y-4 hover:translate-y-0 transition-transform ${isDarkMode ? 'bg-black/60 text-white border-white/20' : 'bg-white/60 text-black border-black/20'}`}>
                    Visit Live Site
                 </span>
              </div>
            </a>
          ))}
          
          <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-zinc-950' : 'from-white'} via-transparent to-transparent pointer-events-none z-10`} />
          
          {images.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-8 z-20">
                <button 
                  onClick={prevImage}
                  aria-label="Previous preview image"
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 focus-visible:bg-black/60 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/modal-gallery:opacity-100 focus-visible:opacity-100 -translate-x-4 group-hover/modal-gallery:translate-x-0 focus-visible:translate-x-0 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 md:pr-8 z-20">
                <button 
                  onClick={nextImage}
                  aria-label="Next preview image"
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 focus-visible:bg-black/60 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/modal-gallery:opacity-100 focus-visible:opacity-100 translate-x-4 group-hover/modal-gallery:translate-x-0 focus-visible:translate-x-0 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
                {images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      stop();
                      goTo(idx);
                    }}
                    aria-label={`Show preview ${idx + 1}`}
                    aria-current={idx === currentIndex}
                    className={`h-1 rounded-full transition-all duration-500 focus-visible:outline-2 focus-visible:outline-white ${
                      currentIndex === idx ? 'w-10 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <button 
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all group z-30 border border-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 md:px-10 lg:px-12 pt-8 pb-10 relative z-10 bg-inherit">
          <div className="space-y-10 md:space-y-12">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>DEEP DIVE / CASE STUDY</span>
                <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
                <span className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border ${isDarkMode ? 'border-white/10 text-zinc-500' : 'border-black/10 text-zinc-500'}`}>0{currentProject.id} / {PROJECTS.length} — {currentProject.title === 'Vitalis' ? 'VITALIS' : currentProject.title === 'POS System' ? 'POS' : 'PORTFOLIO'}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">{currentProject.title}</h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {currentProject.tags.map(tag => (
                  <span key={tag} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 border rounded-xl ${isDarkMode ? 'border-white/10 bg-white/5 text-zinc-500' : 'border-black/10 bg-black/5 text-zinc-500'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-3 group">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.35em] opacity-50 group-hover:opacity-100 transition-opacity">The Challenge</h3>
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/5' : 'bg-zinc-50 border-black/5'}`}>
                    <p className="text-[15px] md:text-base font-light leading-relaxed">{currentProject.challenges}</p>
                  </div>
                </div>
                
                <div className="space-y-3 group">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.35em] opacity-50 group-hover:opacity-100 transition-opacity">The Solution</h3>
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-blue-500/[0.04] border-blue-500/10' : 'bg-blue-50/70 border-blue-600/10'}`}>
                    <p className={`text-[15px] md:text-base font-light leading-relaxed ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{currentProject.solutions}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4 self-start">
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-white/5' : 'bg-zinc-50 border-black/5 shadow-sm'}`}>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.35em] mb-4 border-b pb-3 opacity-60">Tech Specs</h3>
                  <ul className="space-y-4">
                    {currentProject.technicalSpecifics.map((spec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        <span className="text-[13px] font-medium leading-snug opacity-80">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <a 
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] transition-all rounded-2xl border ${
                      isDarkMode ? 'bg-white text-black hover:bg-zinc-200 border-white' : 'bg-black text-white hover:bg-zinc-800 border-black'
                    }`}
                  >
                    <span>Live Demo</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  {currentProject.githubLink && (
                    <a 
                      href={currentProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-xl border ${
                        isDarkMode ? 'border-white/15 text-white/70 hover:text-white hover:border-white/30 bg-white/5' : 'border-black/10 text-black/60 hover:text-black hover:border-black/20 bg-black/[0.02]'
                      }`}
                    >
                      <span>Source</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
