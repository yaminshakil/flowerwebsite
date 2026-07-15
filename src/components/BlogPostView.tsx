import React, { useState, useEffect, FormEvent } from "react";
import { BlogPost, Comment } from "../types";
import { ArrowLeft, BookOpen, Calendar, Heart, Send, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

// Simple Markdown helper to parse our blog posts neatly
function renderMarkdownContent(text: string) {
  const lines = text.split("\n");
  let inList = false;
  const listItems: string[] = [];

  return lines.map((line, index) => {
    // Heading 2 (e.g. ## Title)
    if (line.startsWith("## ")) {
      inList = false;
      return (
        <h2 key={index} className="font-serif text-2xl font-light uppercase tracking-widest text-[#f5f5f0] mt-8 mb-4 border-b border-[#2a2a24] pb-2">
          {line.replace("## ", "")}
        </h2>
      );
    }
    // Heading 3 (e.g. ### Subtitle)
    if (line.startsWith("### ")) {
      inList = false;
      return (
        <h3 key={index} className="font-serif text-xl font-light text-[#f5f5f0] mt-6 mb-3">
          {line.replace("### ", "")}
        </h3>
      );
    }
    // List item (e.g. * Item)
    if (line.startsWith("* ")) {
      inList = true;
      const content = line.replace("* ", "");
      // Bold text inside list item: **Bold** -> <strong>Bold</strong>
      const parts = content.split("**");
      return (
        <li key={index} className="ml-6 list-disc text-[#a39a7a] text-base leading-relaxed mb-2">
          {parts.map((part, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-[#f5f5f0] font-semibold">{part}</strong> : part))}
        </li>
      );
    }
    // Numbered List item (e.g. 1. Item)
    if (/^\d+\.\s/.test(line)) {
      inList = false;
      const content = line.replace(/^\d+\.\s/, "");
      const parts = content.split("**");
      return (
        <div key={index} className="flex items-start space-x-3 my-3">
          <span className="font-mono text-xs font-bold bg-[#121412] text-[#d4af37] px-2.5 py-1 rounded-md border border-[#2a2a24] mt-0.5">
            {line.match(/^\d+/)?.[0]}
          </span>
          <p className="text-[#a39a7a] text-base leading-relaxed">
            {parts.map((part, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-[#f5f5f0] font-semibold">{part}</strong> : part))}
          </p>
        </div>
      );
    }
    // Empty line
    if (line.trim() === "") {
      return null;
    }

    // Bold paragraphs helper: **Text** -> <strong>Text</strong>
    const parts = line.split("**");
    return (
      <p key={index} className="text-[#a39a7a] text-base leading-relaxed mb-6">
        {parts.map((part, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-[#f5f5f0] font-semibold">{part}</strong> : part))}
      </p>
    );
  });
}

const AVATAR_POOL = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100",
];

export default function BlogPostView({ post, onBack }: BlogPostViewProps) {
  const [likes, setLikes] = useState<number>(post.likes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");

  // Key storage tags
  const likesKey = `flower_blog_likes_${post.id}`;
  const commentsKey = `flower_blog_comments_${post.id}`;

  // Load persisted stats
  useEffect(() => {
    // Likes
    const savedLikedStatus = localStorage.getItem(likesKey);
    if (savedLikedStatus === "true") {
      setHasLiked(true);
      setLikes(post.likes + 1);
    } else {
      setLikes(post.likes);
    }

    // Comments
    const savedComments = localStorage.getItem(commentsKey);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      // Default placeholder comments
      const defaults: Comment[] = [
        {
          id: "def-1",
          authorName: "Iris Bloomwood",
          avatarUrl: AVATAR_POOL[0],
          content: `This is absolutely delightful! I never knew sweet violets held such deep meaning in history. I am definitely gathering some for a friend.`,
          timestamp: "2 hours ago"
        },
        {
          id: "def-2",
          authorName: "Silas Rowan",
          avatarUrl: AVATAR_POOL[2],
          content: `The writing is so calming and beautifully composed. The editorial photography assets on this blog really make it feel premium.`,
          timestamp: "5 hours ago"
        }
      ];
      setComments(defaults);
      localStorage.setItem(commentsKey, JSON.stringify(defaults));
    }
  }, [post.id]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      localStorage.removeItem(likesKey);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      localStorage.setItem(likesKey, "true");
    }
  };

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const name = commenterName.trim() || "Anonymous Botanical Enthusiast";
    const randomAvatar = AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)];

    const commentToAdd: Comment = {
      id: `comment-${Date.now()}`,
      authorName: name,
      avatarUrl: randomAvatar,
      content: newComment,
      timestamp: "Just now"
    };

    const updated = [commentToAdd, ...comments];
    setComments(updated);
    localStorage.setItem(commentsKey, JSON.stringify(updated));
    setNewComment("");
    setCommenterName("");
  };

  return (
    <div id={`blog-view-${post.id}`} className="min-h-screen bg-[#0c0d0c] pb-20 text-[#f5f5f0]">
      {/* Editorial Floating Progress/Back Bar */}
      <div className="sticky top-0 z-30 bg-[#0c0d0c]/85 backdrop-blur-md border-b border-[#2a2a24]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-[#a39a7a] hover:text-[#d4af37] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Florals
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                hasLiked
                  ? "bg-[#121412] text-[#d4af37] border-[#d4af37]/40 shadow-sm"
                  : "bg-[#0c0d0c] text-[#a39a7a] border-[#2a2a24] hover:border-[#a39a7a]"
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform duration-300 ${hasLiked ? "fill-[#d4af37] text-[#d4af37] scale-110" : ""}`} />
              <span>{likes} Likes</span>
            </button>
            <span className="text-xs font-mono text-[#a39a7a] bg-[#121412] border border-[#2a2a24] px-2.5 py-1 rounded-md">
              {post.category}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Post Heading Block */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 text-xs font-mono text-[#d4af37] uppercase tracking-widest mb-3">
            <span>{post.category}</span>
            <span>•</span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <BookOpen className="w-3 h-3 mr-1" />
              {post.readingTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#f5f5f0] leading-tight max-w-3xl mx-auto mb-6">
            {post.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center justify-center space-x-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full border-2 border-[#2a2a24] shadow-sm"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-[#f5f5f0]">{post.author.name}</p>
              <p className="text-xs text-[#a39a7a]">{post.author.role}</p>
            </div>
          </div>
        </div>

        {/* Feature Hero Image */}
        <div className="w-full aspect-21/9 rounded-3xl overflow-hidden shadow-sm border border-[#2a2a24] mb-12">
          <img
            src={post.image}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Post Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Reading Column */}
          <article className="lg:col-span-3 prose prose-invert max-w-none">
            {renderMarkdownContent(post.content)}
          </article>

          {/* Sidebar Metadata / Author Note */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#121412] border border-[#2a2a24] rounded-2xl p-6">
              <h4 className="font-serif text-lg font-light uppercase tracking-wider text-[#f5f5f0] border-b border-[#2a2a24] pb-2 mb-4">
                The Botanist's Desk
              </h4>
              <p className="text-xs text-[#a39a7a] leading-relaxed">
                Thank you for visiting {post.author.name}'s botanical study. This journal is a slow-crafted research note dedicated to reintroducing nature's intricate codes back into our busy modern lives.
              </p>
              <div className="mt-4 pt-4 border-t border-[#2a2a24] flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono text-[#a39a7a] bg-[#0c0d0c] border border-[#2a2a24] px-2.5 py-1 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#121412]/60 border border-[#2a2a24] rounded-2xl p-6 text-center">
              <Sparkles className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
              <h5 className="font-serif text-sm font-light uppercase tracking-wider text-[#f5f5f0] mb-1">
                Floriography Bouquet
              </h5>
              <p className="text-xs text-[#a39a7a] leading-relaxed mb-3">
                Want to speak in the silent whispers of blossoms? Use our Atelier to compile a custom meaning bouquet.
              </p>
              <div className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-widest font-mono">
                AI Powered Atelier
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div id={`comments-section-${post.id}`} className="mt-16 border-t border-[#2a2a24] pt-12 max-w-3xl">
          <h3 className="font-serif text-2xl font-light uppercase tracking-widest text-[#f5f5f0] mb-8 flex items-center border-b border-[#2a2a24] pb-4">
            Journal Conversations ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="bg-[#121412] border border-[#2a2a24] rounded-2xl p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono text-[#a39a7a] uppercase tracking-wider mb-2">
                  Your Signature (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lady Dahlia, Silas Gardener"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  className="w-full bg-[#0c0d0c] border border-[#2a2a24] rounded-lg px-4 py-2 text-sm text-[#f5f5f0] placeholder-[#a39a7a]/40 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#a39a7a] uppercase tracking-wider mb-2">
                Your Thoughts
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share your botanical queries, appreciation, or gardening notes..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-[#0c0d0c] border border-[#2a2a24] rounded-lg px-4 py-3 text-sm text-[#f5f5f0] placeholder-[#a39a7a]/40 focus:outline-none focus:border-[#d4af37] resize-none mb-4"
              />
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 bg-[#d4af37] hover:bg-[#bfa030] text-black font-semibold text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish to Journal</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4 border-b border-[#2a2a24] pb-6 last:border-0 last:pb-0">
                <img
                  src={comment.avatarUrl}
                  alt={comment.authorName}
                  className="w-10 h-10 rounded-full border border-[#2a2a24] object-cover"
                />
                <div className="flex-1 bg-[#0c0d0c]/60 rounded-2xl p-4 border border-[#2a2a24]">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-[#f5f5f0]">{comment.authorName}</h5>
                    <span className="text-[10px] font-mono text-[#a39a7a]/60">{comment.timestamp}</span>
                  </div>
                  <p className="text-[#a39a7a] text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
