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
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
      setCurrentIndex(0);
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
    <div role="dialog" aria-modal="true" aria-label={`${currentProject.title} details`} className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className={`relative w-full max-w-2xl max-h-[88vh] overflow-y-auto scrollbar-hide rounded-2xl border ${
        isDarkMode ? 'bg-[#09090B] border-white/10 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        
        <div className="relative w-full overflow-hidden shrink-0">
          {images.map((src, idx) => (
            <a
              key={src}
              href={currentProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${currentIndex === idx ? 'block' : 'hidden'}`}
              aria-label={`View ${currentProject.title} live`}
            >
              <img
                src={src}
                alt={`${currentProject.title} - Preview ${idx + 1} of ${images.length}`}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[16/10] object-cover"
              />
            </a>
          ))}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
              <button
                onClick={prevImage}
                aria-label="Previous preview image"
                className="px-3 py-1 text-[13px] rounded-full bg-black/50 text-white"
              >
                ‹
              </button>
              <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </span>
              <button
                onClick={nextImage}
                aria-label="Next preview image"
                className="px-3 py-1 text-[13px] rounded-full bg-black/50 text-white"
              >
                ›
              </button>
            </div>
          )}

          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-3 right-3 px-3 py-1.5 text-sm rounded-full bg-black/50 text-white"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          <p className="text-[13px] text-zinc-500">Case study</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{currentProject.title}</h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            {currentProject.tags.join(' · ')}
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-sm font-medium">Challenge</h3>
              <p className={`mt-1 text-[15px] leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{currentProject.challenges}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Solution</h3>
              <p className={`mt-1 text-[15px] leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{currentProject.solutions}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Notes</h3>
              <ul className={`mt-2 space-y-1.5 text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {currentProject.technicalSpecifics.map((spec, i) => (
                  <li key={i}>· {spec}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-sm">
              <a
                href={currentProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Live demo
              </a>

              {currentProject.githubLink && (
                <a
                  href={currentProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 text-zinc-500"
                >
                  Source
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
