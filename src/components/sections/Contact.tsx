import React, { useState } from 'react';
import { RESUME_DATA } from '../../data/constants';
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
  const [isSuccess, setIsSuccess] = useState<false | 'form' | 'mailto'>(false);

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

    const subject = `Portfolio inquiry from ${formData.name}`;
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    const mailto = `mailto:${RESUME_DATA.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Optional: if you add VITE_FORMSPREE_ID in .env, we POST there first.
    // Otherwise we fall back to opening the visitor's email client — no fake "delivered" state.
    const formspreeId = (import.meta as any)?.env?.VITE_FORMSPREE_ID as string | undefined;
    let sentViaForm = false;
    if (formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message }),
        });
        sentViaForm = res.ok;
      } catch {
        sentViaForm = false;
      }
    }

    if (!sentViaForm) {
      window.location.href = mailto;
    }

    setIsSubmitting(false);
    setIsSuccess(sentViaForm ? 'form' : 'mailto');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full bg-transparent py-3 text-[15px] border-b focus:outline-none transition-colors ${
      hasError
        ? 'border-red-500'
        : isDarkMode
          ? 'border-white/15 focus:border-white/40 placeholder:text-zinc-600'
          : 'border-zinc-300 focus:border-zinc-500 placeholder:text-zinc-400'
    }`;

  const labelCls = 'text-[13px] text-zinc-500';

  return (
    <section id="contact" className={`py-12 scroll-mt-20 border-t ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
      <ScrollReveal variant="fade">
        <h2 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Contact</h2>
        <p className={`mt-2 text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Open for OJT and junior frontend work. I reply within one business day.
        </p>
        <p className={`mt-3 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          <a href={`mailto:${RESUME_DATA.contact.email}`} className="underline underline-offset-4">{RESUME_DATA.contact.email}</a>
          <span className="mx-2 opacity-40">·</span>
          <a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">GitHub</a>
          <span className="mx-2 opacity-40">·</span>
          <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">LinkedIn</a>
        </p>
      </ScrollReveal>

      <ScrollReveal variant="up" delay={120}>
      <div className="mt-8">
        {isSuccess ? (
          <div className={`rounded-xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
            <h3 className={`text-base font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {isSuccess === 'form' ? 'Message sent — thank you.' : 'Check your email app to send.'}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {isSuccess === 'form'
                ? 'Your message was sent via the contact form.'
                : `Your email app should have opened with a draft to ${RESUME_DATA.contact.email}. Just hit Send.`}
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className={`mt-4 text-sm underline underline-offset-4 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-name" className={labelCls}>Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className={inputCls(!!errors.name)}
                />
                {errors.name && <p role="alert" className="mt-1 text-[13px] text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className={labelCls}>Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  className={inputCls(!!errors.email)}
                />
                {errors.email && <p role="alert" className="mt-1 text-[13px] text-red-500">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className={labelCls}>Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Role, project, or timeline…"
                aria-invalid={!!errors.message}
                className={`${inputCls(!!errors.message)} resize-none`}
              />
              {errors.message && <p role="alert" className="mt-1 text-[13px] text-red-500">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 disabled:opacity-50 ${isDarkMode ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-700'}`}
            >
              {isSubmitting ? 'Sending…' : 'Send message'}
            </button>
            <p className="text-[13px] text-zinc-500">No spam — opens your email app unless a form backend is configured.</p>
          </form>
        )}
      </div>
      </ScrollReveal>
    </section>
  );
};

export default Contact;
