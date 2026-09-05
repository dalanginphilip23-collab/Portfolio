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
      <ScrollReveal>
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
                className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
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
        {filtered.map((project) => (
          <ScrollReveal key={project.id}>
            <article className={`border-t pt-8 ${hairline}`}>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group">
                <div className={`overflow-hidden rounded-xl border ${hairline} ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    width={1200}
                    height={750}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[16/10] object-cover"
                  />
                </div>
              </a>
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className={`text-xl font-semibold tracking-tight ${heading}`}>{project.title}</h3>
                  <span className={`text-[13px] shrink-0 ${muted}`}>
                    {(project.gallery?.length ?? 1) > 1 ? `${(project.gallery?.length ?? 1)} screens` : '1 screen'}
                  </span>
                </div>
                <p className={`mt-2 text-[15px] leading-relaxed ${muted}`}>{project.description}</p>
                <p className={`mt-2 text-[13px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
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
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default Projects;
