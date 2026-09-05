import React from 'react';
import { TECH_STACK } from '../../data/constants';
import ScrollReveal from '../ui/ScrollReveal';

interface TechStackProps {
  isDarkMode: boolean;
}

const GROUPS = [
  { label: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
  { label: 'Data', items: ['MySQL', 'REST APIs', 'Databases'] },
  { label: 'Design & Media', items: ['Figma', 'Canva', 'Premiere', 'CapCut'] },
  { label: 'Support & Workflow', items: ['Git & GitHub', 'Windows', 'Hardware', 'Networking'] },
];

const TechStack: React.FC<TechStackProps> = ({ isDarkMode }) => {
  return (
    <section id="techstack" className={`py-12 scroll-mt-20 border-t ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
      <ScrollReveal variant="fade">
        <h2 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Stack</h2>
        <p className={`mt-2 text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Tools I use for Vitalis, POS System, and day-to-day support.
        </p>
      </ScrollReveal>

      <div className="mt-8">
        {GROUPS.map((group, i) => (
          <ScrollReveal key={group.label} variant="left" delay={i * 80} threshold={0.2}>
            <div
              className={`py-5 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 border-t last:border-b transition-colors hover:pl-1 duration-300 ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}
            >
              <h3 className="text-sm text-zinc-500">{group.label}</h3>
              <p className={`text-[15px] leading-relaxed ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                {group.items.join('  ·  ')}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Restored ambient marquee — kept below groups, minimal pills */}
      <ScrollReveal variant="fade" delay={120}>
        <div className="group relative overflow-hidden py-4 mt-6 select-none" aria-hidden="true">
          <div className="flex gap-2 w-max animate-marquee">
            {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
              <span
                key={`${tech}-${idx}`}
                className={`px-3.5 py-1.5 border text-[13px] rounded-full whitespace-nowrap ${isDarkMode ? 'border-white/10 text-zinc-400 bg-white/[0.02]' : 'border-zinc-200 text-zinc-600 bg-white'}`}
              >
                {tech}
              </span>
            ))}
          </div>
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r ${isDarkMode ? 'from-[#09090B]' : 'from-[#FAFAF9]'} to-transparent`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l ${isDarkMode ? 'from-[#09090B]' : 'from-[#FAFAF9]'} to-transparent`} />
        </div>
      </ScrollReveal>
    </section>
  );
};

export default TechStack;
