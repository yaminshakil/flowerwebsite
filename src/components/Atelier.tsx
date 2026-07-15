import React, { useState, FormEvent } from "react";
import { FloriographyBouquet } from "../types";
import { Sparkles, Sprout, Heart, Copy, Check, RotateCcw, PenTool, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PRESET_AESTHETICS = [
  { id: "romantic", label: "Victorian Romantic", emoji: "🥀", desc: "For declarations of quiet or passionate love" },
  { id: "apology", label: "Secret Apology", emoji: "💧", desc: "To mend fractured ties or express remorse" },
  { id: "gratitude", label: "Quiet Gratitude", emoji: "🤍", desc: "Heartfelt appreciation for understanding" },
  { id: "farewell", label: "Melancholic Farewell", emoji: "🍃", desc: "A bittersweet parting or beautiful remembrance" },
  { id: "hopeful", label: "Hopeful Reunion", emoji: "☀️", desc: "Eagerly waiting to see someone dear again" }
];

const LOADING_TIPS = [
  "Sprouting symbolic roots...",
  "Plucking fresh Victorian sweethearts...",
  "Binding the bouquet with silver-dollar eucalyptus...",
  "Translating silent whispers into floriography...",
  "Penning your custom botanical poem...",
  "Sealing the moss care envelope..."
];

export default function Atelier() {
  const [message, setMessage] = useState("");
  const [selectedAesthetic, setSelectedAesthetic] = useState("romantic");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [bouquet, setBouquet] = useState<FloriographyBouquet | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeAestheticLabel = PRESET_AESTHETICS.find(a => a.id === selectedAesthetic)?.label || "Victorian Romantic";

  const handleCompileBouquet = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setBouquet(null);
    setError(null);

    // Rotate loading tips
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 2200);

    try {
      const response = await fetch("/api/floriography", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          mood: activeAestheticLabel
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile bouquet. The flower fields are sleepy.");
      }

      const data = await response.json();
      setBouquet(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred in the garden.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopyPoem = () => {
    if (!bouquet) return;
    const textToCopy = `--- FLORAL SYMBOLIC BOUQUET ---
[Mood]: ${activeAestheticLabel}
[User Message]: "${message}"

${bouquet.introduction}

FLOWERS COMPILED:
${bouquet.flowers.map(f => `- ${f.name} (${f.color}): ${f.meaning}. Symbolism: ${f.symbolism}`).join("\n")}

POETRY COMPOSED:
${bouquet.poetry}

BOTANICAL TENDING:
${bouquet.careInstructions}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setMessage("");
    setBouquet(null);
    setError(null);
  };

  return (
    <div id="floriography-atelier" className="max-w-4xl mx-auto px-4 py-8 text-[#f5f5f0]">
      {/* Introduction Card */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center space-x-2 text-xs font-mono text-[#d4af37] bg-[#121412] border border-[#2a2a24] px-3.5 py-1.5 rounded-full mb-4 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Botanical Atelier</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase text-[#f5f5f0] mb-4">
          The Floriography Atelier
        </h1>
        <p className="text-[#a39a7a] text-sm sm:text-base leading-relaxed">
          Whisper your unspoken thoughts or raw emotions. Our master floriographer will translate your sentiment into a bespoke, symbolic Victorian bouquet, decodable by those who know the language of the leaf.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!loading && !bouquet && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#121412] border border-[#2a2a24] rounded-3xl p-6 sm:p-10 shadow-lg"
          >
            <form onSubmit={handleCompileBouquet} className="space-y-8">
              {/* Step 1: Aesthetic Selection */}
              <div>
                <label className="block text-xs font-mono text-[#a39a7a] uppercase tracking-widest mb-4">
                  Step 1: Select the Floral Mood
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {PRESET_AESTHETICS.map((aes) => {
                    const isSelected = selectedAesthetic === aes.id;
                    return (
                      <button
                        key={aes.id}
                        type="button"
                        onClick={() => setSelectedAesthetic(aes.id)}
                        className={`flex flex-col items-center justify-center p-4 border rounded-2xl text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0c0d0c] border-[#d4af37] shadow-sm scale-102 ring-1 ring-[#2a2a24]"
                            : "bg-[#0c0d0c]/40 border-[#2a2a24] hover:border-[#a39a7a] hover:bg-[#121412]"
                        }`}
                      >
                        <span className="text-2xl mb-2 filter drop-shadow-sm">{aes.emoji}</span>
                        <span className={`text-xs font-semibold leading-tight ${isSelected ? "text-[#d4af37]" : "text-[#f5f5f0]"}`}>
                          {aes.label}
                        </span>
                        <span className="text-[9px] text-[#a39a7a] leading-normal mt-1 max-w-[120px]">
                          {aes.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Input Sentiment */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-mono text-[#a39a7a] uppercase tracking-widest">
                    Step 2: Pour Your Heart in Writing
                  </label>
                  <span className="text-xs text-[#a39a7a]/80 font-mono">
                    {message.length}/500 chars
                  </span>
                </div>
                <textarea
                  required
                  maxLength={500}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. 'I still miss our long conversations on the porch. I am sorry for being so busy, but you still mean the world to me.'"
                  className="w-full bg-[#0c0d0c] border border-[#2a2a24] rounded-2xl p-4 text-[#f5f5f0] placeholder-[#a39a7a]/40 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#2a2a24] transition-all resize-none shadow-inner"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-950/30 border border-red-900 rounded-xl text-xs text-red-200 font-medium">
                  {error}
                </div>
              )}

              {/* Button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="inline-flex items-center space-x-2 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow hover:bg-[#bfa030] hover:shadow-md transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Sprout className="w-4 h-4 text-black animate-bounce" />
                  <span>Weave Symbolic Bouquet</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Loading Screen */}
        {loading && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            {/* Elegant flower growth loader */}
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full animate-ping" />
              <div className="absolute inset-2 border-4 border-[#a39a7a]/20 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sprout className="w-10 h-10 text-[#d4af37] animate-spin" style={{ animationDuration: "12s" }} />
              </div>
            </div>

            <h3 className="font-serif text-lg font-medium text-[#f5f5f0] mb-2">
              Compiling Your Tussie-Mussie
            </h3>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs font-mono text-[#d4af37] tracking-wide"
              >
                {LOADING_TIPS[loadingStep]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Compiled Bouquet Results */}
        {bouquet && !loading && (
          <motion.div
            key="bouquet-result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            {/* Main scroll/letter box */}
            <div className="bg-[#121412] border border-[#2a2a24] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#d4af37] via-[#a39a7a] to-[#2a2a24]" />
              
              <div className="flex justify-between items-center border-b border-[#2a2a24] pb-6 mb-8 gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#a39a7a]">
                    Compiled Bouquet Letter
                  </span>
                  <h3 className="font-serif text-xl font-light text-[#f5f5f0] uppercase tracking-wider mt-1">
                    Bespoke Floriography Composed
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyPoem}
                    className="flex items-center space-x-1 text-xs text-[#a39a7a] bg-[#0c0d0c] hover:bg-[#1c1d1c] border border-[#2a2a24] px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Letter</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-1 text-xs text-[#a39a7a] bg-[#0c0d0c] hover:bg-[#1c1d1c] border border-[#2a2a24] px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Poetic Introduction */}
              <div className="prose prose-stone max-w-3xl mb-10">
                <p className="font-serif text-base text-[#f5f5f0] italic leading-relaxed text-center max-w-2xl mx-auto">
                  "{bouquet.introduction}"
                </p>
              </div>

              {/* Flower composition Grid */}
              <div className="space-y-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] border-b border-[#2a2a24] pb-2">
                  Compiled Blossoms & Meanings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {bouquet.flowers.map((f, i) => (
                    <motion.div
                      key={f.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-[#0c0d0c] border border-[#2a2a24] rounded-2xl p-5 hover:border-[#d4af37]/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-[#a39a7a] bg-[#121412] border border-[#2a2a24] px-2.5 py-0.5 rounded-full">
                          {f.color}
                        </span>
                        <Heart className="w-3.5 h-3.5 text-[#d4af37]/50" />
                      </div>
                      
                      <h5 className="font-serif text-base font-light text-[#f5f5f0] mb-1">
                        {f.name}
                      </h5>
                      <p className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-mono leading-none mb-3">
                        {f.meaning}
                      </p>

                      <div className="space-y-2 text-xs text-[#a39a7a]">
                        <p className="leading-relaxed">
                          <strong className="text-[#f5f5f0]">Lore: </strong>
                          {f.symbolism}
                        </p>
                        <p className="leading-relaxed bg-[#121412] p-2 rounded-lg border border-[#2a2a24]">
                          <strong className="text-[#f5f5f0]">Visual: </strong>
                          {f.visualDescription}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* The Written Poetry scroll */}
              <div className="mt-12 bg-[#0c0d0c] border border-[#2a2a24] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[#d4af37]">
                  <PenTool className="w-16 h-16 pointer-events-none opacity-5" />
                </div>
                
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#d4af37] mb-6 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Written Verse of the Bouquet
                </h4>

                <div className="font-serif text-base sm:text-lg text-[#f5f5f0]/90 leading-loose text-center whitespace-pre-line max-w-md mx-auto italic">
                  {bouquet.poetry}
                </div>
              </div>

              {/* Care Guidelines */}
              <div className="mt-10 border-t border-[#2a2a24] pt-6 flex items-start space-x-3 bg-[#121412] p-5 rounded-2xl border border-[#2a2a24]">
                <Sprout className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                    Atelier Tending Advice
                  </h5>
                  <p className="text-xs text-[#a39a7a] leading-relaxed">
                    {bouquet.careInstructions}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
