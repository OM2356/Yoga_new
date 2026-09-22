import React, { useState } from 'react';
import { KnowledgeArticle } from '../types';
import { KNOWLEDGE_ARTICLES } from '../data/wellnessData';
import {
  BookOpen,
  Clock,
  Bookmark,
  Share2,
  X,
  Sparkles,
  CheckCircle2,
  Search,
  ArrowRight,
} from 'lucide-react';

interface KnowledgeHubViewProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const KnowledgeHubView: React.FC<KnowledgeHubViewProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  const categories = ['All', 'Somatic Science', 'Breathwork', 'Cycle Syncing', 'Ayurveda & Habits'];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-b border-[#E7DFD5] pb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7969] block mb-2">
            Evidence-Based Somatics
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A251E] tracking-tight">
            Holistic Knowledge Sanctuary
          </h1>
          <p className="text-sm sm:text-base text-[#4E6457] mt-2 max-w-xl font-light">
            Deep-dive clinical insights into autonomic neurobiology, fascial release mechanisms, circadian biology, and timeless Ayurvedic wisdom.
          </p>
        </div>
      </div>

      {/* Category Filter & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7DFD5] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2D5A43] text-white'
                    : 'bg-[#F4EFEB] text-[#4A5E51] hover:bg-[#EAE4DC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C9385]" />
            <input
              type="text"
              placeholder="Search clinical topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#1E2923] placeholder-[#8A9E92] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/30"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => {
          const isBookmarked = bookmarkedIds.includes(article.id);
          return (
            <div
              key={article.id}
              className="bg-white rounded-3xl border border-[#E7DFD5] p-7 hover:shadow-md hover:border-[#BFD5C7] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D5A43] bg-[#E8F1EC] px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-3 text-xs text-[#7A9384]">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                    </span>
                    <button
                      onClick={() => onToggleBookmark(article.id)}
                      className="p-1 hover:text-[#2D5A43] transition-colors"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-[#2D5A43] text-[#2D5A43]' : 'text-[#879D90]'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <h3
                  onClick={() => setActiveArticle(article)}
                  className="text-2xl font-serif text-[#1C2820] group-hover:text-[#2D5A43] cursor-pointer transition-colors mb-2"
                >
                  {article.title}
                </h3>
                <p className="text-xs font-serif italic text-[#597364] mb-4">
                  {article.subtitle}
                </p>
                <p className="text-sm text-[#4E6758] line-clamp-3 leading-relaxed mb-6 font-light">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2ECE3] flex items-center justify-between">
                <span className="text-xs text-[#7A9585]">By {article.author}</span>
                <button
                  onClick={() => setActiveArticle(article)}
                  className="text-xs font-semibold text-[#2D5A43] flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          id="article-reader-modal"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-white max-w-3xl w-full rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E0D7CC] my-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2D5A43] bg-[#E8F1EC] px-3 py-1 rounded-full">
                  {activeArticle.category} • {activeArticle.readTime}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1C2820] mt-3">
                  {activeArticle.title}
                </h2>
                <p className="text-sm italic font-serif text-[#5E7969] mt-1">
                  {activeArticle.subtitle}
                </p>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-xl text-[#789382] hover:bg-[#F3EFEA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author bar */}
            <div className="py-2 border-y border-[#F0EAE1] flex items-center justify-between text-xs text-[#748F7F]">
              <span>Author: {activeArticle.author}</span>
              <button
                onClick={() => onToggleBookmark(activeArticle.id)}
                className="flex items-center space-x-1.5 hover:text-[#2D5A43] transition-colors font-medium"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    bookmarkedIds.includes(activeArticle.id)
                      ? 'fill-[#2D5A43] text-[#2D5A43]'
                      : ''
                  }`}
                />
                <span>
                  {bookmarkedIds.includes(activeArticle.id) ? 'Bookmarked' : 'Save Article'}
                </span>
              </button>
            </div>

            {/* Sections Content */}
            <div className="space-y-6 text-[#2E4236]">
              <p className="text-base font-light italic leading-relaxed text-[#3C5346] bg-[#FAF8F5] p-4 rounded-2xl border border-[#ECE5DC]">
                {activeArticle.summary}
              </p>

              {activeArticle.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-[#1A251E]">
                    {section.heading}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed font-light text-[#384E41]">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Clinical Takeaways */}
            <div className="bg-[#F3F7F4] p-6 rounded-2xl border border-[#CFE0D5] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D5A43] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Clinical & Somatic Takeaways</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#3E5B4B]">
                {activeArticle.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#F0EAE1] flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#204030] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
