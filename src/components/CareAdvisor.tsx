import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { Send, User, Sparkles, HelpCircle, Sprout, Loader2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTED_QUERIES = [
  "How do I grow lush, velvety moss on stepping stones?",
  "Why are my peonies dropping their crimson buds early?",
  "How do I dry lavender stems while keeping their deep purple color?",
  "What is the historical folklore of the Forget-Me-Not flower?",
];

const BOTANIST_INTRO_MSG = {
  id: "intro",
  role: "system" as const,
  text: "Greetings, friend. I am Brother Thyme, the caretaker of these glasshouses. Whether you need the secrets of acidic soil for moss cultivation, advice on pruning peonies, or are curious about the ancient folklore of garden herbs, pull up a wooden stool and let us talk. What are you tending to today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function CareAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const storageKey = "flower_blog_botanist_chat_v1";

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([BOTANIST_INTRO_MSG]);
      }
    } else {
      setMessages([BOTANIST_INTRO_MSG]);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending]);

  const saveAndSetMessages = (updated: ChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentHistory = [...messages, userMsg];
    saveAndSetMessages(currentHistory);
    setInputText("");
    setSending(true);

    try {
      // Map history to server endpoint expectations
      const serverPayload = currentHistory
        .filter(m => m.id !== "intro")
        .map(m => ({
          role: m.role === "user" ? "user" : "model",
          text: m.text
        }));

      const res = await fetch("/api/botanist-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: serverPayload })
      });

      if (!res.ok) {
        throw new Error("Brother Thyme is currently pruning in the far orchid house.");
      }

      const data = await res.json();
      
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      saveAndSetMessages([...currentHistory, replyMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `Forgive me, friend, my thoughts wandered. ${err.message || "The glasshouse gates seem to be stuck. Let's try again in a moment."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveAndSetMessages([...currentHistory, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm("Would you like to clear your dialogue with Brother Thyme?")) {
      saveAndSetMessages([BOTANIST_INTRO_MSG]);
    }
  };

  return (
    <div id="botanist-study" className="max-w-4xl mx-auto px-4 py-8">
      {/* Header card */}
      <div className="bg-[#121412] border border-[#2a2a24] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-[#d4af37] pointer-events-none">
          <Sprout className="w-20 h-20 opacity-10 rotate-12" />
        </div>
        
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
          alt="Brother Thyme"
          className="w-20 h-20 rounded-2xl border border-[#2a2a24] object-cover shadow-sm"
        />

        <div className="text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#d4af37] bg-[#0c0d0c] border border-[#2a2a24] px-2.5 py-0.5 rounded-full">
              Resident Botanist
            </span>
            <span className="text-[10px] text-[#a39a7a] font-mono flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse mr-1.5" />
              Inside Glasshouse #4
            </span>
          </div>
          <h1 className="font-serif text-2xl font-light uppercase tracking-widest text-[#f5f5f0] mb-2">
            The Greenhouse Study
          </h1>
          <p className="text-[#a39a7a] text-sm leading-relaxed max-w-xl">
            Meet Brother Thyme, our expert floral care-taker. He can help diagnose yellowing leaves, design plant spacing blueprints, or share the rich folklore behind common garden perennials.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center space-x-1 text-xs text-[#a39a7a] hover:text-[#d4af37] bg-[#0c0d0c] hover:bg-[#121412] border border-[#2a2a24] rounded-lg px-3 py-1.5 shadow-sm transition cursor-pointer self-center md:self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Dialogue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Suggested Queries Drawer */}
        <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
          <div className="bg-[#121412] border border-[#2a2a24] rounded-2xl p-5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#f5f5f0] flex items-center mb-4">
              <HelpCircle className="w-4 h-4 text-[#d4af37] mr-1.5" />
              Tending Prompts
            </h4>
            <p className="text-[#a39a7a] text-[11px] leading-relaxed mb-4">
              Click any of these common garden topics to ask Brother Thyme for his written guidance:
            </p>
            <div className="space-y-2">
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={sending}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left bg-[#0c0d0c]/50 hover:bg-[#1c1d1c]/50 hover:border-[#d4af37]/40 border border-[#2a2a24] p-3 rounded-xl text-xs text-[#a39a7a] hover:text-white leading-relaxed transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#121412] border border-[#2a2a24] rounded-2xl p-5 text-center">
            <h5 className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] mb-1">
              Greenhouse Weather
            </h5>
            <p className="font-serif text-sm font-semibold text-[#f5f5f0]">
              Mild Mist • 72°F
            </p>
            <p className="text-[10px] text-[#a39a7a] leading-normal mt-1">
              Soil hydration: Perfect for blooming cuttings.
            </p>
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="lg:col-span-3 flex flex-col h-[550px] bg-[#121412] border border-[#2a2a24] rounded-3xl overflow-hidden shadow-lg order-1 lg:order-2">
          {/* Chat Header */}
          <div className="bg-[#0c0d0c] border-b border-[#2a2a24] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80&h=80"
                  alt="Brother Thyme"
                  className="w-8 h-8 rounded-full border border-[#2a2a24]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#d4af37] border-2 border-[#0c0d0c] rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#f5f5f0] leading-none">
                  Dialogue with Brother Thyme
                </h4>
                <p className="text-[10px] text-[#a39a7a] leading-none mt-1">
                  Answers powered by garden lore and organic botany
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0c0d0c]/30">
            {messages.map((m) => {
              const isUser = m.role === "user";
              const isSystem = m.role === "system";

              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isUser ? (
                      <div className="w-8 h-8 bg-[#121412] border border-[#2a2a24] rounded-full flex items-center justify-center text-[#d4af37] text-xs font-semibold font-mono">
                        U
                      </div>
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80&h=80"
                        alt="Brother Thyme"
                        className="w-8 h-8 rounded-full border border-[#2a2a24] object-cover"
                      />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-xs text-sm ${
                    isUser
                      ? "bg-[#d4af37] text-black font-medium rounded-tr-none"
                      : isSystem
                      ? "bg-[#121412] border border-[#2a2a24] text-[#f5f5f0] rounded-tl-none font-serif leading-relaxed"
                      : "bg-[#0c0d0c] border border-[#2a2a24] text-[#f5f5f0] rounded-tl-none leading-relaxed"
                  }`}>
                    {m.text.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx} className="mb-3 last:mb-0">
                        {para}
                      </p>
                    ))}
                    <div className={`text-[9px] text-right font-mono mt-1 ${isUser ? "text-black/60" : "text-[#a39a7a]/60"}`}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {sending && (
              <div className="flex items-start space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80&h=80"
                  alt="Brother Thyme"
                  className="w-8 h-8 rounded-full border border-[#2a2a24] object-cover"
                />
                <div className="bg-[#0c0d0c] border border-[#2a2a24] rounded-2xl rounded-tl-none p-4 text-xs text-[#a39a7a] flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                  <span>Brother Thyme is flipping through his weathered gardening journals...</span>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Form */}
          <div className="bg-[#0c0d0c] border-t border-[#2a2a24] p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                disabled={sending}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about plant watering, soil mixes, floriography..."
                className="flex-grow bg-[#121412] border border-[#2a2a24] rounded-xl px-4 py-3 text-sm text-[#f5f5f0] placeholder-[#a39a7a]/40 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#2a2a24] transition-all disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="bg-[#d4af37] hover:bg-[#bfa030] text-black p-3.5 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
