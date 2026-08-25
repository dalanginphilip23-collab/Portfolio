import React, { useState } from 'react';
import ScrollReveal from '../ui/ScrollReveal';

interface ContactProps {
  isDarkMode: boolean;
}

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC<ContactProps> = ({ isDarkMode }) => {
  const [formData, setFormData] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'An email address is required to reply.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'The format "email@example.com" is expected.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'The message field cannot be empty.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please share a few more details (min. 10 chars).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-zinc-500/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32 space-y-12">
            <div className="space-y-8">
              <ScrollReveal>
                <div className="space-y-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>03 / CONNECT</span>
                  <h2 className={`text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    SAY<br/>HELLO.
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <p className={`text-lg font-light leading-relaxed max-w-[280px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  I am currently available for new collaborations and full-time opportunities.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="relative min-h-[500px]">
            {isSuccess ? (
              <div className={`p-12 md:p-20 text-center space-y-10 rounded-[3rem] border animate-fade-in-up flex flex-col items-center justify-center h-full transition-all duration-700 ${
                isDarkMode ? 'border-blue-500/20 bg-blue-500/[0.03] text-white' : 'border-blue-600/10 bg-blue-50 text-black'
              }`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className={`relative w-24 h-24 rounded-full border-2 flex items-center justify-center ${isDarkMode ? 'border-blue-500 text-blue-500' : 'border-blue-600 text-blue-600'}`}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="animate-draw-check" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-4 max-w-sm mx-auto">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Transmission Successful.</h3>
                  <p className={`text-sm font-light leading-relaxed ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
                    Thank you for reaching out. Your message has been encrypted and delivered. I typically respond within one business day.
                  </p>
                </div>

                <button 
                  onClick={() => setIsSuccess(false)} 
                  className={`px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-2xl border ${
                    isDarkMode 
                      ? 'border-white/10 hover:bg-white hover:text-black' 
                      : 'border-black/10 hover:bg-black hover:text-white shadow-xl'
                  }`}
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={`space-y-12 transition-all duration-700 ${isSubmitting ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <ScrollReveal delay={200}>
                    <div className="space-y-4 group">
                      <label className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${
                        errors.name ? 'text-red-500' : (isDarkMode ? 'text-zinc-600 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-black')
                      }`}>Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className={`w-full bg-transparent border-b py-5 text-lg font-light focus:outline-none transition-all ${
                          errors.name 
                            ? 'border-red-500 animate-shake' 
                            : (isDarkMode ? 'border-zinc-800 focus:border-white' : 'border-zinc-200 focus:border-black')
                        }`}
                      />
                      {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-fade-in-up">{errors.name}</p>}
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={300}>
                    <div className="space-y-4 group">
                      <label className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${
                        errors.email ? 'text-red-500' : (isDarkMode ? 'text-zinc-600 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-black')
                      }`}>Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="hello@example.com"
                        className={`w-full bg-transparent border-b py-5 text-lg font-light focus:outline-none transition-all ${
                          errors.email 
                            ? 'border-red-500 animate-shake' 
                            : (isDarkMode ? 'border-zinc-800 focus:border-white' : 'border-zinc-200 focus:border-black')
                        }`}
                      />
                      {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-fade-in-up">{errors.email}</p>}
                    </div>
                  </ScrollReveal>
                </div>

                <ScrollReveal delay={400}>
                  <div className="space-y-4 group">
                    <label className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${
                      errors.message ? 'text-red-500' : (isDarkMode ? 'text-zinc-600 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-black')
                    }`}>Message</label>
                    <textarea 
                      rows={4} 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your vision..."
                      className={`w-full bg-transparent border-b py-5 text-lg font-light focus:outline-none transition-all resize-none ${
                        errors.message 
                          ? 'border-red-500 animate-shake' 
                          : (isDarkMode ? 'border-zinc-800 focus:border-white' : 'border-zinc-200 focus:border-black')
                      }`}
                    />
                    {errors.message && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-fade-in-up">{errors.message}</p>}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={500}>
                  <div className="pt-8">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`relative w-full overflow-hidden py-8 text-[11px] font-black uppercase tracking-[0.5em] transition-all border group-hover:scale-[1.01] active:scale-[0.99] ${
                        isDarkMode ? 'bg-white text-black border-white hover:bg-zinc-200' : 'bg-black text-white border-black hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-4">
                        {isSubmitting ? (
                          <>
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            <span className="ml-2 tracking-[0.6em]">TRANSMITTING</span>
                          </>
                        ) : (
                          <>
                            <span>SEND INQUIRY</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </ScrollReveal>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
