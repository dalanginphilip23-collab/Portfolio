import React, { useState, useRef, useEffect } from 'react';
import { geminiService, isGeminiConfigured } from '../../lib/gemini';
import { ChatMessage } from '../../types';
import { QUICK_PROMPTS } from '../../data/constants';

interface AIAssistantProps {
  isDarkMode: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Hi there! I'm John's AI guide. I can help you explore his work, skills, or just chat about frontend development. What's on your mind?", 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isConfigured = isGeminiConfigured();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    if (!isGeminiConfigured()) {
      const offlineMsg: ChatMessage = {
        role: 'model',
        text: "⚠️ AI is offline — no API key found. Add GEMINI_API_KEY to .env.local and restart `npm run dev`. I can still tell you about John's projects/skills from local data — try asking 'What is John's tech stack?'",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, { role: 'user', text, timestamp: new Date() }, offlineMsg]);
      return;
    }
    
    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const modelMsgPlaceholder: ChatMessage = { 
      role: 'model', 
      text: '', 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, modelMsgPlaceholder]);

    try {
      const stream = geminiService.sendMessageStream(text);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = fullResponse;
          }
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === 'model') {
          lastMsg.text = "Oops! I hit a snag. Could you try asking that again?";
        }
        return newMessages;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Ask about John — projects, skills, OJT"
        className={`fixed bottom-8 right-8 z-[40] flex items-center justify-center w-16 h-16 border transition-all duration-500 rounded-full shadow-2xl hover:scale-110 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 group ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100'
          } ${isDarkMode ? 'bg-zinc-900 text-white border-white/10 backdrop-blur-md' : 'bg-white text-black border-black/10 backdrop-blur-md'
          }`}
        aria-label="Open AI Assistant — ask about John's projects and skills"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
      </button>

      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)} 
      />

      <div className={`fixed inset-y-0 right-0 z-[50] w-full md:w-[450px] transform transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col border-l shadow-2xl ${
        isDarkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-black'
      }`} role="dialog" aria-modal="true" aria-label="AI assistant chat" aria-hidden={!isOpen}>
        
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 flex items-center justify-center font-black text-[10px] rounded-xl border ${isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}>
              JD
            </div>
            <div>
              <h3 className="font-black text-[11px] uppercase tracking-[0.4em]">John Philip</h3>
              <div className="flex items-center mt-1">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${!isConfigured ? 'bg-red-500' : isTyping ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">
                  {!isConfigured ? 'Offline — No Key' : isTyping ? 'Generating' : 'Active'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-full transition-all hover:bg-zinc-500/10 ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}
            aria-label="Close Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-gradient-to-b from-transparent to-zinc-500/5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}>
              <div className={`max-w-[85%] p-5 text-[14px] leading-relaxed shadow-sm transition-all duration-300 ${
                msg.role === 'user' 
                  ? (isDarkMode ? 'bg-zinc-800 text-white rounded-[20px] rounded-tr-none' : 'bg-zinc-100 text-black rounded-[20px] rounded-tr-none') 
                  : (isDarkMode ? 'bg-white text-black rounded-[20px] rounded-tl-none' : 'bg-black text-white rounded-[20px] rounded-tl-none shadow-xl')
              }`}>
                {msg.text || (isTyping && i === messages.length - 1 ? <div className="flex gap-1 py-1"><div className="w-1 h-1 bg-current rounded-full animate-bounce"></div><div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div></div> : '')}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest mt-2 opacity-30 ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                {msg.role === 'user' ? 'YOU' : 'JOHN PHILIP'}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        <div className={`p-8 space-y-6 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          {!isConfigured && (
            <div className={`text-[10px] font-bold uppercase tracking-widest p-3 rounded-xl border ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
              Offline — Add GEMINI_API_KEY to .env.local
            </div>
          )}
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {QUICK_PROMPTS.map(prompt => (
              <button
                key={prompt}
                disabled={isTyping}
                onClick={() => handleSend(prompt)}
                className={`whitespace-nowrap px-4 py-2 border text-[9px] font-black uppercase tracking-widest transition-all rounded-full ${
                  isDarkMode ? 'border-white/10 text-zinc-500 hover:text-white hover:border-white bg-white/5' : 'border-black/10 text-zinc-400 hover:text-black hover:border-black bg-black/5'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className={`relative rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-white/10 focus-within:border-white' : 'bg-zinc-50 border-black/10 focus-within:border-black'}`}>
            <label htmlFor="ai-input" className="sr-only">Ask about John's projects, skills, or OJT availability</label>
            <input
              id="ai-input"
              type="text"
              value={inputValue}
              disabled={isTyping}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder={!isConfigured ? "AI offline — add API key" : isTyping ? "Thinking..." : "Ask about projects, skills, OJT..."}
              autoComplete="off"
              className="w-full p-4 pr-14 text-[13px] font-medium tracking-wide bg-transparent focus:outline-none"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={isTyping || !inputValue.trim()}
              aria-label="Send message"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl transition-all focus-visible:outline-2 focus-visible:outline-blue-500 ${inputValue.trim() ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-20'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] font-medium tracking-wide opacity-40">AI answers from portfolio data only — may be incomplete.</p>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
