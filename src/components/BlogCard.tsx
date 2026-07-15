import React from "react";
import { BlogPost } from "../types";
import { BookOpen, Calendar, Heart, MessageSquare } from "lucide-react";

interface BlogCardProps {
  key?: any;
  post: BlogPost;
  onSelect: (post: BlogPost) => void;
}

export default function BlogCard({ post, onSelect }: BlogCardProps) {
  // Map categories to beautiful Sophisticated Dark colors
  const categoryColors = {
    Floriography: "bg-[#0c0d0c]/90 text-[#d4af37] border-[#2a2a24]",
    "Garden Craft": "bg-[#0c0d0c]/90 text-[#a39a7a] border-[#2a2a24]",
    "Wild Botanicals": "bg-[#0c0d0c]/90 text-[#d4af37] border-[#2a2a24]",
    "Floral Artistry": "bg-[#0c0d0c]/90 text-[#a39a7a] border-[#2a2a24]",
  };

  return (
    <article
      id={`blog-card-${post.id}`}
      onClick={() => onSelect(post)}
      className="group flex flex-col h-full bg-[#121412] border border-[#2a2a24] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#d4af37]/40 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#0c0d0c]">
        <img
          src={post.image}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium tracking-wider border rounded-full uppercase ${categoryColors[post.category] || "bg-[#0c0d0c]/90 text-white border-[#2a2a24]"}`}
          >
            {post.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-6">
        {/* Date and Reading Time */}
        <div className="flex items-center space-x-4 text-xs font-mono text-[#a39a7a] mb-3">
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-[#d4af37]" />
            {post.date}
          </span>
          <span className="flex items-center">
            <BookOpen className="w-3.5 h-3.5 mr-1 text-[#d4af37]" />
            {post.readingTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-light text-[#f5f5f0] tracking-tight leading-snug group-hover:text-[#d4af37] transition-colors duration-300 mb-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#a39a7a] text-sm leading-relaxed flex-grow mb-6">
          {post.excerpt}
        </p>

        {/* Author & Stats Footer */}
        <div className="flex items-center justify-between border-t border-[#2a2a24] pt-4 mt-auto">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full border border-[#2a2a24]"
            />
            <div>
              <p className="text-xs font-semibold text-[#f5f5f0] leading-none">
                {post.author.name}
              </p>
              <p className="text-[10px] text-[#a39a7a] leading-none mt-1">
                {post.author.role}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-[#a39a7a]">
            <span className="flex items-center hover:text-[#d4af37] transition-colors">
              <Heart className="w-3.5 h-3.5 mr-1 text-[#d4af37]" />
              {post.likes}
            </span>
            <span className="flex items-center hover:text-white transition-colors">
              <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#a39a7a]" />
              {post.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
