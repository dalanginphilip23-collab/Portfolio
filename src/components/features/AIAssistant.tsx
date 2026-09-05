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
        className={`fixed bottom-6 right-6 z-[40] flex items-center gap-2 px-4 h-11 rounded-full border text-sm transition-colors ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${isDarkMode ? 'bg-[#09090B]/90 border-white/15 text-zinc-200' : 'bg-white/90 border-zinc-300 text-zinc-700'
          }`}
        aria-label="Open AI Assistant — ask about John's projects and skills"
        aria-expanded={isOpen}
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Ask John
      </button>

      <div
        className={`fixed inset-0 bg-black/30 z-[45] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed inset-y-0 right-0 z-[50] w-full sm:w-[400px] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col border-l ${
        isDarkMode ? 'bg-[#09090B] border-white/10 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`} role="dialog" aria-modal="true" aria-label="AI assistant chat" aria-hidden={!isOpen}>
        
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Ask about John</h3>
            <p className="text-[13px] text-zinc-500">
              {!isConfigured ? 'Offline — add API key' : isTyping ? 'Thinking…' : 'Projects · skills · OJT'}
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className={`text-sm px-3 py-1.5 rounded-full border ${isDarkMode ? 'border-white/15 text-zinc-300' : 'border-zinc-300 text-zinc-600'}`}
            aria-label="Close chat"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                msg.role === 'user'
                  ? (isDarkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-100 text-zinc-900')
                  : (isDarkMode ? 'bg-white/[0.06] text-zinc-100 border border-white/10' : 'bg-white text-zinc-800 border border-zinc-200')
              }`}>
                {msg.text || (isTyping && i === messages.length - 1 ? '…' : '')}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={`p-5 space-y-3 border-t ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
          {!isConfigured && (
            <p className="text-[13px] text-zinc-500">
              Offline — add GEMINI_API_KEY to .env.local to enable AI.
            </p>
          )}
          <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-hide">
            {QUICK_PROMPTS.map(prompt => (
              <button
                key={prompt}
                disabled={isTyping}
                onClick={() => handleSend(prompt)}
                className={`whitespace-nowrap px-3 py-1.5 border text-[13px] rounded-full transition-colors disabled:opacity-50 ${
                  isDarkMode ? 'border-white/15 text-zinc-400' : 'border-zinc-300 text-zinc-600'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className={`flex items-center gap-2 rounded-full border px-4 ${isDarkMode ? 'border-white/15 focus-within:border-white/30' : 'border-zinc-300 focus-within:border-zinc-400'}`}>
            <label htmlFor="ai-input" className="sr-only">Ask about John's projects, skills, or OJT availability</label>
            <input
              id="ai-input"
              type="text"
              value={inputValue}
              disabled={isTyping}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder={!isConfigured ? "AI offline" : "Ask about projects…"}
              autoComplete="off"
              className="flex-1 py-3 text-sm bg-transparent focus:outline-none"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={isTyping || !inputValue.trim()}
              aria-label="Send message"
              className="text-sm font-medium disabled:opacity-40"
            >
              Send
            </button>
          </div>
          <p className="text-[12px] text-zinc-500">Answers from portfolio data only.</p>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
