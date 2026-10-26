import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_100_LANGUAGES, UI_TRANSLATIONS } from '../data/languages';
import { Sliders, Globe, Menu, X, Sparkles, BookOpen } from 'lucide-react';
import { NavTab } from '../types';

export const Header: React.FC<{ onToggleMobileMenu: () => void; isMobileOpen: boolean }> = ({
  onToggleMobileMenu,
  isMobileOpen,
}) => {
  const { activeTab, setActiveTab, preferences, updatePreferences } = useApp();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langFilter, setLangFilter] = useState('');

  const currentLang = SUPPORTED_100_LANGUAGES.find(l => l.code === preferences.language) || SUPPORTED_100_LANGUAGES[0];
  const t = UI_TRANSLATIONS[preferences.language] || UI_TRANSLATIONS.en;

  const filteredLanguages = SUPPORTED_100_LANGUAGES.filter(
    l => l.name.toLowerCase().includes(langFilter.toLowerCase()) || l.native.toLowerCase().includes(langFilter.toLowerCase())
  );

  const navItems: Array<{ id: NavTab; label: string }> = [
    { id: 'chat', label: 'AI Chat' },
    { id: 'library', label: 'Library' },
    { id: 'only-reading', label: 'ONLY Reading' },
    { id: 'english-academy', label: 'English Academy' },
    { id: 'image-studio', label: 'Studio' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl px-4 lg:px-8 py-3 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark, no compound badges) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="group flex items-center gap-2.5 text-left focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black/90 rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-['Outfit'] text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group-hover:text-cyan-300 transition-colors">
              ZOIR AI
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
              title="Select Language (100 languages supported)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="max-w-[80px] truncate">{currentLang.flag} {currentLang.name}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-hidden rounded-xl border border-white/15 bg-neutral-900/95 backdrop-blur-2xl shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-white/10">
                  <input
                    type="text"
                    value={langFilter}
                    onChange={e => setLangFilter(e.target.value)}
                    placeholder="Search 100 languages..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-white/5 py-1">
                  {filteredLanguages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        updatePreferences({ language: lang.code, isRtl: Boolean(lang.rtl) });
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        preferences.language === lang.code
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">{lang.native}</span>
                    </button>
                  ))}
                  {filteredLanguages.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">No language found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>
      </div>
    </header>
  );
};
