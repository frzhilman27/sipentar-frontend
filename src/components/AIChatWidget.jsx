import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const role = localStorage.getItem("role") || "Warga";
  const name = localStorage.getItem("name") || "Pengguna";

  useEffect(() => {
    // Initial greeting when opened for the first time
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 1, text: `Halo ${name}! Saya SipentarBot, asisten virtual Desa Lamaran Tarung. Ada yang bisa saya bantu terkait infrastruktur desa atau pelayanan Sipentar hari ini?`, isUser: false }
      ]);
    }
  }, [isOpen, messages.length, name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to state
    const newMessages = [...messages, { id: Date.now(), text: userMessage, isUser: true }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { 
        message: userMessage,
        userNameScript: `Pengguna yang bertanya bernama ${name} dengan peran ${role}.`,
        // Note: we can send history here if we want the AI to remember, but for now we keep it simple
      });

      setMessages([
        ...newMessages,
        { id: Date.now() + 1, text: response.data.reply, isUser: false }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        { id: Date.now() + 1, text: 'Maaf, sistem AI sedang sibuk atau ada gangguan jaringan. Silakan coba lagi nanti.', isUser: false, isError: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  // Parse simple markdown-like bold text **text** from AI
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-28 right-4 md:bottom-6 md:right-6 z-[60] font-sans">
      {/* Widget Button */}
      <div className={`transition-all duration-300 transform ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <button 
          onClick={toggleChat}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 sm:p-4 shadow-lg shadow-emerald-500/40 border-2 border-emerald-50 flex items-center justify-center transition-transform hover:scale-110 group"
          title="Tanya SipentarBot AI"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {/* Sparkles */}
          <svg className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>

      {/* Chat Window */}
      <div className={`absolute bottom-0 right-0 w-80 sm:w-96 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-4 border-b border-emerald-700/50 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <svg className="w-6 h-6 text-emerald-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-emerald-800 rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">SipentarBot AI</h3>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold opacity-80">Asisten Infrastruktur</p>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] bg-slate-50/50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.isUser ? 'bg-emerald-600 text-white rounded-br-sm' : msg.isError ? 'bg-red-50 text-red-700 border border-red-100 rounded-bl-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'}`}>
                {msg.isUser ? msg.text : formatText(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanya tentang infrastruktur..." 
              disabled={isLoading}
              className="w-full bg-slate-100 border-transparent text-slate-800 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-1 p-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidget;
