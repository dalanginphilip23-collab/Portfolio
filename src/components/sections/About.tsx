import React from 'react';
import { RESUME_DATA } from '../../data/constants';
import ScrollReveal from '../ui/ScrollReveal';

interface AboutProps {
  isDarkMode: boolean;
}

const About: React.FC<AboutProps> = ({ isDarkMode }) => {
  // Single source of truth from RESUME_DATA — keep in sync with constants.ts
  const experiences = [
    {
      year: '2022 — PRESENT',
      title: 'BSIT 4th Year — Frontend & IT Support',
      company: 'STC College of Batangas',
      desc: 'OJT-ready. Building responsive sites with HTML/CSS/JS, React + Tailwind + basic MySQL. IT Support basics: LAN/UTP cabling, hardware assembly, OS/software install, troubleshooting and maintenance. Figma for prototypes; Canva / Premiere / CapCut for basic video edits.'
    },
    {
      year: '2024 — PRESENT',
      title: 'Personal Projects',
      company: 'Vitalis PWA + POS System',
      desc: 'Shipped Vitalis (fitness-app-pied-tau.vercel.app) and POS System (pos-xi-six.vercel.app) on Vercel. This portfolio (portfolio-delta-two-13.vercel.app) + more repos on GitHub: github.com/dalanginphilip23-collab.'
    },
    {
      year: '2022 — 2024',
      title: 'Web Basics & IT Foundations',
      company: 'Self-Taught',
      desc: 'Started with semantic HTML, CSS, JS fundamentals and web architecture; added IT Support foundations — cabling, hardware/software, networking basics and system maintenance.'
    }
  ];

  return (
    <section id="about" className="py-24 md:py-32 border-t border-zinc-500/10 scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <ScrollReveal>
            <div className="lg:sticky lg:top-32 space-y-6">
              <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>02 / About</span>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
                MY<br />JOURNEY.
              </h2>
              <div className={`h-[2px] w-20 ${isDarkMode ? 'bg-blue-600' : 'bg-black'}`}></div>
              <p className={`text-sm font-light leading-relaxed max-w-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Frontend (OJT-ready) with IT Support foundations — based in {RESUME_DATA.contact.address}.
              </p>
              <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-600/20 text-emerald-700'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Open for OJT
              </span>
            </div>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-8 space-y-16">
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <ScrollReveal key={exp.title} delay={i * 100}>
                <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 pb-12 border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <div className={`md:col-span-4 text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {exp.year}
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex flex-col">
                      <span className={`text-2xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>{exp.title}</span>
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{exp.company}</span>
                    </div>
                    <p className={`text-sm md:text-[15px] font-light leading-relaxed max-w-xl ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {exp.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={200}>
            <div className="space-y-6">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Relevant strengths</h3>
              <ul className="flex flex-wrap gap-2">
                {RESUME_DATA.relevantStrengths.map((s) => (
                  <li
                    key={s}
                    className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap ${isDarkMode ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-black/10 bg-black/[0.03] text-zinc-700'}`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
