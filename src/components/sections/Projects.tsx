import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../../data/constants';
import { Project } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';

interface ProjectsProps {
  isDarkMode: boolean;
  onOpenSpecs: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ isDarkMode, onOpenSpecs }) => {
  const [activeTag, setActiveTag] = useState<string>('All');

  const tags = useMemo(() => ['All', 'Vitalis', 'POS System', 'Portfolio'], []);

  const filtered = useMemo(() => {
    if (activeTag === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.title === activeTag);
  }, [activeTag]);

  const hairline = isDarkMode ? 'border-white/10' : 'border-zinc-200';
  const muted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
  const heading = isDarkMode ? 'text-zinc-50' : 'text-zinc-900';

  return (
    <section id="projects" className={`py-12 scroll-mt-20 border-t ${hairline}`}>
      <ScrollReveal variant="fade">
        <h2 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Projects</h2>
        <p className={`mt-2 text-base leading-relaxed ${muted}`}>
          Three live builds. Details covers challenges and solutions.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                aria-pressed={active}
                className={`text-sm px-3.5 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 ${
                  active
                    ? isDarkMode
                      ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                      : 'bg-zinc-900 text-white border-zinc-900'
                    : isDarkMode
                      ? 'border-white/15 text-zinc-400 hover:text-zinc-100 hover:border-white/30'
                      : 'border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      <div className="mt-8 space-y-10">
        {filtered.map((project, i) => (
          <ScrollReveal key={project.id} variant="up" delay={Math.min(i * 100, 200)} threshold={0.1}>
            <article className={`border-t pt-8 ${hairline}`}>
              <ScrollReveal variant="scale" duration={800}>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className={`overflow-hidden rounded-xl border transition-shadow duration-300 group-hover:shadow-lg ${hairline} ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                    <img
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      width={1200}
                      height={750}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                </a>
              </ScrollReveal>
              <ScrollReveal variant="up" delay={120}>
                <div className="mt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className={`text-xl font-semibold tracking-tight ${heading}`}>{project.title}</h3>
                    <span className={`text-[13px] shrink-0 ${muted}`}>
                      {(project.gallery?.length ?? 1) > 1 ? `${(project.gallery?.length ?? 1)} screens` : '1 screen'}
                    </span>
                  </div>
                  <p className={`mt-2 text-[15px] leading-relaxed ${muted}`}>{project.description}</p>
                  <p className="mt-2 text-[13px] text-zinc-500">
                    {project.tags.join(' · ')}
                  </p>
                  <div className="mt-3 flex items-center gap-5 text-sm">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`underline underline-offset-4 ${isDarkMode ? 'text-zinc-200 hover:text-white' : 'text-zinc-800 hover:text-zinc-900'}`}
                    >
                      Live demo
                    </a>
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline underline-offset-4 ${muted} hover:opacity-80`}
                      >
                        Source
                      </a>
                    )}
                    <button
                      onClick={() => onOpenSpecs(project)}
                      className={`underline underline-offset-4 ${muted} hover:opacity-80`}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default Projects;
