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
          <div 
            id="resume-content" 
            className="bg-white text-zinc-900 flex relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            style={{ 
              width: '816px', 
              minHeight: '1056px', 
              boxSizing: 'border-box',
              margin: '0',
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: '11pt',
              display: 'flex',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="w-[33%] bg-zinc-50 border-r border-zinc-100 flex flex-col pt-12 pb-10 px-8">
               <div className="mb-10 flex justify-center">
                 <div className="w-36 h-36 rounded-full overflow-hidden border-[6px] border-white shadow-md grayscale bg-zinc-200">
                    <img 
                      src={RESUME_DATA.profileImage} 
                      alt={RESUME_DATA.name} 
                      className="w-full h-full object-cover"
                    />
                 </div>
               </div>

               <div className="space-y-10">
                 <div className="space-y-4">
                   <h3 className="text-[12px] font-bold text-blue-700 uppercase tracking-widest border-b-2 border-blue-100 pb-1">Personal Info</h3>
                   <div className="space-y-4 text-[12px] leading-snug">
                     <div>
                       <p className="font-bold text-zinc-400 uppercase text-[9px] mb-0.5">Address</p>
                       <p className="text-zinc-800">{RESUME_DATA.contact.address}</p>
                     </div>
                     <div>
                       <p className="font-bold text-zinc-400 uppercase text-[9px] mb-0.5">Phone</p>
                       <p className="text-zinc-800">{RESUME_DATA.contact.phone}</p>
                     </div>
                     <div>
                       <p className="font-bold text-zinc-400 uppercase text-[9px] mb-0.5">Email</p>
                       <p className="text-zinc-800 break-all">{RESUME_DATA.contact.email}</p>
                     </div>
                     <div>
                       <p className="font-bold text-zinc-400 uppercase text-[9px] mb-0.5">LinkedIn</p>
                       <p className="text-zinc-800">{RESUME_DATA.contact.linkedin}</p>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h3 className="text-[12px] font-bold text-blue-700 uppercase tracking-widest border-b-2 border-blue-100 pb-1">Skills</h3>
                   <ul className="space-y-2 text-[12px] text-zinc-800 font-medium">
                     {RESUME_DATA.skills.map((skill, i) => (
                       <li key={i} className="flex items-center">
                         <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 shrink-0"></div>
                         {skill}
                       </li>
                     ))}
                   </ul>
                 </div>

                 <div className="space-y-4">
                   <h3 className="text-[12px] font-bold text-blue-700 uppercase tracking-widest border-b-2 border-blue-100 pb-1">Languages</h3>
                   <ul className="space-y-2 text-[12px] text-zinc-800 font-medium">
                     {RESUME_DATA.languages.map((lang, i) => (
                       <li key={i} className="flex items-center">
                         <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 shrink-0"></div>
                         {lang}
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>

               <div className="mt-auto opacity-20">
                 <p className="text-[8px] font-bold uppercase tracking-widest">Munich Series v4.1</p>
               </div>
            </div>

            <div className="w-[67%] flex flex-col pt-12 pb-10 px-10">
              <div className="mb-12">
                <h1 className="text-[36pt] font-black text-zinc-900 leading-tight tracking-tighter uppercase mb-2">
                  {RESUME_DATA.name.split(' ')[0]}<br/>
                  <span className="text-blue-700">{RESUME_DATA.name.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-[13pt] font-bold text-zinc-400 uppercase tracking-[0.3em]">
                  {RESUME_DATA.title}
                </p>
              </div>

              <div className="space-y-10">
                 <div className="space-y-3">
                   <h3 className="text-[14px] font-black text-zinc-900 uppercase tracking-widest flex items-center">
                     <span className="w-8 h-[2px] bg-blue-600 mr-4"></span>
                     Profile
                   </h3>
                   <p className="text-[11pt] leading-relaxed text-zinc-600 text-justify">
                     {RESUME_DATA.summary}
                   </p>
                 </div>

                 <div className="space-y-3">
                   <h3 className="text-[14px] font-black text-zinc-900 uppercase tracking-widest flex items-center">
                     <span className="w-8 h-[2px] bg-blue-600 mr-4"></span>
                     Experience
                   </h3>
                   <div className="space-y-8 pl-12 relative border-l border-zinc-100">
                     {RESUME_DATA.experience.map((exp, i) => (
                       <div key={i} className="relative">
                          <div className="absolute -left-[52.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-4 border-white ring-1 ring-zinc-200 shadow-sm"></div>
                          
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-[14px] font-bold text-zinc-800 uppercase">{exp.role}</h4>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{exp.period}</span>
                          </div>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                            {exp.company} | {exp.location}
                          </p>
                          <ul className="space-y-1.5">
                            {exp.points.map((pt, j) => (
                              <li key={j} className="text-[11pt] text-zinc-500 leading-snug flex items-start">
                                <span className="mr-2 opacity-30">•</span>
                                {pt}
                              </li>
                            ))}
                          </ul>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="space-y-3">
                   <h3 className="text-[14px] font-black text-zinc-900 uppercase tracking-widest flex items-center">
                     <span className="w-8 h-[2px] bg-blue-600 mr-4"></span>
                     Education
                   </h3>
                   <div className="space-y-6 pl-12 relative border-l border-zinc-100">
                     {RESUME_DATA.education.map((edu, i) => (
                       <div key={i} className="relative">
                          <div className="absolute -left-[52.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-4 border-white ring-1 ring-zinc-200 shadow-sm"></div>
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-[14px] font-bold text-zinc-800 uppercase">{edu.degree}</h4>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{edu.period}</span>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                            {edu.institution} | {edu.location}
                          </p>
                       </div>
                     ))}
                   </div>
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
