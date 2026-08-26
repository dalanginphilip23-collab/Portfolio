import React from 'react';
import { TECH_STACK } from '../../data/constants';
import ScrollReveal from '../ui/ScrollReveal';

interface TechStackProps {
  isDarkMode: boolean;
}

const TechStack: React.FC<TechStackProps> = ({ isDarkMode }) => {
  const groups: { title: string; items: string[] }[] = [
    { title: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React', 'React Native', 'Tailwind CSS'] },
    { title: 'Backend & Data', items: ['MySQL', 'Databases', 'APIs'] },
    { title: 'Tools', items: ['Git/GitHub', 'Figma'] },
    { title: 'IT Support', items: ['Cabling (LAN/UTP)', 'Hardware Assembly', 'Troubleshooting', 'OS / Software Install', 'Networking Basics'] },
    { title: 'Creative', items: ['Canva', 'Adobe Premiere', 'CapCut'] },
  ];

  return (
    <section id="techstack" className="py-20 md:py-28">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Tech Stack & Tools</span>
            <h2 className={`text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85] ${isDarkMode ? 'text-white' : 'text-black'}`}>
              STACK &<br />TOOLS.
            </h2>
            <div className={`h-[2px] w-20 ${isDarkMode ? 'bg-blue-600' : 'bg-black'}`}></div>
          </div>
          <p className={`text-sm font-light leading-relaxed max-w-md ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
            Technologies and tools I use to build Vitalis, POS System and everyday IT support — before every project.
          </p>
        </div>
      </ScrollReveal>

      {/* Infinite marquee - all stack */}
      <ScrollReveal delay={100}>
        <div className="group relative overflow-hidden py-3 -mx-1 mb-14">
          <div className="flex gap-3 w-max animate-marquee">
            {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
              <span
                key={`${tech}-${idx}`}
                className={`px-5 py-3 border text-[11px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap rounded-xl transition-colors ${
                  isDarkMode ? 'border-white/10 bg-zinc-900/50 text-white hover:border-white/20' : 'border-black/10 bg-zinc-50 text-black hover:border-black/20'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${isDarkMode ? 'from-black' : 'from-white'} to-transparent`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l ${isDarkMode ? 'from-black' : 'from-white'} to-transparent`} />
        </div>
      </ScrollReveal>

      {/* Grouped pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((g, i) => (
          <ScrollReveal key={g.title} delay={i * 80}>
            <div className={`p-6 md:p-7 rounded-3xl border h-full ${isDarkMode ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{g.title}</h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map(item => (
                  <span
                    key={item}
                    className={`px-3 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
