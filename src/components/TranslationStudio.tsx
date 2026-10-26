import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_100_LANGUAGES } from '../data/languages';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  Sparkles,
  Search,
  RotateCcw,
} from 'lucide-react';

export const TranslationStudio: React.FC = () => {
  const { showToast } = useApp();

  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('uz');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Search filter for modals/dropdowns
  const [sourceSearch, setSourceSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);

  const sourceLangObj = SUPPORTED_100_LANGUAGES.find(l => l.code === sourceLang) || SUPPORTED_100_LANGUAGES[0];
  const targetLangObj = SUPPORTED_100_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_100_LANGUAGES[1];

  const handleTranslate = async (textToTranslate?: string) => {
    const text = textToTranslate || sourceText;
    if (!text.trim()) return;

    setIsTranslating(true);
    setTranslatedText('');

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Translate the following text accurately from ${sourceLangObj.name} to ${targetLangObj.name}. Maintain natural phrasing, tone, and cultural nuances. Output ONLY the translated text without conversational intro or quotes:\n\n${text}`,
            },
          ],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunkStr = decoder.decode(value);
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) {
                  accumulated += parsed.text;
                  setTranslatedText(accumulated);
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      showToast('Translation service unavailable. Please retry.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    showToast('Translation copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const playTTS = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = langCode;
      window.speechSynthesis.speak(u);
    }
  };

  const samplePhrases = [
    { title: 'Global Mission', text: 'Make the world’s knowledge, creativity, and education accessible through one intelligent platform.' },
    { title: 'Academic Inquiry', text: 'Empirical research demonstrates that neural architecture search optimizes inference efficiency.' },
    { title: 'Uzbek Hospitality', text: 'O‘zbekiston xalqi qadimiy mehmondo‘stlik va boy madaniy merosga ega.' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-2">
          <Languages className="w-3.5 h-3.5" />
          <span>Universal Polyglot Neural Engine · 100 Languages</span>
        </div>
        <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-bold text-white tracking-tight">
          Translation Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          High-accuracy contextual translation across 100 world languages with RTL layout support and native pronunciation.
        </p>
      </div>

      {/* Main Translation Cards */}
      <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        {/* Language Selection Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
          {/* Source Language Selector */}
          <div className="relative w-full sm:w-64">
            <button
              onClick={() => setIsSourceOpen(!isSourceOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/10 hover:border-cyan-400 text-xs font-semibold text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>{sourceLangObj.flag}</span>
                <span>{sourceLangObj.name}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{sourceLangObj.code.toUpperCase()}</span>
            </button>

            {isSourceOpen && (
              <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-hidden rounded-xl border border-white/20 bg-neutral-950 shadow-2xl p-2 z-50">
                <input
                  type="text"
                  placeholder="Search source language..."
                  value={sourceSearch}
                  onChange={e => setSourceSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white mb-2 focus:outline-none"
                  autoFocus
                />
                <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                  {SUPPORTED_100_LANGUAGES.filter(l =>
                    l.name.toLowerCase().includes(sourceSearch.toLowerCase())
                  ).map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSourceLang(lang.code);
                        setIsSourceOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 text-xs text-left text-slate-300 hover:bg-white/10"
                    >
                      <span>{lang.flag} {lang.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{lang.native}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <button
            onClick={swapLanguages}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 hover:scale-105 transition-all shadow-md"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Target Language Selector */}
          <div className="relative w-full sm:w-64">
            <button
              onClick={() => setIsTargetOpen(!isTargetOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/10 hover:border-cyan-400 text-xs font-semibold text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>{targetLangObj.flag}</span>
                <span>{targetLangObj.name}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{targetLangObj.code.toUpperCase()}</span>
            </button>

            {isTargetOpen && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-hidden rounded-xl border border-white/20 bg-neutral-950 shadow-2xl p-2 z-50">
                <input
                  type="text"
                  placeholder="Search target language..."
                  value={targetSearch}
                  onChange={e => setTargetSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white mb-2 focus:outline-none"
                  autoFocus
                />
                <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                  {SUPPORTED_100_LANGUAGES.filter(l =>
                    l.name.toLowerCase().includes(targetSearch.toLowerCase())
                  ).map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setTargetLang(lang.code);
                        setIsTargetOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 text-xs text-left text-slate-300 hover:bg-white/10"
                    >
                      <span>{lang.flag} {lang.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{lang.native}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Translation Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{sourceLangObj.name} Text</span>
              <button
                onClick={() => setSourceText('')}
                className="hover:text-rose-400 text-[11px] transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              placeholder={`Enter text in ${sourceLangObj.name}...`}
              rows={8}
              dir={sourceLangObj.rtl ? 'rtl' : 'ltr'}
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => playTTS(sourceText, sourceLangObj.code)}
                disabled={!sourceText}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-30"
                title="Speak text"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleTranslate()}
                disabled={isTranslating || !sourceText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-cyan-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
              </button>
            </div>
          </div>

          {/* Translated Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{targetLangObj.name} Translation</span>
              <button
                onClick={copyToClipboard}
                disabled={!translatedText}
                className="hover:text-cyan-400 text-[11px] flex items-center gap-1 transition-colors disabled:opacity-30"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>

            <div
              dir={targetLangObj.rtl ? 'rtl' : 'ltr'}
              className="w-full min-h-[200px] bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-cyan-50 leading-relaxed overflow-y-auto font-medium"
            >
              {translatedText ? (
                translatedText
              ) : (
                <span className="text-slate-600 italic">Translation output will appear here...</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => playTTS(translatedText, targetLangObj.code)}
                disabled={!translatedText}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-30"
                title="Speak translation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-500 font-mono">
                Preserves context & semantics
              </span>
            </div>
          </div>
        </div>

        {/* Quick Sample Queries */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Quick Test Phrases</div>
          <div className="flex flex-wrap gap-2">
            {samplePhrases.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSourceText(sp.text);
                  handleTranslate(sp.text);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 transition-colors"
              >
                {sp.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
