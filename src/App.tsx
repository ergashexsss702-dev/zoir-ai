import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { AIChat } from './components/AIChat';
import { ImageStudio } from './components/ImageStudio';
import { VideoStudio } from './components/VideoStudio';
import { GlobalLibrary } from './components/GlobalLibrary';
import { OnlyReadingMode } from './components/OnlyReadingMode';
import { EnglishAcademy } from './components/EnglishAcademy';
import { IELTSPreparation } from './components/IELTSPreparation';
import { TranslationStudio } from './components/TranslationStudio';
import { IntegrationsHub } from './components/IntegrationsHub';
import { SettingsView } from './components/SettingsView';
import { AdminConsole } from './components/AdminConsole';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, preferences, toastMessage } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If in ONLY Reading mode, take over entire screen for distraction-free immersion
  if (activeTab === 'only-reading') {
    return (
      <div className="relative min-h-screen">
        <OnlyReadingMode />
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-white text-xs shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic User Custom Wallpaper or Atmospheric Space Gradient */}
      {preferences.customBgUrl ? (
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-all duration-300"
          style={{
            backgroundImage: `url(${preferences.customBgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${preferences.bgBlur}px) contrast(${preferences.bgContrast}%)`,
            opacity: preferences.bgOpacity / 100,
          }}
        />
      ) : (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        isMobileOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Body: Sidebar + Main Content Viewport */}
      <div className="relative z-10 flex-1 flex">
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'chat' && <AIChat />}
          {activeTab === 'image-studio' && <ImageStudio />}
          {activeTab === 'video-studio' && <VideoStudio />}
          {activeTab === 'library' && <GlobalLibrary />}
          {activeTab === 'english-academy' && <EnglishAcademy />}
          {activeTab === 'ielts-prep' && <IELTSPreparation />}
          {activeTab === 'translation' && <TranslationStudio />}
          {activeTab === 'integrations' && <IntegrationsHub />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'admin' && <AdminConsole />}
        </main>
      </div>

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-white text-xs shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
