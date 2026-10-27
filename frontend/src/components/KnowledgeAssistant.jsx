import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  BookOpen, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Check,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

export const KnowledgeAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "### Welcome to the Construction Knowledge AI\n\nI am your specialized Civil Engineering & Construction Management Consultant. I can answer inquiries regarding:\n- **Building Codes & Standards** (OSHA 1926, ACI 318, IS 456, Eurocode 2, IBC)\n- **Concrete Mix Design & Curing Protocols**\n- **Quality Control & Slump Testing**\n- **Excavation & Shoring Engineering**\n\nSelect a sample query below or type your technical inquiry.",
      references: ['ACI 318-19', 'OSHA 1926 Subpart P', 'IS 456:2000']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    'What is the minimum concrete curing time for OPC vs PPC?',
    'What are the acceptable slump ranges for pumped structural slabs?',
    'Explain OSHA trenching and shoring requirements for depth > 5ft',
    'What are nominal mix ratios for M20 and M25 concrete?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chatAssistant(newMessages);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.reply,
          references: response.references || [],
          suggested_followups: response.suggested_followups || []
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `⚠️ Error querying knowledge engine: ${err.message}`,
          references: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat history cleared. How can I assist your construction engineering team today?",
        references: []
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Construction Knowledge Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous civil engineering chatbot with building code compliance (OSHA, ACI, IS), mix proportioning, and quality control.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition flex items-center space-x-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Session</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-xl">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-brand-500 text-white'
                      : 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-850 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1 text-slate-400">
                          <Sparkles className="w-3 h-3 text-brand-400" />
                          <span>Civil AI Response</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(msg.content, idx)}
                          className="hover:text-slate-200 transition flex items-center space-x-1"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reference Badges */}
                  {msg.references && msg.references.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.references.map((ref, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-brand-300 border border-slate-700/60"
                        >
                          📚 {ref}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Followup suggestions */}
                  {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Suggested Inquiries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggested_followups.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSend(sug)}
                            className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 hover:border-brand-500/50 transition text-left"
                          >
                            ↳ {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-850 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-400" />
                <span>Consulting civil engineering database...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-slate-850/60 border-t border-slate-800 overflow-x-auto scrollbar-none flex gap-2">
          {samplePrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-lg text-[11px] whitespace-nowrap bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any construction, structural, or OSHA compliance question..."
              className="flex-1 bg-slate-850 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white transition shadow-lg shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
