import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookItem } from '../types';
import { CURATED_BOOKS } from '../data/curatedBooks';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Globe,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Sparkles,
  BookMarked,
  Clock,
} from 'lucide-react';

export const GlobalLibrary: React.FC = () => {
  const { openBookInReader, savedBooks, toggleBookmarkBook, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchResults, setSearchResults] = useState<BookItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'curated' | 'search' | 'saved'>('curated');

  const categories = [
    'All',
    'Philosophy & Stoicism',
    'Strategy & Leadership',
    'Timeless Literature & Wisdom',
    'Uzbek Classic Heritage',
    'Detective & Deduction',
    'Science & Technology',
  ];

  const handleLiveSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setActiveTab('search');

    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}&limit=16`);
      const data = await res.json();
      if (data.books && Array.isArray(data.books)) {
        const mappedBooks: BookItem[] = data.books.map((b: { key: string; title: string; author: string; firstPublishYear: string | number; coverUrl: string | null; subject: string[] }) => ({
          id: b.key,
          title: b.title,
          author: b.author,
          year: b.firstPublishYear,
          category: b.subject?.[0] || 'General Literature',
          coverUrl: b.coverUrl,
          description: `Catalogued record from Open Library under subject ${b.subject?.slice(0, 3).join(', ') || 'Literature'}.`,
          isCuratedFullText: false,
        }));
        setSearchResults(mappedBooks);
      }
    } catch {
      showToast('Live catalogue search temporarily unavailable. Displaying local archives.');
    } finally {
      setIsSearching(false);
    }
  };

  const displayedCurated = CURATED_BOOKS.filter(b => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Hero Banner with Curated Sanctuary Image */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 lg:p-12 shadow-2xl">
        <img
          src="/src/assets/images/library_timeless_reading_1792987993304.jpg"
          alt="World Sanctuary Library"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Open Library & Authorized Classics Hub</span>
          </div>

          <h1 className="font-['Outfit'] text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            The Global Knowledge Library
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Search millions of authorized book records or immerse yourself directly in full-text classics with our distraction-free <strong>ONLY Reading</strong> mode.
          </p>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/20 focus-within:border-cyan-400 rounded-2xl p-2 max-w-xl backdrop-blur-xl">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 2) {
                  handleLiveSearch(e.target.value);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleLiveSearch(searchQuery);
              }}
              placeholder="Search by title, author, topic (e.g. Marcus Aurelius, Navoiy, Physics)..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-2"
            />
            <button
              onClick={() => handleLiveSearch(searchQuery)}
              className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('curated')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'curated' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Curated Classics ({CURATED_BOOKS.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'saved' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Books ({savedBooks.length})
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'search' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Search ({searchResults.length})
            </button>
          )}
        </div>

        {activeTab === 'curated' && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(activeTab === 'curated'
          ? displayedCurated
          : activeTab === 'saved'
          ? savedBooks
          : searchResults
        ).map(book => {
          const isSaved = savedBooks.some(b => b.id === book.id);
          return (
            <div
              key={book.id}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-xl hover:border-cyan-500/40 transition-all shadow-lg"
            >
              <div className="space-y-4">
                {/* Book Cover / Header */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-neutral-900 to-black">
                      <BookOpen className="w-10 h-10 text-cyan-400/40 mb-2" />
                      <div className="font-['Outfit'] font-bold text-sm text-slate-300">{book.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{book.author}</div>
                    </div>
                  )}

                  <button
                    onClick={() => toggleBookmarkBook(book)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-cyan-400 transition-colors border border-white/10"
                    title={isSaved ? 'Remove Bookmark' : 'Save Book'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {book.isCuratedFullText && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-cyan-600/90 text-white text-[10px] font-semibold tracking-wider font-mono uppercase">
                      Full Text Available
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="font-['Outfit'] text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{book.author} · {book.year}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-white/5">
                {book.isCuratedFullText ? (
                  <button
                    onClick={() => openBookInReader(book)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-cyan-500/20"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in ONLY Reading</span>
                  </button>
                ) : (
                  <a
                    href={`https://openlibrary.org${book.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                  >
                    <span>View Record on Open Library</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
