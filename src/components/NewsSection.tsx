import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { 
  Calendar, Clock, ArrowRight, X, Share2, Bookmark, Search, 
  Tag, Check, Copy, ExternalLink, Sparkles, Flame, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCMS } from '../lib/cmsStore';

interface NewsSectionProps {
  selectedArticleId?: string | null;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ selectedArticleId }) => {
  const { news, isAdminLoggedIn } = useCMS();
  
  // Filter out drafts unless admin is logged in
  const visibleNews = news.filter(art => isAdminLoggedIn || art.status !== 'Draft');

  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(() => {
    if (!selectedArticleId) return null;
    return news.find(a => a.id === selectedArticleId || a.slug === selectedArticleId) || null;
  });

  useEffect(() => {
    if (selectedArticleId) {
      const found = news.find(a => a.id === selectedArticleId || a.slug === selectedArticleId) || null;
      setActiveArticle(found);
    } else {
      setActiveArticle(null);
    }
  }, [selectedArticleId, news]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Categories list
  const categories = ['All', ...Array.from(new Set(visibleNews.map(a => a.category || 'General')))];

  const filteredArticles = visibleNews.filter(art => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  // Featured article (first published article or most recent)
  const featuredArticle = filteredArticles[0] || visibleNews[0];
  const gridArticles = filteredArticles.filter(art => featuredArticle ? art.id !== featuredArticle.id : true);

  const articleUrl = activeArticle ? `${window.location.origin}/#news/${activeArticle.slug || activeArticle.id}` : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenArticle = (article: NewsArticle) => {
    setActiveArticle(article);
    window.history.pushState({}, '', `/#news/${article.slug || article.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
    window.history.pushState({}, '', '/#news');
  };

  // Article Navigation indices
  const currentIndex = activeArticle ? visibleNews.findIndex(a => a.id === activeArticle.id) : -1;
  const prevArticle = currentIndex > 0 ? visibleNews[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < visibleNews.length - 1 ? visibleNews[currentIndex + 1] : null;

  const relatedArticles = visibleNews.filter(art => 
    activeArticle ? art.id !== activeArticle.id && (art.category === activeArticle.category || (art.tags && activeArticle.tags && art.tags.some(t => activeArticle.tags?.includes(t)))) : false
  ).slice(0, 3);

  return (
    <div className="bg-[#FAFBF6] text-slate-800 pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] uppercase tracking-widest font-bold mb-6 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Agricultural Insights & Stories</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-slate-900 mb-6">
            Farm News & Updates
          </h1>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            Stay informed on our sustainable farming milestones, greenhouse innovations, livestock health protocols, and rural community initiatives in Gweta, Botswana.
          </p>
        </div>

        {/* SEARCH & CATEGORIES BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 bg-white border border-slate-200 p-4 sm:p-6 shadow-xs">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-[#FAFBF6] text-slate-700 border-slate-200 hover:border-emerald-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags..."
              className="w-full bg-[#FAFBF6] border border-slate-300 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {visibleNews.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-200 p-8">
            <Flame className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-slate-800">No News Articles Found</h3>
            <p className="text-xs text-slate-500 mt-1">Check back soon for latest updates from Gabolekwe Farms.</p>
          </div>
        ) : (
          <>
            {/* FEATURED ARTICLE (If no search query filtering it out) */}
            {featuredArticle && selectedCategory === 'All' && !searchQuery && (
              <div 
                onClick={() => handleOpenArticle(featuredArticle)}
                className="bg-white border border-slate-200 overflow-hidden mb-16 group cursor-pointer hover:border-emerald-600 transition-all shadow-md grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden relative bg-slate-100">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-900 text-white text-[10px] uppercase tracking-widest font-bold shadow-md">
                      Featured Story
                    </span>
                    {featuredArticle.status === 'Draft' && (
                      <span className="px-3 py-1 bg-amber-600 text-white text-[10px] uppercase tracking-widest font-bold">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="text-emerald-700 font-bold uppercase tracking-wider">{featuredArticle.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{featuredArticle.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-6">
                      {featuredArticle.excerpt}
                    </p>

                    {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {featuredArticle.tags.map((tag, i) => (
                          <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs uppercase tracking-widest font-bold text-emerald-700">
                    <span>Read Complete Story</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )}

            {/* ARTICLE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'All' && !searchQuery ? gridArticles : filteredArticles).map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleOpenArticle(article)}
                  className="bg-white border border-slate-200 overflow-hidden hover:border-emerald-600 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] uppercase tracking-widest font-bold border border-emerald-200 shadow-xs">
                          {article.category}
                        </span>
                        {article.status === 'Draft' && (
                          <span className="px-2.5 py-1 bg-amber-600 text-white text-[10px] uppercase tracking-widest font-bold">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{article.date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-serif text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 font-bold">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 flex items-center justify-between border-t border-slate-200 text-xs uppercase tracking-widest font-bold text-emerald-700">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* INDIVIDUAL ARTICLE READER MODAL */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="relative max-w-4xl w-full bg-white border border-slate-200 p-8 sm:p-14 shadow-2xl my-8">
              
              {/* CLEAR X CLOSE BUTTON */}
              <button
                onClick={handleCloseArticle}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-600 transition-colors rounded-full shadow-xs flex items-center justify-center group"
                aria-label="Close article"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center flex-wrap gap-3 pr-12">
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] uppercase tracking-widest font-bold">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-slate-500">• {activeArticle.date}</span>
                  <span className="text-xs text-slate-500">• {activeArticle.readTime}</span>
                  {activeArticle.status === 'Draft' && (
                    <span className="px-2.5 py-0.5 bg-amber-600 text-white text-[10px] uppercase tracking-widest font-bold">
                      Draft Mode
                    </span>
                  )}
                </div>

                <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 leading-tight font-bold">
                  {activeArticle.title}
                </h2>

                <div className="aspect-[16/9] overflow-hidden border border-slate-200 my-6 bg-slate-100 shadow-sm">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="text-slate-700 font-light leading-relaxed space-y-4 text-base sm:text-lg whitespace-pre-line">
                  {activeArticle.content}
                </div>

                {activeArticle.tags && activeArticle.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" /> Tags:
                    </span>
                    {activeArticle.tags.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* SOCIAL SHARING SECTION */}
                <div className="pt-8 border-t border-slate-200">
                  <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-700" />
                    <span>Share This Article</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#1877F2] hover:bg-[#155db2] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>Facebook</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${activeArticle.title}\n\n${activeArticle.excerpt}\n\n${articleUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>WhatsApp</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>LinkedIn</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeArticle.title)}&url=${encodeURIComponent(articleUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>X (Twitter)</span>
                    </a>

                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors border border-slate-300"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* ARTICLE NAVIGATION (Previous / Next / Back to News) */}
                <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {prevArticle ? (
                      <button
                        onClick={() => handleOpenArticle(prevArticle)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-slate-200"
                      >
                        <ChevronLeft className="w-4 h-4 text-emerald-700" />
                        <span className="truncate max-w-[150px]">Prev: {prevArticle.title}</span>
                      </button>
                    ) : <div />}

                    {nextArticle ? (
                      <button
                        onClick={() => handleOpenArticle(nextArticle)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-slate-200"
                      >
                        <span className="truncate max-w-[150px]">Next: {nextArticle.title}</span>
                        <ChevronRight className="w-4 h-4 text-emerald-700" />
                      </button>
                    ) : <div />}
                  </div>

                  <button
                    onClick={handleCloseArticle}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Back to News</span>
                  </button>
                </div>

                {/* AUTHOR INFO */}
                <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
                  Article authored by <strong className="text-slate-900 font-medium">{activeArticle.author || 'Gabolekwe Farms Editorial'}</strong>
                </div>

                {/* RELATED ARTICLES */}
                {relatedArticles.length > 0 && (
                  <div className="pt-12 mt-8 border-t-2 border-slate-200">
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-6">Related Stories</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {relatedArticles.map((rel) => (
                        <div
                          key={rel.id}
                          onClick={() => handleOpenArticle(rel)}
                          className="bg-[#FAFBF6] border border-slate-200 p-4 cursor-pointer hover:border-emerald-600 transition-all group"
                        >
                          <div className="aspect-[16/10] overflow-hidden mb-3 bg-slate-100">
                            <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-[9px] text-emerald-700 uppercase font-bold tracking-widest">{rel.date}</span>
                          <h4 className="text-sm font-serif font-bold text-slate-900 line-clamp-2 mt-1 group-hover:text-emerald-700">{rel.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
