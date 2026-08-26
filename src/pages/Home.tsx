import React, { useState, lazy, Suspense } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import TechStack from '../components/sections/TechStack';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import { Project } from '../types';

const AIAssistant = lazy(() => import('../components/features/AIAssistant'));
const ResumeModal = lazy(() => import('../components/modals/ResumeModal'));
const ProjectDetailModal = lazy(() => import('../components/modals/ProjectDetailModal'));

interface HomeProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Home: React.FC<HomeProps> = ({ isDarkMode, toggleTheme }) => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className={`transition-colors duration-700 min-h-screen relative ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <Hero isDarkMode={isDarkMode} onOpenResume={() => setIsResumeOpen(true)} />
        <TechStack isDarkMode={isDarkMode} />
        <Projects isDarkMode={isDarkMode} onOpenSpecs={(project) => setSelectedProject(project)} />
        <Contact isDarkMode={isDarkMode} />
      </main>

      <Footer isDarkMode={isDarkMode} />

      <Suspense fallback={null}>
        <AIAssistant isDarkMode={isDarkMode} />
      </Suspense>
      
      <Suspense fallback={null}>
        <ResumeModal 
          isOpen={isResumeOpen} 
          onClose={() => setIsResumeOpen(false)} 
          isDarkMode={isDarkMode} 
        />
      </Suspense>

      <Suspense fallback={null}>
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          isDarkMode={isDarkMode} 
        />
      </Suspense>
    </div>
  );
};

export default Home;
