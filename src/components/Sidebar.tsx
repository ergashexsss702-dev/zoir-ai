import React from 'react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { UI_TRANSLATIONS } from '../data/languages';
import {
  LayoutDashboard,
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
  ShieldCheck,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, preferences } = useApp();
  const t = UI_TRANSLATIONS[preferences.language] || UI_TRANSLATIONS.en;

  const navigationGroups: Array<{
    title: string;
    items: Array<{ id: NavTab; label: string; icon: React.FC<{ className?: string }> }>;
  }> = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: t.dashboard || 'Dashboard', icon: LayoutDashboard },
        { id: 'chat', label: t.aiChat || 'AI Chat', icon: MessageSquare },
        { id: 'image-studio', label: t.createImage || 'Create Image', icon: ImageIcon },
        { id: 'video-studio', label: t.createVideo || 'Create Video', icon: Video },
      ],
    },
    {
      title: 'KNOWLEDGE & READING',
      items: [
        { id: 'library', label: t.library || 'Global Library', icon: BookMarked },
        { id: 'only-reading', label: t.onlyReading || 'ONLY Reading', icon: BookOpen },
      ],
    },
    {
      title: 'ACADEMY & IELTS',
      items: [
        { id: 'english-academy', label: t.startLearningEnglish || 'Start Learning English', icon: GraduationCap },
        { id: 'ielts-prep', label: t.ieltsPrep || 'IELTS Band 9.0', icon: Award },
        { id: 'translation', label: t.translation || '100 Languages', icon: Languages },
      ],
    },
    {
      title: 'SYSTEM & CONTROLS',
      items: [
        { id: 'integrations', label: t.integrations || 'AI Providers', icon: Cpu },
        { id: 'settings', label: t.settings || 'Personalization', icon: Sliders },
        { id: 'admin', label: t.admin || 'Admin Console', icon: ShieldCheck },
      ],
    },
  ];

  const handleSelect = (id: NavTab) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-neutral-950/90 backdrop-blur-2xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="p-4 space-y-6">
          {/* User Profile Mini Bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <img
              src="/src/assets/images/academy_scholar_avatar_1792987992933.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-white truncate">Global Scholar</h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3 h-3" />
                  {preferences.studyStreakDays}d streak
                </span>
                <span>·</span>
                <span className="text-cyan-400">Band {preferences.targetIeltsBand.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Navigation Groups */}
          {navigationGroups.map(group => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
                {group.title}
              </div>
              <div className="space-y-0.5 pt-1">
                {group.items.map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom System Banner */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Gemini 3.8 Flash</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.5 PROD</span>
          </div>
        </div>
      </aside>
    </>
  );
};
