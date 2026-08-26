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

  const handleClose = (e?: React.MouseEvent | KeyboardEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setIsGenerating(false);
    // Ensure overflow reset even if download stuck
    document.body.style.overflow = 'unset';
    onClose();
  };

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.getElementById('resume-content');
    if (!element) return;

    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 60));

    let cloneContainer: HTMLDivElement | null = null;
    let cloneEl: HTMLElement | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let didFallback = false;
    const filename = `Resume_${RESUME_DATA.name.replace(/\s+/g, '_')}.pdf`;

    const fallbackTextPDF = async () => {
      if (didFallback) return;
      didFallback = true;
      try {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' });
        const margin = 40;
        const pageW = 612;
        const pageH = 792;
        const bottomMargin = 48;
        let y = 52;
        const w = pageW - margin * 2;
        const checkPage = (needed: number) => {
          if (y + needed > pageH - bottomMargin) {
            doc.addPage();
            y = 48;
          }
        };
        const addTitle = (text: string) => {
          checkPage(30);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(0);
          doc.text(text.toUpperCase(), margin, y);
          doc.setDrawColor(0);
          doc.setLineWidth(0.9);
          doc.line(margin, y + 5, margin + w, y + 5);
          y += 20;
        };
        const addPara = (text: string) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.setTextColor(30);
          const lines = doc.splitTextToSize(text, w);
          checkPage(lines.length * 13 + 14);
          doc.text(lines, margin, y);
          y += lines.length * 13 + 12;
        };
        const addBullets = (items: string[], isTwoCol = false) => {
          if (isTwoCol && items.length > 6) {
            const colW = (w - 12) / 2;
            const half = Math.ceil(items.length / 2);
            const left = items.slice(0, half);
            const right = items.slice(half);
            const maxRows = Math.max(left.length, right.length);
            checkPage(maxRows * 15 + 10);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            for (let i = 0; i < maxRows; i++) {
              if (left[i]) {
                doc.setFillColor(0, 0, 0);
                doc.circle(margin + 3, y - 2, 1.6, 'F');
                const lines = doc.splitTextToSize(left[i], colW - 14);
                doc.text(lines, margin + 10, y);
              }
              if (right[i]) {
                const rx = margin + colW + 8;
                doc.setFillColor(0, 0, 0);
                doc.circle(rx + 3, y - 2, 1.6, 'F');
                const lines = doc.splitTextToSize(right[i], colW - 14);
                doc.text(lines, rx + 10, y);
              }
              y += 15;
            }
            y += 8;
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(30);
            checkPage(items.length * 15 + 10);
            items.forEach(item => {
              const lines = doc.splitTextToSize(item, w - 16);
              checkPage(lines.length * 12 + 6);
              doc.setFillColor(0, 0, 0);
              doc.circle(margin + 4, y - 2, 1.7, 'F');
              doc.text(lines, margin + 12, y);
              y += lines.length * 12 + 6;
            });
            y += 6;
          }
        };
        // Header - Arial 12 as per request, more spacing
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(0);
        doc.text(RESUME_DATA.name, margin, y);
        y += 16;
        doc.setDrawColor(0);
        doc.setLineWidth(1);
        doc.line(margin, y, margin + w, y);
        y += 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60);
        doc.text(`${RESUME_DATA.contact.phone}  |  ${RESUME_DATA.contact.email}  |  ${RESUME_DATA.contact.address}`, margin, y);
        doc.setTextColor(0);
        y += 14;
        doc.line(margin, y, margin + w, y);
        y += 18;

        addTitle('Professional Summary');
        addPara(RESUME_DATA.summary);

        addTitle('Technical Skills');
        const tech: string[] = (RESUME_DATA as any).technicalSkills || RESUME_DATA.skills;
        addBullets(tech, true);

        addTitle('Education');
        (RESUME_DATA.education as any[]).forEach((edu: any) => {
          checkPage(32);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(0);
          doc.text((edu.degree || edu.level || '').toUpperCase(), margin, y);
          y += 13;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(70);
          doc.text(`${edu.institution} — ${edu.location}`, margin, y);
          y += 12;
          doc.setTextColor(110);
          doc.text(edu.period, margin, y);
          doc.setTextColor(0);
          y += 16;
        });

        addTitle('Academic Project');
        const proj: any = (RESUME_DATA as any).selectedAcademicProject;
        if (proj) {
          checkPage(40);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(0);
          doc.text(proj.title.toUpperCase(), margin, y);
          y += 13;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(90);
          doc.text(proj.subtitle, margin, y);
          doc.setTextColor(0);
          y += 14;
          addBullets(proj.points);
        }

        addTitle('Relevant Strengths');
        addBullets(((RESUME_DATA as any).relevantStrengths as string[]) || [], true);

        // Certification
        checkPage(40);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(90);
        doc.text('I hereby certify that the information stated in this resume is true, complete, and correct to the best of my knowledge and belief.', margin, y, { maxWidth: w });
        y += 22;
        doc.setDrawColor(0);
        doc.setLineWidth(0.7);
        doc.line(margin, y, margin + 170, y);
        y += 12;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0);
        doc.text(RESUME_DATA.name, margin, y);
        y += 9;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(110);
        doc.text('Applicant', margin, y);

        doc.save(filename);
      } catch (err) {
        console.error('Fallback PDF failed', err);
      }
    };

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
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 30)));

      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { 
          scale: 1, 
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
        timeoutId = setTimeout(() => reject(new Error('PDF timeout 10s')), 10000);
      });
      await Promise.race([pdfPromise, timeoutPromise]);
      if (timeoutId) clearTimeout(timeoutId);
    } catch (error) {
      console.error("PDF Generation failed, trying fallback:", error);
      if (timeoutId) clearTimeout(timeoutId);
      // Fallback ensures download always happens even if html2canvas hangs/blocked
      await fallbackTextPDF();
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
      
      <div className="fixed top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 md:gap-3 z-[9999]">
        <button 
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 ${isGenerating ? 'bg-zinc-700 cursor-wait opacity-80' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'} text-white rounded-lg font-bold text-[11px] md:text-[12px] tracking-wide transition-all shadow-2xl group cursor-pointer`}
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
          type="button"
          onClick={(e) => handleClose(e)}
          onMouseDown={(e) => { e.preventDefault(); handleClose(e); }}
          onTouchStart={(e) => { e.preventDefault(); handleClose(e as any); }}
          className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white text-black hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all border-2 border-white shadow-2xl group shrink-0 cursor-pointer"
          aria-label="Close CV"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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
              fontSize: '12pt',
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
            <div className="mt-8">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1.5">Professional Summary</h2>
              <p className="mt-4 text-[12pt] leading-[1.6] text-zinc-800 text-justify">
                {RESUME_DATA.summary}
              </p>
            </div>

            {/* TECHNICAL SKILLS */}
            <div className="mt-8">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1.5">Technical Skills</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                {technicalSkills.map((skill, i) => (
                  <li key={i} className="flex text-[12pt] text-zinc-800 leading-[1.5]">
                    <span className="w-2 h-2 bg-black rounded-full mt-[8px] mr-3 shrink-0"></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EDUCATION */}
            <div className="mt-8">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1.5">Education</h2>
              <div className="mt-4 space-y-5">
                {RESUME_DATA.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="text-[12pt] font-bold uppercase leading-tight">{edu.degree}</p>
                    <p className="text-[11pt] text-zinc-700 leading-snug mt-1">{edu.institution} — {edu.location}</p>
                    <p className="text-[11pt] text-zinc-500 leading-snug">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ACADEMIC PROJECT */}
            <div className="mt-8">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1.5">Academic Project</h2>
              <div className="mt-4">
                <h3 className="text-[12pt] font-bold uppercase leading-tight">{(RESUME_DATA as any).selectedAcademicProject?.title || 'Vitalis — AI-Powered Fitness Optimization System'}</h3>
                <p className="text-[10pt] font-bold text-zinc-500 uppercase tracking-wide mt-1">{(RESUME_DATA as any).selectedAcademicProject?.subtitle || 'BSIT Capstone Project | 2026'}</p>
                <ul className="mt-3 space-y-2">
                  {((RESUME_DATA as any).selectedAcademicProject?.points || []).map((pt: string, i: number) => (
                    <li key={i} className="flex text-[12pt] text-zinc-700 leading-[1.6]">
                      <span className="mr-2 shrink-0">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RELEVANT STRENGTHS */}
            <div className="mt-8">
              <h2 className="text-[12pt] font-black uppercase tracking-wide border-b border-black pb-1.5">Relevant Strengths</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                {relevantStrengths.map((s, i) => (
                  <li key={i} className="flex text-[12pt] text-zinc-800 leading-[1.5]">
                    <span className="w-2 h-2 bg-black rounded-full mt-[8px] mr-3 shrink-0"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certification */}
            <div className="mt-10 pt-6">
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
