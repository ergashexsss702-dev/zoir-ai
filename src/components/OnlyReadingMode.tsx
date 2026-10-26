import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BookItem } from '../types';
import { CURATED_BOOKS } from '../data/curatedBooks';
import {
  Maximize,
  Minimize,
  Sliders,
  Type,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Search,
  List,
  X,
  ArrowLeft,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';

export const OnlyReadingMode: React.FC = () => {
  const { activeBook, setActiveTab, savedBooks, toggleBookmarkBook, updateReadingProgress, showToast } = useApp();

  const currentBook: BookItem = activeBook || CURATED_BOOKS[0];
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);

  // Typography & Theme settings
  const [readingTheme, setReadingTheme] = useState<'sepia' | 'amoled' | 'cyber' | 'light'>('amoled');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [fontSize, setFontSize] = useState(19); // in px
  const [lineHeight, setLineHeight] = useState(1.8);
  const [marginWidth, setMarginWidth] = useState<'narrow' | 'medium' | 'wide'>('medium');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchInText, setSearchInText] = useState('');

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const chapters = currentBook.chapters || [
    { title: 'Full Text', text: currentBook.fullContent || currentBook.description },
  ];
  const currentChapter = chapters[currentChapterIdx] || chapters[0];

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Text to speech
  const toggleAudioNarration = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      showToast('Narration paused.');
    } else {
      if (!('speechSynthesis' in window)) {
        showToast('Text-to-speech is not supported on this browser.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentChapter.text.slice(0, 3000));
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast('Reading aloud with voice narration.');
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Update reading progress
  useEffect(() => {
    const progress = Math.round(((currentChapterIdx + 1) / chapters.length) * 100);
    updateReadingProgress(currentBook.id, progress);
  }, [currentChapterIdx, chapters.length, currentBook.id]);

  // Theme styling definitions
  const themeClasses = {
    sepia: 'bg-[#fbf0d9] text-[#2c2214]',
    amoled: 'bg-[#000000] text-[#e2e8f0]',
    cyber: 'bg-[#090d16] text-[#cbd5e1]',
    light: 'bg-[#ffffff] text-[#0f172a]',
  }[readingTheme];

  const fontClasses = {
    serif: "font-['Lora',Georgia,serif]",
    sans: "font-['Plus_Jakarta_Sans',system-ui,sans-serif]",
    mono: "font-['JetBrains_Mono',monospace]",
  }[fontFamily];

  const maxWidthClasses = {
    narrow: 'max-w-xl',
    medium: 'max-w-3xl',
    wide: 'max-w-4xl',
  }[marginWidth];

  const isSaved = savedBooks.some(b => b.id === currentBook.id);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-colors duration-300 flex flex-col justify-between ${themeClasses}`}
    >
      {/* Top Distraction-Free Header Bar */}
      <header
        className={`sticky top-0 z-40 w-full px-6 py-3.5 flex items-center justify-between border-b transition-colors ${
          readingTheme === 'sepia'
            ? 'border-[#e4d4b2] bg-[#fbf0d9]/90'
            : readingTheme === 'light'
            ? 'border-slate-200 bg-white/90'
            : 'border-white/10 bg-black/90'
        } backdrop-blur-md`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('library')}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Return to Library"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-sm font-semibold truncate max-w-xs md:max-w-md">{currentBook.title}</h1>
            <p className="text-[11px] opacity-70 truncate">{currentBook.author} · {currentChapter.title}</p>
          </div>
        </div>

        {/* Reader Tools */}
        <div className="flex items-center gap-2">
          {/* Chapter Drawer Toggle */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs flex items-center gap-1.5"
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Chapters</span>
          </button>

          {/* Audio TTS Narration */}
          <button
            onClick={toggleAudioNarration}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs ${
              isSpeaking ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold' : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            title="Listen Aloud"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-cyan-400" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Pause' : 'Listen'}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmarkBook(currentBook)}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title={isSaved ? 'Bookmarked' : 'Add Bookmark'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-cyan-500" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Typography Settings */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Typography & Theme Settings"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Full Screen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Settings Modal Drawer */}
      {isSettingsOpen && (
        <div
          className={`absolute right-6 top-16 z-50 w-80 p-5 rounded-2xl shadow-2xl border ${
            readingTheme === 'sepia'
              ? 'bg-[#f4e5c3] border-[#dec59b] text-[#2c2214]'
              : readingTheme === 'light'
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-neutral-900 border-white/15 text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">Reader Typography</h3>
            <button onClick={() => setIsSettingsOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pt-4 text-xs">
            {/* Reading Themes */}
            <div className="space-y-1.5">
              <label className="font-semibold">Reading Surface</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'sepia', label: 'Sepia', bg: 'bg-[#fbf0d9] text-[#2c2214]' },
                  { id: 'amoled', label: 'AMOLED', bg: 'bg-black text-white' },
                  { id: 'cyber', label: 'Cyber', bg: 'bg-[#090d16] text-[#38bdf8]' },
                  { id: 'light', label: 'Paper', bg: 'bg-white text-slate-900' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setReadingTheme(t.id as typeof readingTheme)}
                    className={`py-2 text-[11px] font-semibold rounded-lg border text-center transition-all ${
                      readingTheme === t.id ? 'ring-2 ring-cyan-500 font-bold' : 'opacity-80'
                    } ${t.bg}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="font-semibold">Typeface</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'serif', label: 'Serif (Lora)' },
                  { id: 'sans', label: 'Sans (Jakarta)' },
                  { id: 'mono', label: 'Mono (Code)' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id as typeof fontFamily)}
                    className={`py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                      fontFamily === f.id ? 'border-cyan-500 bg-cyan-500/20 font-bold' : 'border-black/10 dark:border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Font Size</span>
                <span className="font-mono">{fontSize}px</span>
              </div>
              <input
                type="range"
                min={15}
                max={28}
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Line Height Slider */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Line Spacing</span>
                <span className="font-mono">{lineHeight.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1.4}
                max={2.4}
                step={0.1}
                value={lineHeight}
                onChange={e => setLineHeight(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Margin Width */}
            <div className="space-y-1.5">
              <label className="font-semibold">Margin Width</label>
              <div className="grid grid-cols-3 gap-2">
                {['narrow', 'medium', 'wide'].map(w => (
                  <button
                    key={w}
                    onClick={() => setMarginWidth(w as typeof marginWidth)}
                    className={`py-1 rounded-lg border text-[11px] capitalize transition-all ${
                      marginWidth === w ? 'border-cyan-500 bg-cyan-500/20 font-bold' : 'border-black/10 dark:border-white/10'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters Navigation Drawer */}
      {isDrawerOpen && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 p-6 shadow-2xl border-r transition-transform overflow-y-auto ${
            readingTheme === 'sepia'
              ? 'bg-[#f4e5c3] border-[#dec59b] text-[#2c2214]'
              : readingTheme === 'light'
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-neutral-900 border-white/15 text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
            <h3 className="font-['Outfit'] font-bold text-sm">Table of Contents</h3>
            <button onClick={() => setIsDrawerOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-1">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentChapterIdx(idx);
                  setIsDrawerOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs transition-colors flex items-center justify-between ${
                  currentChapterIdx === idx
                    ? 'bg-cyan-500/20 font-bold text-cyan-600 dark:text-cyan-300'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                }`}
              >
                <span>{ch.title}</span>
                {currentChapterIdx === idx && <span className="text-[10px] font-mono">Current</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reading Canvas */}
      <main className="flex-1 px-6 py-12 md:py-16 overflow-y-auto">
        <div className={`mx-auto ${maxWidthClasses} space-y-8`}>
          {/* Chapter Title */}
          <div className="text-center space-y-2 pb-6 border-b border-black/10 dark:border-white/10">
            <div className="text-xs uppercase tracking-widest font-mono opacity-60">
              Chapter {currentChapterIdx + 1} of {chapters.length}
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">{currentChapter.title}</h2>
          </div>

          {/* Reading Paragraphs */}
          <div
            className={`${fontClasses} leading-relaxed transition-all whitespace-pre-line`}
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          >
            {currentChapter.text}
          </div>
        </div>
      </main>

      {/* Bottom Floating Navigation Toolbar */}
      <footer
        className={`sticky bottom-0 z-30 px-6 py-3 border-t flex items-center justify-between text-xs transition-colors ${
          readingTheme === 'sepia'
            ? 'border-[#e4d4b2] bg-[#fbf0d9]/95 text-[#2c2214]'
            : readingTheme === 'light'
            ? 'border-slate-200 bg-white/95 text-slate-800'
            : 'border-white/10 bg-black/95 text-slate-300'
        } backdrop-blur-md`}
      >
        <button
          onClick={() => setCurrentChapterIdx(prev => Math.max(0, prev - 1))}
          disabled={currentChapterIdx === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Chapter</span>
        </button>

        <div className="font-mono text-[11px] opacity-75">
          Progress: {Math.round(((currentChapterIdx + 1) / chapters.length) * 100)}%
        </div>

        <button
          onClick={() => setCurrentChapterIdx(prev => Math.min(chapters.length - 1, prev + 1))}
          disabled={currentChapterIdx === chapters.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </footer>
    </div>
  );
};
