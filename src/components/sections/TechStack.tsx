import React from 'react';
import ScrollReveal from '../ui/ScrollReveal';

interface TechStackProps {
  isDarkMode: boolean;
}

const TechStack: React.FC<TechStackProps> = ({ isDarkMode }) => {

  return (
    <section id="techstack" className="py-20 md:py-28 scroll-mt-24">
      <ScrollReveal variant="fade">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>01 / Stack & Tools</span>
            <h2 className={`text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85] ${isDarkMode ? 'text-white' : 'text-black'}`}>
              STACK &<br />TOOLS.
            </h2>
            <div className={`h-[2px] w-20 ${isDarkMode ? 'bg-blue-600' : 'bg-black'}`}></div>
          </div>
          <p className={`text-sm md:text-[15px] font-light leading-relaxed max-w-md ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            What I use for Vitalis, POS System, and day-to-day IT support — grouped by craft.
          </p>
        </div>
      </ScrollReveal>

      {/* Grouped skills — single source, no duplicate marquee */}
      <ScrollReveal variant="scale" delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
            { label: 'Data', items: ['MySQL', 'APIs', 'Databases'] },
            { label: 'Design & Media', items: ['Figma', 'Canva', 'Adobe Premiere', 'CapCut'] },
            { label: 'IT Support & Workflow', items: ['Git/GitHub', 'React Native', 'Windows OS', 'Cabling & Hardware'] },
          ].map((group) => (
            <div key={group.label} className={`p-5 rounded-2xl border ${isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-black/10 bg-black/[0.02]'}`}>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{group.label}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${isDarkMode ? 'border-white/10 bg-zinc-900/60 text-zinc-100' : 'border-black/10 bg-white text-zinc-800'}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default TechStack;
