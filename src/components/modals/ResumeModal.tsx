import React, { useEffect, useState } from 'react';
import { RESUME_DATA } from '../../data/constants';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      handleResize();
      window.addEventListener('resize', handleResize);
      const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
      window.addEventListener('keydown', onEsc);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', onEsc);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleResize = () => {
    const padding = 60;
    const availableWidth = window.innerWidth - padding;
    const availableHeight = window.innerHeight - (padding * 2);
    const resumeWidth = 816;
    const resumeHeight = 1056;

    const scaleW = availableWidth / resumeWidth;
    const scaleH = availableHeight / resumeHeight;
    
    const newScale = Math.min(scaleW, scaleH, 1);
    setScale(Math.max(newScale, 0.3)); 
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setIsGenerating(false);
    onClose();
  };

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.getElementById('resume-content');
    if (!element) return;

    setIsGenerating(true);
    // Yield to paint spinner before blocking html2canvas
    await new Promise(r => setTimeout(r, 60));

    let cloneContainer: HTMLDivElement | null = null;
    let cloneEl: HTMLElement | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
      cloneEl = element.cloneNode(true) as HTMLElement;
      cloneEl.id = 'resume-content-clone';
      cloneEl.style.transform = 'none';
      cloneEl.style.margin = '0';
      cloneContainer = document.createElement('div');
      cloneContainer.style.position = 'fixed';
      cloneContainer.style.left = '-10000px';
      cloneContainer.style.top = '0';
      cloneContainer.style.width = '816px';
      cloneContainer.style.background = '#ffffff';
      cloneContainer.appendChild(cloneEl);
      document.body.appendChild(cloneContainer);
      // Extra yield so close button stays responsive before heavy canvas
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 30)));

      const opt = {
        margin: 0,
        filename: `Resume_${RESUME_DATA.name.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 1.5, 
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
          scrollX: 0,
          windowWidth: 816, 
          width: 816,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter',
          orientation: 'portrait',
          compress: true,
          precision: 16
        },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      const mod: any = await import('html2pdf.js');
      const html2pdf = mod.default || mod;
      if (!html2pdf) throw new Error('html2pdf not loaded');
      const pdfPromise = (html2pdf as any)().set(opt).from(cloneEl).save();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('PDF timeout 15s')), 15000);
      });
      await Promise.race([pdfPromise, timeoutPromise]);
      if (timeoutId) clearTimeout(timeoutId);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      if (timeoutId) clearTimeout(timeoutId);
    } finally {
      if (cloneContainer && cloneContainer.parentNode) cloneContainer.parentNode.removeChild(cloneContainer);
      setIsGenerating(false);
    }
  };

  // kept for single-button PDF short bond paper only - WORD removed per request "one button"

  const technicalSkills: string[] = (RESUME_DATA as any).technicalSkills || RESUME_DATA.skills;
  const relevantStrengths: string[] = (RESUME_DATA as any).relevantStrengths || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 animate-fade-in overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/98 backdrop-blur-3xl cursor-zoom-out" 
        onClick={handleClose} 
      />
      
      <div className="fixed top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 md:gap-3 z-[110] pointer-events-none">
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={`pointer-events-auto flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 ${isGenerating ? 'bg-zinc-700 cursor-wait opacity-80' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-bold text-[11px] md:text-[12px] tracking-wide transition-all shadow-2xl active:scale-95 group`}
        >
          {isGenerating ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          <span>{isGenerating ? 'GENERATING...' : 'DOWNLOAD'}</span>
        </button>
        
        <button 
          onClick={handleClose}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white hover:bg-red-500 hover:text-white text-black md:text-white md:bg-white/10 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-2xl group shrink-0"
          aria-label="Close"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative w-full h-full overflow-y-auto scrollbar-hide flex justify-center items-start pt-16 pb-24 px-4">
        <div 
          className="origin-top transition-transform duration-500 ease-out"
          style={{ transform: `scale(${scale})` }}
        >
          {/* 1-page per latest spec: PROFESSIONAL SUMMARY / TECHNICAL SKILLS / EDUCATION / ACADEMIC PROJECT / RELEVANT STRENGTHS */}
          <div 
            id="resume-content" 
            className="bg-white text-black relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            style={{ 
              width: '816px', 
              minHeight: '1056px', 
              boxSizing: 'border-box',
              margin: '0',
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: '9.5pt',
              display: 'block',
              overflow: 'hidden',
              padding: '48px 48px 36px 48px'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header - Name + contact line (no picture per request) */}
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-[26pt] font-black tracking-tight leading-none uppercase" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                  {RESUME_DATA.name}
                </h1>
                <div className="mt-2 border-t-[1.5px] border-black pt-2 pb-2 border-b-[1.5px] flex flex-wrap gap-2 text-[8.5pt] text-zinc-700">
                  <span>{RESUME_DATA.contact.phone}</span>
                  <span className="opacity-40">|</span>
                  <span>{RESUME_DATA.contact.email}</span>
                  <span className="opacity-40">|</span>
                  <span>{RESUME_DATA.contact.address}</span>
                </div>
              </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            <div className="mt-6">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1">Professional Summary</h2>
              <p className="mt-3 text-[9.5pt] leading-[1.5] text-zinc-800 text-justify">
                {RESUME_DATA.summary}
              </p>
            </div>

            {/* TECHNICAL SKILLS */}
            <div className="mt-6">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1">Technical Skills</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
                {technicalSkills.map((skill, i) => (
                  <li key={i} className="flex text-[9pt] text-zinc-800">
                    <span className="w-2 h-2 bg-black rounded-full mt-[6px] mr-3 shrink-0"></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EDUCATION */}
            <div className="mt-6">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1">Education</h2>
              <div className="mt-3">
                {RESUME_DATA.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="text-[10pt] font-bold uppercase">{edu.degree}</p>
                    <p className="text-[9pt] text-zinc-700">{edu.institution} — {edu.location}</p>
                    <p className="text-[9pt] text-zinc-500">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ACADEMIC PROJECT */}
            <div className="mt-6">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1">Academic Project</h2>
              <div className="mt-3">
                <h3 className="text-[10pt] font-bold uppercase">{(RESUME_DATA as any).selectedAcademicProject?.title || 'Vitalis — AI-Powered Fitness Optimization System'}</h3>
                <p className="text-[8.5pt] font-bold text-zinc-500 uppercase tracking-wide">{(RESUME_DATA as any).selectedAcademicProject?.subtitle || 'BSIT Capstone Project | 2026'}</p>
                <ul className="mt-2 space-y-1">
                  {((RESUME_DATA as any).selectedAcademicProject?.points || []).map((pt: string, i: number) => (
                    <li key={i} className="flex text-[9pt] text-zinc-700 leading-snug">
                      <span className="mr-2 shrink-0">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RELEVANT STRENGTHS */}
            <div className="mt-6">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1">Relevant Strengths</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
                {relevantStrengths.map((s, i) => (
                  <li key={i} className="flex text-[9pt] text-zinc-800">
                    <span className="w-2 h-2 bg-black rounded-full mt-[6px] mr-3 shrink-0"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certification */}
            <div className="mt-8 pt-4">
              <p className="text-[7.5pt] leading-snug text-zinc-600">
                I hereby certify that the information stated in this resume is true, complete, and correct to the best of my knowledge and belief.
              </p>
              <div className="mt-6">
                <div className="inline-block text-center">
                  <div className="border-t border-black min-w-[220px] pt-1">
                    <p className="text-[9pt] font-bold uppercase">{RESUME_DATA.name}</p>
                  </div>
                  <p className="text-[8pt] text-zinc-500 mt-1">Applicant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
