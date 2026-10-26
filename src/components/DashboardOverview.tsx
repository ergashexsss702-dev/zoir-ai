import React from 'react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { UI_TRANSLATIONS } from '../data/languages';
import {
  MessageSquare,
  Image as ImageIcon,
  Video,
  BookMarked,
  BookOpen,
  GraduationCap,
  Award,
  Languages,
  Cpu,
  Sliders,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { setActiveTab, preferences, chatSessions, savedBooks, generatedImages } = useApp();
  const t = UI_TRANSLATIONS[preferences.language] || UI_TRANSLATIONS.en;

  const coreModules: Array<{
    id: NavTab;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    tag: string;
    gradient: string;
  }> = [
    {
      id: 'chat',
      title: t.aiChat || 'AI Chat',
      description: 'Conversational assistant with streaming, Google Search grounding citations, and multimodal input.',
      icon: MessageSquare,
      tag: 'Gemini 3.8 Flash',
      gradient: 'from-cyan-500/20 to-blue-600/10',
    },
    {
      id: 'image-studio',
      title: t.createImage || 'Create Image',
      description: 'Studio-grade visual synthesis with prompt enhancer, reference editing, and 12K target upscaling.',
      icon: ImageIcon,
      tag: 'Neural Studio',
      gradient: 'from-fuchsia-500/20 to-indigo-600/10',
    },
    {
      id: 'video-studio',
      title: t.createVideo || 'Create Video',
      description: 'Cinematic video clips with camera movement choreography, duration controls, and motion simulator.',
      icon: Video,
      tag: 'Camera Control',
      gradient: 'from-sky-500/20 to-indigo-600/10',
    },
    {
      id: 'library',
      title: t.library || 'Global Library',
      description: 'Search millions of books across Open Library and read authorized classic literature in full text.',
      icon: BookMarked,
      tag: 'Timeless Archive',
      gradient: 'from-amber-500/20 to-orange-600/10',
    },
    {
      id: 'only-reading',
      title: t.onlyReading || 'ONLY Reading',
      description: 'Distraction-free sanctuary with sepia, AMOLED black, custom serif fonts, and audio narration.',
      icon: BookOpen,
      tag: 'Focus Mode',
      gradient: 'from-emerald-500/20 to-teal-600/10',
    },
    {
      id: 'english-academy',
      title: t.startLearningEnglish || 'Start Learning English',
      description: 'CEFR diagnostic assessment, structured lessons from Pre-A1 to C2, and dual English-Uzbek explanations.',
      icon: GraduationCap,
      tag: 'Pre-A1 to C2',
      gradient: 'from-violet-500/20 to-purple-600/10',
    },
    {
      id: 'ielts-prep',
      title: t.ieltsPrep || 'IELTS Band 9.0',
      description: 'Comprehensive 4-skills preparation: Speaking 1-min cue card timer, Academic Reading, and Writing AI grading.',
      icon: Award,
      tag: 'Band 9.0 Goal',
      gradient: 'from-yellow-500/20 to-amber-600/10',
    },
    {
      id: 'translation',
      title: t.translation || '100 Languages',
      description: 'Universal polyglot translation with auto-detection, RTL layouts (Arabic, Urdu, Hebrew), and speech.',
      icon: Languages,
      tag: '100 Languages',
      gradient: 'from-blue-500/20 to-cyan-600/10',
    },
    {
      id: 'integrations',
      title: t.integrations || 'AI Providers',
      description: 'Modular integrations for Gemini, Google Cloud, OpenAI gpt-4o adapter, Gamma, and Google Flow.',
      icon: Cpu,
      tag: 'Multi-Model',
      gradient: 'from-rose-500/20 to-pink-600/10',
    },
    {
      id: 'settings',
      title: t.settings || 'Personalization',
      description: 'Upload your custom background, adjust blur and opacity, and select accent color palettes.',
      icon: Sliders,
      tag: 'Customizable',
      gradient: 'from-slate-500/20 to-zinc-600/10',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Hero Cockpit Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 lg:p-12 shadow-2xl">
        <img
          src="/src/assets/images/hero_space_cosmos_1792987991833.jpg"
          alt="Space Cosmos Horizon"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ZOIR AI Enterprise Intelligence</span>
          </div>

          <h1 className="font-['Outfit'] text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            One Platform. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
              Endless Possibilities.
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            Welcome to ZOIR AI—bringing together artificial intelligence, global literature, an English academy targeting IELTS Band 9.0, creative image and video studios, and instant translation across 100 languages.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start AI Conversation</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Explore Library</span>
            </button>

            <button
              onClick={() => setActiveTab('ielts-prep')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>IELTS Band 9 Prep</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Core Features Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-['Outfit'] text-xl font-bold text-white tracking-tight">
            Featured Modules
          </h2>
          <span className="text-xs text-slate-500 font-mono">10 Modules Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreModules.map(module => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`group p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 bg-gradient-to-br ${module.gradient} bg-neutral-900/60 backdrop-blur-xl flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-lg`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      {module.tag}
                    </span>
                  </div>

                  <h3 className="font-['Outfit'] text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {module.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
                  <span>Open Module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Recent Conversations */}
        <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Recent Chats</h3>
            <button
              onClick={() => setActiveTab('chat')}
              className="text-xs text-cyan-400 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {chatSessions.slice(0, 3).map(s => (
              <div
                key={s.id}
                onClick={() => setActiveTab('chat')}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 cursor-pointer text-xs transition-colors flex items-center justify-between"
              >
                <span className="truncate text-slate-200">{s.title}</span>
                <Clock className="w-3 h-3 text-slate-500 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Saved Books */}
        <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Personal Bookshelf</h3>
            <button
              onClick={() => setActiveTab('library')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Explore
            </button>
          </div>
          <div className="space-y-2">
            {savedBooks.slice(0, 3).map(b => (
              <div
                key={b.id}
                onClick={() => setActiveTab('only-reading')}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 cursor-pointer text-xs transition-colors flex items-center justify-between"
              >
                <span className="truncate text-slate-200">{b.title}</span>
                <span className="text-[10px] text-cyan-400 font-mono">Read</span>
              </div>
            ))}
          </div>
        </div>

        {/* English Progress */}
        <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Study Streak & Goal</h3>
            <button
              onClick={() => setActiveTab('english-academy')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Academy
            </button>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Flame className="w-6 h-6 text-amber-400" />
              <div>
                <div className="text-sm font-bold text-white font-mono">{preferences.studyStreakDays} Days Active</div>
                <div className="text-[11px] text-slate-400">Target: IELTS Band {preferences.targetIeltsBand.toFixed(1)}</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('ielts-prep')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors"
            >
              Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
