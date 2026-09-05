import React from 'react';
import { RESUME_DATA } from '../../data/constants';
import ScrollReveal from '../ui/ScrollReveal';

interface AboutProps {
  isDarkMode: boolean;
}

const About: React.FC<AboutProps> = ({ isDarkMode }) => {
  const experiences = [
    {
      year: '2022 — Present',
      title: 'BSIT 4th Year, STC College of Batangas',
      desc: 'Frontend with React + Tailwind and basic MySQL. Support basics: cabling, assembly, OS installs, troubleshooting. Figma for prototypes; Canva / Premiere / CapCut for edits.',
    },
    {
      year: '2024 — Present',
      title: 'Personal projects — Vitalis + POS System',
      desc: 'Vitalis PWA and POS System live on Vercel. This portfolio plus more repos on GitHub.',
    },
    {
      year: '2022 — 2024',
      title: 'Foundations',
      desc: 'Semantic HTML, CSS, JavaScript, and IT support fundamentals — hardware, networking, maintenance.',
    },
  ];

  return (
    <section id="about" className={`py-12 scroll-mt-20 border-t ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
      <ScrollReveal variant="fade">
        <h2 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>About</h2>
        <p className={`mt-2 text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Frontend (OJT-ready) with support foundations — based in {RESUME_DATA.contact.address}.
        </p>
      </ScrollReveal>

      <div className="mt-8">
        {experiences.map((exp, i) => (
          <ScrollReveal key={exp.title} variant="right" delay={i * 90} threshold={0.2}>
            <div className={`py-5 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-6 border-t last:border-b transition-colors hover:pl-1 duration-300 ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
              <p className="text-sm text-zinc-500">{exp.year}</p>
              <div>
                <h3 className={`text-[15px] font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{exp.title}</h3>
                <p className={`mt-1 text-[15px] leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{exp.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal variant="fade" delay={120}>
        <p className="mt-6 text-sm leading-relaxed text-zinc-500">
          Strengths: {RESUME_DATA.relevantStrengths.slice(0, 5).join(' · ')}
        </p>
      </ScrollReveal>
    </section>
  );
};

export default About;
