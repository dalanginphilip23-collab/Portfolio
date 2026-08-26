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

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.getElementById('resume-content');
    if (!element) return;

    setIsGenerating(true);

    const opt = {
      margin: 0,
      filename: `Resume_${RESUME_DATA.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
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
      }
    };

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await (html2pdf as any)().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const personalDataRows = [
    { label: 'Sex:', value: (RESUME_DATA as any).personalData?.sex || 'Male' },
    { label: 'Civil Status:', value: (RESUME_DATA as any).personalData?.civilStatus || 'Single' },
    { label: 'Nationality:', value: (RESUME_DATA as any).personalData?.nationality || 'Filipino' },
    { label: 'Religion:', value: (RESUME_DATA as any).personalData?.religion || 'Roman Catholic' },
    { label: 'Language Spoken:', value: (RESUME_DATA as any).personalData?.languageSpoken || 'Tagalog and English' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 animate-fade-in overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/98 backdrop-blur-3xl cursor-zoom-out" 
        onClick={onClose} 
      />
      
      <div className="fixed top-8 right-8 flex items-center space-x-4 z-[110]">
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={`flex items-center space-x-3 px-8 py-4 ${isGenerating ? 'bg-zinc-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-bold text-[12px] tracking-wide transition-all shadow-2xl active:scale-95 group`}
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
          <span>{isGenerating ? 'GENERATING...' : 'DOWNLOAD PDF'}</span>
        </button>
        
        <button 
          onClick={onClose}
          className="w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all border border-white/20 shadow-2xl group"
        >
          <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative w-full h-full overflow-y-auto scrollbar-hide flex justify-center items-start pt-16 pb-24 px-4">
        <div 
          className="origin-top transition-transform duration-500 ease-out"
          style={{ transform: `scale(${scale})` }}
        >
          {/* 1-page fresh-grad format - matches Image 1 example (CHARLOTTE...) */}
          <div 
            id="resume-content" 
            className="bg-white text-black relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            style={{ 
              width: '816px', 
              minHeight: '1056px', 
              boxSizing: 'border-box',
              margin: '0',
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: '10pt',
              display: 'block',
              overflow: 'hidden',
              padding: '48px 48px 36px 48px'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header - Name + contact line + photo */}
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-[28pt] font-black tracking-tight leading-none uppercase" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
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
              <div className="w-[112px] h-[136px] border border-black shrink-0 bg-white overflow-hidden">
                <img src={RESUME_DATA.profileImage} alt={RESUME_DATA.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* SUMMARY */}
            <div className="mt-6">
              <h2 className="text-[13pt] font-black uppercase tracking-wide border-b border-black pb-1">Summary</h2>
              <p className="mt-3 text-[9.5pt] leading-[1.5] text-zinc-800 text-justify">
                {RESUME_DATA.summary}
              </p>
            </div>

            {/* PERSONAL DATA */}
            <div className="mt-6">
              <h2 className="text-[13pt] font-black uppercase tracking-wide border-b border-black pb-1">Personal Data</h2>
              <ul className="mt-3 space-y-1.5">
                {personalDataRows.map((row) => (
                  <li key={row.label} className="flex text-[9.5pt]">
                    <span className="w-2 h-2 bg-black rounded-full mt-[6px] mr-3 shrink-0"></span>
                    <span className="font-bold min-w-[130px] inline-block">{row.label}</span>
                    <span className="text-zinc-700">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SKILLS - 2-col grid to fit 1-page (too long before) */}
            <div className="mt-6">
              <h2 className="text-[13pt] font-black uppercase tracking-wide border-b border-black pb-1">Skills</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
                {RESUME_DATA.skills.map((skill, i) => (
                  <li key={i} className="flex text-[9.5pt] text-zinc-800">
                    <span className="w-2 h-2 bg-black rounded-full mt-[6px] mr-3 shrink-0"></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EDUCATIONAL BACKGROUND */}
            <div className="mt-6">
              <h2 className="text-[13pt] font-black uppercase tracking-wide border-b border-black pb-1">Educational Background</h2>
              <div className="mt-3 space-y-4">
                {RESUME_DATA.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h3 className="text-[10pt] font-bold uppercase">{edu.level || edu.degree}</h3>
                    <ul className="mt-1 ml-4 list-disc text-[9pt] text-zinc-700 leading-snug">
                      <li>
                        {edu.institution}<br />
                        <span className="text-zinc-500">{edu.location}</span><br />
                        <span className="text-zinc-500">{edu.period}</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification */}
            <div className="mt-8 pt-6">
              <p className="text-[7.5pt] leading-snug text-zinc-600">
                I hereby certify that the information stated in this resume is true, complete, and correct to the best of my knowledge and belief.
              </p>
              <div className="mt-8">
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
