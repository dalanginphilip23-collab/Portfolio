import React from 'react';
import { TECH_STACK } from '../../data/constants';
import ScrollReveal from '../ui/ScrollReveal';

interface AboutProps {
  isDarkMode: boolean;
}

const About: React.FC<AboutProps> = ({ isDarkMode }) => {
  const experiences = [
    { 
      year: '2025 — PRESENT', 
      title: 'Frontend Developer', 
      company: 'Self-Employed', 
      desc: 'Building responsive websites for local businesses using React and Tailwind CSS. Focusing on modern design patterns and accessible code while expanding my knowledge of the web ecosystem.' 
    },
    { 
      year: '2024 — 2025', 
      title: 'Learning Journey & Personal Projects', 
      company: 'Independent Study', 
      desc: 'Completed intensive online courses and built various personal projects. Gained proficiency in HTML, CSS, JavaScript, and started exploring React and Next.js.' 
    },
    { 
      year: '2025 — 2026', 
      title: 'Web Basics', 
      company: 'Self-Taught', 
      desc: 'Discovered my passion for web development. Began with the fundamentals of web architecture, semantic HTML, and the basics of UI/UX design.' 
    }
  ];

  return (
    <section id="about" className="py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <ScrollReveal>
            <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none lg:sticky lg:top-32 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              MY<br/>JOURNEY.
            </h2>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-8 space-y-20">
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 pb-12 border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <div className={`md:col-span-4 text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {exp.year}
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex flex-col">
                      <span className={`text-2xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>{exp.title}</span>
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{exp.company}</span>
                    </div>
                    <p className={`text-sm font-light leading-relaxed max-w-xl ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
                      {exp.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <div className="space-y-8">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Technical Toolbox</h3>
              <div className="group relative overflow-hidden py-2 -mx-1">
                <div className="flex gap-3 w-max animate-marquee">
                  {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
                    <span
                      key={`${tech}-${idx}`}
                      className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap transition-colors ${
                        isDarkMode ? 'border-white/10 bg-zinc-900/50 text-white hover:border-white/20' : 'border-black/10 bg-zinc-50 text-black hover:border-black/20'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {/* edge fades */}
                <div className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${isDarkMode ? 'from-black' : 'from-white'} to-transparent`} />
                <div className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l ${isDarkMode ? 'from-black' : 'from-white'} to-transparent`} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
