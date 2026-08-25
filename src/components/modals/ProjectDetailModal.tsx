import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  isDarkMode: boolean;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, isDarkMode }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
      setIsRendered(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      document.body.style.overflow = 'hidden';
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
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const images = useMemo(() => currentProject ? [currentProject.image, ...(currentProject.gallery || [])] : [], [currentProject]);

  useEffect(() => {
    if (isRendered && images.length > 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3500);
    }
    return () => { 
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRendered, images.length]);

  if (!isRendered || !currentProject) return null;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-zoom-out" 
        onClick={onClose} 
      />
      
      <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-[2.5rem] md:rounded-[3rem] border shadow-2xl transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform-gpu ${
        isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-12 opacity-0'
      } ${
        isDarkMode ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'
      }`}>
        
        <div className="relative h-64 md:h-[500px] w-full overflow-hidden group/modal-gallery">
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
                src={`${src.split('?')[0]}?auto=format&fit=crop&q=85&w=1600`} 
                alt={`${currentProject.title} - Preview ${idx + 1}`} 
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
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/modal-gallery:opacity-100 -translate-x-4 group-hover/modal-gallery:translate-x-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 md:pr-8 z-20">
                <button 
                  onClick={nextImage}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/modal-gallery:opacity-100 translate-x-4 group-hover/modal-gallery:translate-x-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      if (intervalRef.current) clearInterval(intervalRef.current);
                      setCurrentIndex(idx); 
                    }}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      currentIndex === idx ? 'w-10 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all group z-30 border border-white/10"
          >
            <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 md:px-20 pb-20 -mt-16 relative z-10">
          <div className="space-y-16 md:space-y-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>DEEP DIVE / CASE STUDY</span>
                <div className={`h-[1px] flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">{currentProject.title}</h2>
              <div className="flex flex-wrap gap-3 pt-4">
                {currentProject.tags.map(tag => (
                  <span key={tag} className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 border rounded-2xl ${isDarkMode ? 'border-white/10 bg-white/5 text-zinc-500' : 'border-black/10 bg-black/5 text-zinc-400'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
              <div className="md:col-span-7 space-y-12 md:space-y-16">
                <div className="space-y-6 md:space-y-8 group">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">The Challenge</h3>
                  <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ${isDarkMode ? 'bg-white/[0.02] border-white/5 group-hover:bg-white/[0.04]' : 'bg-black/[0.02] border-black/5 group-hover:bg-black/[0.04]'}`}>
                    <p className="text-lg md:text-xl font-light leading-relaxed">{currentProject.challenges}</p>
                  </div>
                </div>
                
                <div className="space-y-6 md:space-y-8 group">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">The Solution</h3>
                  <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ${isDarkMode ? 'bg-blue-500/[0.03] border-blue-500/10 group-hover:bg-blue-500/[0.05]' : 'bg-blue-50 border-blue-600/5 group-hover:bg-blue-100/50'}`}>
                    <p className={`text-lg md:text-xl font-light leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{currentProject.solutions}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 space-y-8 md:space-y-12">
                <div className={`p-8 md:p-10 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? 'bg-zinc-900/50 border-white/5 shadow-black' : 'bg-zinc-50 border-black/5 shadow-zinc-200/50'}`}>
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 md:mb-10 border-b pb-4 opacity-60">Tech Specs</h3>
                  <ul className="space-y-6">
                    {currentProject.technicalSpecifics.map((spec, i) => (
                      <li key={i} className="flex items-start group/spec">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-5 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.6)] group-hover/spec:scale-150 transition-transform"></span>
                        <span className="text-[13px] md:text-[14px] font-bold leading-tight opacity-70 tracking-wide group-hover/spec:opacity-100 transition-opacity">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <a 
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-6 md:py-8 flex items-center justify-center space-x-6 text-[12px] font-black uppercase tracking-[0.4em] transition-all rounded-3xl border transform-gpu hover:scale-[1.02] active:scale-[0.98] ${
                      isDarkMode ? 'bg-white text-black hover:bg-zinc-200 shadow-2xl shadow-white/5' : 'bg-black text-white hover:bg-zinc-800 shadow-2xl shadow-black/20'
                    }`}
                  >
                    <span>LAUNCH PROJECT</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>

                  {currentProject.githubLink && (
                    <a 
                      href={currentProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-5 md:py-6 flex items-center justify-center space-x-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all rounded-2xl border transform-gpu hover:scale-[1.02] active:scale-[0.98] opacity-60 hover:opacity-100 ${
                        isDarkMode ? 'border-white/20 text-white' : 'border-black/20 text-black'
                      }`}
                    >
                      <span>BROWSE SOURCE</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
