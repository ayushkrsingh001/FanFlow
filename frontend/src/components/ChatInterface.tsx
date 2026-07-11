import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Map as MapIcon, Info, Volume2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StadiumMap from './StadiumMap';
import { useChat } from '../hooks/useChat';

export interface ChatInterfaceHandle {
  sendMessage: (text: string) => void;
}

const ChatInterface = forwardRef<ChatInterfaceHandle>((_props, ref) => {
  const { messages, isLoading, sendMessage: doSend, resetLoading } = useChat();
  const [input, setInput] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => {
      resetLoading();
      setTimeout(() => doSend(text), 0);
    },
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input;
    setInput('');
    doSend(text);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <StadiumMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
          <h2 className="text-sm font-semibold text-[#0F172A]">Assistant Online</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMapOpen(!isMapOpen)} 
            aria-label="Toggle map"
            className={`p-2 rounded transition-colors flex items-center gap-1 text-sm font-medium ${isMapOpen ? 'bg-[#F0FDF4] text-[#16A34A]' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'}`}
          >
            <MapIcon size={16} /> <span className="hidden sm:inline">Map</span>
          </button>
          <button className="p-2 rounded text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors flex items-center gap-1 text-sm font-medium">
            <Info size={16} /> <span className="hidden sm:inline">Details</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#F8FAFC]">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <span className="text-[#16A34A] font-bold text-xs">FF</span>
                </div>
              )}
              
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-white text-[#0F172A] border border-[#E2E8F0] shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex justify-between items-center">
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                       <ShieldCheck size={12} className="text-[#16A34A]" /> Verified Fact
                    </span>
                    <button className="text-[#94A3B8] hover:text-[#16A34A] transition-colors p-1 rounded" title="Read Aloud" aria-label="Read Aloud">
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="w-8 h-8 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                 <span className="text-[#16A34A] font-bold text-xs">FF</span>
              </div>
              <div className="bg-white text-[#0F172A] border border-[#E2E8F0] rounded-lg p-4 shadow-sm flex items-center space-x-2 h-12">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 bg-[#94A3B8] rounded-full"></motion.div>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-[#94A3B8] rounded-full"></motion.div>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-[#94A3B8] rounded-full"></motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 md:p-6 bg-white border-t border-[#E5E7EB]">
        <form onSubmit={handleSubmit} className="flex gap-3 relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="input-enterprise flex-1 pl-4 pr-12 py-3 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-[#16A34A] text-white rounded-md hover:bg-[#15803D] disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="text-center mt-3 text-xs text-[#64748B] font-medium flex justify-center items-center gap-4">
          <span>Multilingual Support</span>
          <span className="w-1 h-1 rounded-full bg-[#94A3B8]"></span>
          <span>Accessibility Aware</span>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';
export default ChatInterface;
