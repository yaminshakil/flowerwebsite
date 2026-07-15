import React, { useState, useEffect, FormEvent } from "react";
import { BLOG_POSTS, FLOWER_DICTIONARY } from "./data";
import { BlogPost } from "./types";
import BlogCard from "./components/BlogCard";
import BlogPostView from "./components/BlogPostView";
import Atelier from "./components/Atelier";
import CareAdvisor from "./components/CareAdvisor";
import floralHero from "./assets/images/floral_hero_1784124017082.jpg";
import botanicalPeony from "./assets/images/botanical_peony_1784124044203.jpg";
import {
  BookOpen,
  Sparkles,
  Sprout,
  Heart,
  Search,
  Mail,
  Info,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"journals" | "atelier" | "greenhouse" | "dictionary">("journals");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  
  // Dictionary state
  const [dictSearch, setDictSearch] = useState("");
  const [dictColorFilter, setDictColorFilter] = useState("All");

  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Load subscription status
  useEffect(() => {
    const isSubscribed = localStorage.getItem("flower_blog_newsletter_subscribed") === "true";
    if (isSubscribed) {
      setSubscribed(true);
    }
  }, []);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    localStorage.setItem("flower_blog_newsletter_subscribed", "true");
    localStorage.setItem("flower_blog_newsletter_email", email.trim());
    setSubscribed(true);
    setEmail("");
  };

  // Filter blog posts based on category
  const filteredPosts = categoryFilter === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === categoryFilter);

  // Filter dictionary items
  const colorsList = Array.from(new Set(FLOWER_DICTIONARY.map(f => f.color)));

  const filteredDictionary = FLOWER_DICTIONARY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(dictSearch.toLowerCase()) || 
                          item.meaning.toLowerCase().includes(dictSearch.toLowerCase()) || 
                          item.symbolism.toLowerCase().includes(dictSearch.toLowerCase());
    
    const matchesColor = dictColorFilter === "All" || item.color === dictColorFilter;

    return matchesSearch && matchesColor;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d0c] text-[#f5f5f0] selection:bg-[#d4af37]/30 selection:text-white font-sans">
      
      {/* Editorial Header */}
      <header className="border-b border-[#2a2a24] bg-[#0c0d0c]">
        {/* Top bar styling */}
        <div className="bg-[#121412] text-[#a39a7a] text-[10px] font-mono tracking-widest uppercase py-2 text-center flex items-center justify-center space-x-3 px-4 border-b border-[#2a2a24]">
          <span>SUMMER SOLSTICE EDITORIAL 2026</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline flex items-center">
            <Sprout className="w-3 h-3 text-[#d4af37] mr-1 animate-pulse" />
            TENDING PATHS IN GLASSHOUSE #4
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
          {/* Main Logo typography */}
          <div className="text-center mb-6 cursor-pointer" onClick={() => { setActiveTab("journals"); setSelectedPost(null); }}>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase text-[#f5f5f0] hover:text-[#d4af37] transition-colors duration-300">
              Floral <span className="text-[#a39a7a] font-normal italic">&amp;</span> Chronicles
            </h1>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#a39a7a] mt-2">
              The Language, Craft, and Science of Blooms
            </p>
          </div>

          {/* Elegant tab navigations */}
          <nav className="flex flex-wrap justify-center gap-1.5 bg-[#121412] p-1.5 rounded-xl border border-[#2a2a24]">
            <button
              onClick={() => { setActiveTab("journals"); setSelectedPost(null); }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-medium tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === "journals"
                  ? "bg-[#0c0d0c] text-white border border-[#2a2a24] shadow-sm font-semibold"
                  : "text-[#a39a7a] hover:text-white hover:bg-[#1c1d1c]/50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>The Journals</span>
            </button>

            <button
              onClick={() => { setActiveTab("atelier"); setSelectedPost(null); }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-medium tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === "atelier"
                  ? "bg-[#0c0d0c] text-white border border-[#2a2a24] shadow-sm font-semibold"
                  : "text-[#a39a7a] hover:text-[#f5f5f0] hover:bg-[#1c1d1c]/50"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Floriography Atelier</span>
            </button>

            <button
              onClick={() => { setActiveTab("greenhouse"); setSelectedPost(null); }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-medium tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === "greenhouse"
                  ? "bg-[#0c0d0c] text-white border border-[#2a2a24] shadow-sm font-semibold"
                  : "text-[#a39a7a] hover:text-[#f5f5f0] hover:bg-[#1c1d1c]/50"
              }`}
            >
              <Sprout className="w-4 h-4 text-[#d4af37]" />
              <span>Greenhouse Study</span>
            </button>

            <button
              onClick={() => { setActiveTab("dictionary"); setSelectedPost(null); }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-medium tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === "dictionary"
                  ? "bg-[#0c0d0c] text-white border border-[#2a2a24] shadow-sm font-semibold"
                  : "text-[#a39a7a] hover:text-[#f5f5f0] hover:bg-[#1c1d1c]/50"
              }`}
            >
              <Info className="w-4 h-4 text-[#d4af37]" />
              <span>Botanical Dictionary</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow py-8">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <motion.div
              key="post-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BlogPostView post={selectedPost} onBack={() => setSelectedPost(null)} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "journals" && (
                <div id="journals-tab" className="max-w-7xl mx-auto px-4 space-y-12">
                  
                  {/* Hero Banner Section */}
                  <section className="relative w-full rounded-3xl overflow-hidden bg-[#121412] border border-[#2a2a24] shadow-lg text-white">
                    {/* Background image */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={floralHero}
                        alt="Floral chronicles background"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-25"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />
                    </div>

                    {/* Banner content */}
                    <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-3xl space-y-6">
                      <span className="inline-flex items-center space-x-2 text-xs font-mono text-[#d4af37] bg-[#0c0d0c]/80 border border-[#2a2a24] px-3 py-1 rounded-full uppercase tracking-widest">
                        <Award className="w-3.5 h-3.5" />
                        <span>Featured Botanical Study</span>
                      </span>

                      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight">
                        Living in the Silent Language of Cuttings and Blooms
                      </h2>

                      <p className="text-[#a39a7a] text-sm sm:text-base leading-relaxed">
                        Beyond basic plant physiology lies a secret history. Across centuries, flowers have acted as codes, remedies, and canvas—an intricate dialect waiting to be rediscovered in modern times.
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button
                          onClick={() => {
                            // Find post 1 (Victorian Floriography)
                            const p = BLOG_POSTS.find(bp => bp.id === "1");
                            if (p) setSelectedPost(p);
                          }}
                          className="bg-[#d4af37] hover:bg-[#bfa030] text-black font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow transition cursor-pointer"
                        >
                          Read Study Note
                        </button>
                        <button
                          onClick={() => setActiveTab("atelier")}
                          className="bg-[#121412] hover:bg-[#1c1d1c] text-[#a39a7a] border border-[#2a2a24] font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition cursor-pointer"
                        >
                          Try Floriography Atelier
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Category Filter and Post Grid */}
                  <section id="articles-feed" className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2a2a24] pb-5 gap-4">
                      <div>
                        <h3 className="font-serif text-2xl font-light uppercase tracking-widest text-[#f5f5f0]">
                          Botanical Journal Notes
                        </h3>
                        <p className="text-[#a39a7a] text-xs mt-1">
                          Refined essays on history, cultivation craft, and garden illustration
                        </p>
                      </div>

                      {/* Category Pills */}
                      <div className="flex flex-wrap gap-1.5 bg-[#121412] p-1 rounded-xl border border-[#2a2a24]">
                        {["All", "Floriography", "Garden Craft", "Floral Artistry"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                              categoryFilter === cat
                                ? "bg-[#0c0d0c] text-[#d4af37] border border-[#2a2a24] shadow-xs"
                                : "text-[#a39a7a] hover:text-white"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Blog Posts Grid */}
                    {filteredPosts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                          <BlogCard key={post.id} post={post} onSelect={setSelectedPost} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-[#121412] border border-[#2a2a24] rounded-3xl">
                        <Sprout className="w-10 h-10 text-[#a39a7a] mx-auto mb-3" />
                        <h4 className="font-serif text-lg font-medium text-stone-300">No flower logs found</h4>
                        <p className="text-xs text-[#a39a7a] mt-1">Try another category filter</p>
                      </div>
                    )}
                  </section>

                  {/* Elegant Guild Newsletter signup */}
                  <section id="guild-newsletter" className="border-t border-[#2a2a24] pt-12">
                    <div className="bg-[#121412] border border-[#2a2a24] rounded-3xl p-8 sm:p-12 md:p-16 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <img
                          src={botanicalPeony}
                          alt="Delicate background details"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover filter invert grayscale"
                        />
                      </div>
                      
                      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                          The Flower-Sieve Guild
                        </span>
                        <h3 className="font-serif text-3xl font-light uppercase tracking-widest text-[#f5f5f0]">
                          Receive Seasonal Seedlings
                        </h3>
                        <p className="text-[#a39a7a] text-sm leading-relaxed">
                          Once every three moons, we publish the Floral Guild dispatch—a curated journal note containing exclusive plant lore, high-res botanical studies, and the greenhouse's private care ledger.
                        </p>

                        <AnimatePresence mode="wait">
                          {subscribed ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-[#0c0d0c] border border-emerald-800 rounded-xl p-4 text-[#d4af37] text-xs font-semibold inline-block mt-4"
                            >
                              🎉 Welcome to the Guild! Your seasonal seedlings dispatch has been scheduled.
                            </motion.div>
                          ) : (
                            <motion.form
                              onSubmit={handleSubscribe}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 max-w-md mx-auto"
                            >
                              <div className="relative w-full">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39a7a]" />
                                <input
                                  type="email"
                                  required
                                  placeholder="Enter your botanical email..."
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full bg-[#0c0d0c] border border-[#2a2a24] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f5f5f0] placeholder-[#a39a7a]/40 focus:outline-none focus:border-[#d4af37] transition-all shadow-inner"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#bfa030] text-black font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow hover:shadow-md transition-all cursor-pointer flex-shrink-0"
                              >
                                Join Guild
                              </button>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </section>

                </div>
              )}

              {activeTab === "atelier" && <Atelier />}

              {activeTab === "greenhouse" && <CareAdvisor />}

              {activeTab === "dictionary" && (
                <div id="dictionary-tab" className="max-w-7xl mx-auto px-4 space-y-8">
                  {/* Glossary header */}
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="font-serif text-3xl font-light uppercase tracking-widest text-[#f5f5f0] mb-3">
                      The Floriography Dictionary
                    </h2>
                    <p className="text-[#a39a7a] text-sm">
                      A hand-indexed glossary of traditional Victorian meanings, folklore, and sensory details for common garden blooms.
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="bg-[#121412] border border-[#2a2a24] rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
                    <div className="relative w-full md:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39a7a]" />
                      <input
                        type="text"
                        placeholder="Search flower, meaning, or folklore..."
                        value={dictSearch}
                        onChange={(e) => setDictSearch(e.target.value)}
                        className="w-full bg-[#0c0d0c] border border-[#2a2a24] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#f5f5f0] placeholder-[#a39a7a]/50 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                      <span className="text-xs font-mono text-[#a39a7a] uppercase tracking-wider">
                        Color Accent:
                      </span>
                      <select
                        value={dictColorFilter}
                        onChange={(e) => setDictColorFilter(e.target.value)}
                        className="bg-[#0c0d0c] border border-[#2a2a24] rounded-xl px-3 py-2 text-xs font-medium text-[#f5f5f0] focus:outline-none focus:border-[#d4af37] shadow-xs cursor-pointer"
                      >
                        <option value="All">All Tones</option>
                        {colorsList.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dict Cards Grid */}
                  <div className="max-w-5xl mx-auto">
                    {filteredDictionary.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredDictionary.map((item) => (
                          <div
                            key={item.name}
                            className="bg-[#121412] border border-[#2a2a24] hover:border-[#d4af37]/40 hover:shadow-xs p-6 rounded-2xl transition-all"
                          >
                            <div className="flex items-center justify-between mb-3 border-b border-[#2a2a24] pb-3">
                              <h4 className="font-serif text-lg font-light text-[#f5f5f0]">{item.name}</h4>
                              <span className="text-[10px] font-mono font-medium text-[#a39a7a] bg-[#0c0d0c] px-2.5 py-1 rounded-md border border-[#2a2a24]">
                                {item.color}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest font-mono mb-2">
                              {item.meaning}
                            </p>
                            <p className="text-[#a39a7a] text-xs leading-relaxed">
                              {item.symbolism}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-[#121412] rounded-2xl border border-[#2a2a24] max-w-4xl mx-auto">
                        <Info className="w-8 h-8 text-[#a39a7a] mx-auto mb-2" />
                        <h5 className="font-serif text-sm font-semibold text-[#f5f5f0]">
                          No matching botanical keys
                        </h5>
                        <p className="text-xs text-[#a39a7a] mt-1">
                          Try searching for keywords like 'love', 'loyalty', or select 'All Tones'
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#121412] text-[#a39a7a] text-xs py-12 mt-20 border-t border-[#2a2a24]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-[#f5f5f0] font-light uppercase tracking-widest">
              Floral &amp; Chronicles
            </h4>
            <p className="leading-relaxed text-[#a39a7a] max-w-sm">
              An interactive glasshouse workspace and botanical journal dedicated to sharing the ancient art, science, and folklore of blooms. Crafted with slow intent.
            </p>
          </div>

          {/* Col 2: Shortcuts */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs text-[#d4af37] font-semibold uppercase tracking-[0.2em]">
              Greenhouse Atlas
            </h4>
            <ul className="space-y-2 text-[#a39a7a]">
              <li>
                <button onClick={() => { setActiveTab("journals"); setSelectedPost(null); }} className="hover:text-[#f5f5f0] transition cursor-pointer text-left">
                  📖 Botanical Journal Notes
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("atelier"); setSelectedPost(null); }} className="hover:text-[#f5f5f0] transition cursor-pointer text-left">
                  🥀 AI Floriography Atelier
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("greenhouse"); setSelectedPost(null); }} className="hover:text-[#f5f5f0] transition cursor-pointer text-left">
                  🪴 Conversation with Brother Thyme
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("dictionary"); setSelectedPost(null); }} className="hover:text-[#f5f5f0] transition cursor-pointer text-left">
                  🏷️ Victorian Meaning Glossary
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal / License */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs text-[#d4af37] font-semibold uppercase tracking-[0.2em]">
              Caretaking Ledger
            </h4>
            <p className="leading-relaxed">
              All photographic plates generated at the Atelier and greenhouse are published under creative commons licensing for botanical studies.
            </p>
            <p className="text-[10px] text-[#a39a7a]/60 font-mono mt-2">
              © 2026 Floral Chronicles. Built in the Sophisticated Dark Glasshouse.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
