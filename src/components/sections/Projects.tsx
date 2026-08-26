import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PROJECTS } from '../../data/constants';
import { Project } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';

const ProjectGallery: React.FC<{ project: Project; isDarkMode: boolean }> = ({ project, isDarkMode }) => {
  const images = useMemo(() => {
    const allImages = [project.image, ...(project.gallery || [])];
    return Array.from(new Set(allImages));
  }, [project]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startSlideShow = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (images.length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2400);
  }, [images.length]);

  const stopSlideShow = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (isHovered && images.length > 1) {
      startSlideShow();
    } else {
      stopSlideShow();
    }
    return () => stopSlideShow();
  }, [isHovered, images.length, startSlideShow, stopSlideShow]);

  const handleManualNav = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    stopSlideShow();
    
    if (direction === 'next') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    } else {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }

    if (isHovered) {
        startSlideShow();
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((src, idx) => {
        const isActive = currentIndex === idx;
        return (
          <a
            key={src}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute inset-0 w-full h-full block cursor-pointer transition-all duration-700 transform-gpu ${
              isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
            }`}
            aria-label={`View ${project.title} live demo`}
          >
            <img
              src={`${src.split('?')[0]}?auto=format&fit=crop&q=80&w=1200`}
              alt={`${project.title} view ${idx + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-[1500ms] ease-out transform group-hover:scale-110"
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered && isActive ? 'opacity-100' : 'opacity-0'}`}>
              <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md border ${isDarkMode ? 'bg-black/50 text-white border-white/20' : 'bg-white/50 text-black border-black/20'}`}>
                Visit Site
              </span>
            </div>
          </a>
        );
      })}

      {images.length > 1 && (
        <>
          <button
             onClick={(e) => handleManualNav('prev', e)}
             className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 z-20 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
             aria-label="Previous image"
           >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
           </button>

           <button
             onClick={(e) => handleManualNav('next', e)}
             className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 z-20 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
             aria-label="Next image"
           >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
           </button>
        </>
      )}

      {images.length > 1 && (
        <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-300 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 shadow-sm ${
                idx === currentIndex ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProjectsProps {
  isDarkMode: boolean;
  onOpenSpecs: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ isDarkMode, onOpenSpecs }) => {
  const [activeTag, setActiveTag] = useState<string>('ALL');

  // Project name only categories - organized, not tech tags
  const tagData = useMemo(() => {
    const counts: Record<string, number> = { ALL: PROJECTS.length };
    const short = (t: string) => t.includes('Vitalis') ? 'Vitalis' : t.includes('POS') ? 'POS System' : 'GitHub';
    const list = ['ALL', ...PROJECTS.map(p => short(p.title))];
    PROJECTS.forEach(p => {
      const s = short(p.title);
      counts[s] = (counts[s] || 0) + 1;
    });
    return { list, counts };
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeTag === 'ALL') return PROJECTS;
    const short = (t: string) => t.includes('Vitalis') ? 'Vitalis' : t.includes('POS') ? 'POS System' : 'GitHub';
    return PROJECTS.filter(project => short(project.title) === activeTag);
  }, [activeTag]);

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="space-y-16">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6">
              <h2 className={`text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                SELECTED<br/>WORKS.
              </h2>
              <div className={`h-[2px] w-24 ${isDarkMode ? 'bg-blue-600' : 'bg-black'}`}></div>
            </div>

            <div className="flex flex-wrap gap-2 md:max-w-xl justify-center md:justify-end">
               {tagData.list.map(tag => {
                  const isActive = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`group px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-500 rounded-xl border flex items-center gap-3 ${
                        isActive
                          ? (isDarkMode 
                              ? 'bg-white text-black border-white shadow-[0_10px_30px_-5px_rgba(255,255,255,0.3)]' 
                              : 'bg-black text-white border-black shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)]')
                          : (isDarkMode 
                              ? 'text-zinc-500 border-white/10 bg-white/5 hover:border-white/30 hover:text-white' 
                              : 'text-zinc-400 border-black/10 bg-black/5 hover:border-black/30 hover:text-black')
                      }`}
                    >
                      <span>{tag}</span>
                      <span className={`text-[8px] opacity-40 font-bold px-2 py-0.5 rounded-full ${
                        isActive 
                          ? (isDarkMode ? 'bg-black/10' : 'bg-white/10')
                          : (isDarkMode ? 'bg-white/10' : 'bg-black/10')
                      }`}>
                        {tagData.counts[tag]}
                      </span>
                    </button>
                  );
               })}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-16 md:gap-24 pt-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, idx) => (
              <ScrollReveal key={`${project.id}-${activeTag}`} delay={idx * 150} threshold={0.1}>
                <div 
                  className={`group relative p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] transition-all duration-700 border transform-gpu hover:-translate-y-2 ${
                    isDarkMode 
                      ? 'border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-white/20 hover:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]' 
                      : 'border-black/5 bg-zinc-50/40 hover:bg-white hover:border-black/10 hover:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
                    <div className="lg:col-span-7 relative">
                      <div className={`aspect-[16/10] overflow-hidden rounded-3xl border transition-all duration-1000 ${isDarkMode ? 'border-white/10 bg-zinc-900 shadow-inner' : 'border-black/10 bg-zinc-50 shadow-inner'}`}>
                        <ProjectGallery project={project} isDarkMode={isDarkMode} />
                      </div>
                      <div className="absolute top-6 right-6 z-10 pointer-events-none">
                         <span className={`text-[12px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-2xl transition-transform duration-700 group-hover:-translate-y-1 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                          0{project.id}
                         </span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-0 h-full">
                      <div className="space-y-8 md:space-y-10 flex flex-col justify-between h-full">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className={`h-[1px] w-8 transition-all duration-700 group-hover:w-16 group-hover:bg-blue-500 ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
                            <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>PROJECT / 0{project.id}</span>
                          </div>
                          <h3 className={`text-3xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85] transition-all duration-500 group-hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {project.title}
                          </h3>
                          <p className={`text-md md:text-lg font-light leading-relaxed tracking-wide transition-opacity duration-500 ${isDarkMode ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                            {project.description}
                          </p>
                        </div>

                        <div className="space-y-8">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                              <span 
                                key={tag}
                                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 border rounded-lg ${
                                  isDarkMode ? 'border-white/10 text-zinc-600 bg-white/5' : 'border-black/10 text-zinc-400 bg-black/5'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className={`flex flex-wrap items-baseline gap-x-12 gap-y-6 border-t pt-8 transition-colors ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`group/view inline-flex items-center text-[11px] font-black uppercase tracking-[0.4em] pb-1 border-b-2 border-transparent hover:border-blue-500 transition-all shrink-0 ${isDarkMode ? 'text-white' : 'text-black'}`}
                            >
                              LIVE DEMO
                              <svg className="w-4 h-4 ml-4 transition-transform group-hover/view:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>

                            <button 
                              onClick={() => onOpenSpecs(project)}
                              className={`group/link inline-flex items-center text-[11px] font-black uppercase tracking-[0.4em] pb-1 border-b-2 border-transparent hover:border-blue-500 transition-all opacity-40 hover:opacity-100 shrink-0 ${isDarkMode ? 'text-white' : 'text-black'}`}
                            >
                              SPECS
                              <svg className="w-3.5 h-3.5 ml-3.5 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <ScrollReveal>
              <div className={`py-40 text-center rounded-[4rem] border border-dashed transition-all duration-700 ${isDarkMode ? 'border-white/10 bg-white/[0.02] text-zinc-600' : 'border-black/10 bg-black/[0.02] text-zinc-400'}`}>
                <div className="flex flex-col items-center space-y-8">
                  <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center opacity-30">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-black uppercase tracking-[0.5em]">Nothing found in this category.</p>
                  <button 
                    onClick={() => setActiveTag('ALL')}
                    className="px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
