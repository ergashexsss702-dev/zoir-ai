import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AccentColor, ThemeMode } from '../types';
import {
  Sliders,
  Image as ImageIcon,
  Sun,
  Moon,
  RotateCcw,
  UploadCloud,
  Check,
  ShieldAlert,
  Download,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, resetPreferences, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accentColors: Array<{ id: AccentColor; label: string; color: string }> = [
    { id: 'cyan', label: 'Electric Cyan', color: 'bg-cyan-500' },
    { id: 'violet', label: 'Cosmic Violet', color: 'bg-violet-500' },
    { id: 'emerald', label: 'Aurora Emerald', color: 'bg-emerald-500' },
    { id: 'amber', label: 'Solar Amber', color: 'bg-amber-500' },
    { id: 'rose', label: 'Nebula Rose', color: 'bg-rose-500' },
  ];

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Custom wallpaper must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updatePreferences({ customBgUrl: reader.result as string });
      showToast('Custom wallpaper applied and saved!');
    };
    reader.readAsDataURL(file);
  };

  const handleExportData = () => {
    const fullBackup = {
      preferences,
      exportDate: new Date().toISOString(),
      app: 'ZOIR AI Platform',
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zoir-ai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Exported personal profile and configuration.');
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all local chat history and reset preferences?')) {
      localStorage.clear();
      resetPreferences();
      showToast('All local session data has been erased.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Visual Ergonomics & Account Controls</span>
          </div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Personalization & Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize background aesthetics, ambient blur, lighting themes, IELTS goals, and data privacy.
          </p>
        </div>

        <button
          onClick={resetPreferences}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors w-fit"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: Wallpaper & Ambient Background */}
        <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6 shadow-xl">
          <h2 className="font-['Outfit'] text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Custom Wallpaper & Ambient Canvas</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Upload Area & Preview */}
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCustomBgUpload}
                accept="image/*"
                className="hidden"
              />

              {preferences.customBgUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 aspect-video shadow-md">
                  <img
                    src={preferences.customBgUrl}
                    alt="Custom Wallpaper Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                    >
                      Change Wallpaper
                    </button>
                  </div>
                  <button
                    onClick={() => updatePreferences({ customBgUrl: null })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:text-rose-300 text-xs"
                    title="Remove custom wallpaper"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors bg-white/[0.02]"
                >
                  <UploadCloud className="w-8 h-8 text-cyan-400" />
                  <div className="text-xs font-semibold text-white">Upload Custom Background</div>
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, WebP up to 10MB</p>
                </div>
              )}
            </div>

            {/* Sliders: Blur, Opacity, Contrast */}
            <div className="space-y-5">
              {/* Blur Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Background Blur</span>
                  <span className="font-mono text-cyan-400">{preferences.bgBlur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={preferences.bgBlur}
                  onChange={e => updatePreferences({ bgBlur: Number(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Surface Overlay Opacity</span>
                  <span className="font-mono text-cyan-400">{preferences.bgOpacity}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={preferences.bgOpacity}
                  onChange={e => updatePreferences({ bgOpacity: Number(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Contrast Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Contrast Compensation</span>
                  <span className="font-mono text-cyan-400">{preferences.bgContrast}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={140}
                  value={preferences.bgContrast}
                  onChange={e => updatePreferences({ bgContrast: Number(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Color Palette & Lighting Theme */}
        <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6 shadow-xl">
          <h2 className="font-['Outfit'] text-base font-bold text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-cyan-400" />
            <span>Theme & Accent Palette</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Mode */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Display Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'Deep Space', icon: Moon },
                  { id: 'amoled', label: 'Pure AMOLED', icon: Moon },
                  { id: 'light', label: 'Daylight Paper', icon: Sun },
                ].map(t => {
                  const Icon = t.icon;
                  const isActive = preferences.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => updatePreferences({ theme: t.id as ThemeMode })}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Accent Highlight Color
              </label>
              <div className="flex items-center gap-3">
                {accentColors.map(ac => (
                  <button
                    key={ac.id}
                    onClick={() => updatePreferences({ accentColor: ac.id })}
                    className={`w-9 h-9 rounded-xl ${ac.color} flex items-center justify-center transition-all ${
                      preferences.accentColor === ac.id ? 'ring-4 ring-white/30 scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={ac.label}
                  >
                    {preferences.accentColor === ac.id && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Learning Goals & Pedagogical Preferences */}
        <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6 shadow-xl">
          <h2 className="font-['Outfit'] text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Learning Goals & Language Adaptations</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Target IELTS Band Score</span>
                <span className="font-mono text-cyan-400 font-bold">
                  Band {preferences.targetIeltsBand.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={6.0}
                max={9.0}
                step={0.5}
                value={preferences.targetIeltsBand}
                onChange={e => updatePreferences({ targetIeltsBand: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <p className="text-[11px] text-slate-500">
                Calibrates the grading strictness and academic vocabulary recommendations in the Academy.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">
                Dual English-Uzbek Explanations
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.explainInUzbek}
                  onChange={e => updatePreferences({ explainInUzbek: e.target.checked })}
                  className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-black"
                />
                <span>Include Uzbek explanations & translations for complex grammar concepts</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 4: Data Management & Privacy */}
        <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-4 shadow-xl">
          <h2 className="font-['Outfit'] text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Data Privacy & Export</span>
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed">
            Your conversations, saved books, and study progress are stored in your private local browser storage. You can export a full JSON backup or erase all data at any time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Personal Data JSON</span>
            </button>

            <button
              onClick={handleClearAllData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Erase Local Session Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
