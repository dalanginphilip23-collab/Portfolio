import React from 'react';
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
      <ScrollReveal>
        <h2 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Stack</h2>
        <p className={`mt-2 text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Tools I use for Vitalis, POS System, and day-to-day support.
        </p>
      </ScrollReveal>

      <div className="mt-8">
        {GROUPS.map((group) => (
          <div
            key={group.label}
            className={`py-5 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 border-t last:border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}
          >
            <h3 className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>{group.label}</h3>
            <p className={`text-[15px] leading-relaxed ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
              {group.items.join('  ·  ')}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
