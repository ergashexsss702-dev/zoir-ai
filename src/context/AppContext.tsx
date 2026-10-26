import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavTab,
  UserPreferences,
  ChatSession,
  ChatMessage,
  BookItem,
  GeneratedImageItem,
  VideoProject,
  Flashcard,
} from '../types';
import { CURATED_BOOKS } from '../data/curatedBooks';
import { FLASHCARD_VOCAB_BANK } from '../data/englishCurriculum';
import { SUPPORTED_100_LANGUAGES } from '../data/languages';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  // Chat state
  chatSessions: ChatSession[];
  currentSessionId: string;
  currentSession: ChatSession | undefined;
  createNewChat: () => string;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, newTitle: string) => void;
  addMessageToCurrent: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateLastMessage: (updater: (prev: ChatMessage) => ChatMessage) => void;
  // Reading state
  activeBook: BookItem | null;
  openBookInReader: (book: BookItem) => void;
  savedBooks: BookItem[];
  toggleBookmarkBook: (book: BookItem) => void;
  updateReadingProgress: (bookId: string, progress: number) => void;
  // English Academy state
  diagnosticScore: number | null;
  setDiagnosticScore: (score: number) => void;
  flashcards: Flashcard[];
  toggleFlashcardMastered: (id: string) => void;
  // Studio state
  generatedImages: GeneratedImageItem[];
  addGeneratedImage: (img: GeneratedImageItem) => void;
  videoProjects: VideoProject[];
  addVideoProject: (vp: VideoProject) => void;
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  accentColor: 'cyan',
  language: 'en',
  isRtl: false,
  customBgUrl: null,
  bgBlur: 6,
  bgOpacity: 85,
  bgContrast: 100,
  fontSize: 'normal',
  ttsVoice: 'Kore',
  studyStreakDays: 14,
  targetIeltsBand: 9.0,
  explainInUzbek: true,
};

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-msg-1',
  role: 'assistant',
  content: `### Welcome to **ZOIR AI**

I am your next-generation intelligent companion for:
- 💡 **Deep Thinking & Code Reasoning**: Step-by-step problem solving, math, and software architecture.
- 📚 **Global Library & ONLY Reading**: Timeless classics, Open Library discovery, and distraction-free focus.
- 🎓 **English Academy**: From foundational Pre-A1 to IELTS Band 9.0 with dual English & Uzbek explanations.
- 🎨 **Creative Studio**: High-fidelity image and video synthesis.
- 🌐 **Global Translation**: Instant localization across 100 world languages.

How can I assist you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const INITIAL_SESSION: ChatSession = {
  id: 'session-default',
  title: 'Welcome to ZOIR AI',
  messages: [INITIAL_MESSAGE],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Load preferences from localStorage or default
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('zoir_preferences');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Chat Sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('zoir_chats');
      return saved ? JSON.parse(saved) : [INITIAL_SESSION];
    } catch {
      return [INITIAL_SESSION];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    chatSessions[0]?.id || 'session-default'
  );

  // Reading state
  const [activeBook, setActiveBook] = useState<BookItem | null>(CURATED_BOOKS[0]);
  const [savedBooks, setSavedBooks] = useState<BookItem[]>(() => {
    try {
      const saved = localStorage.getItem('zoir_saved_books');
      return saved ? JSON.parse(saved) : CURATED_BOOKS;
    } catch {
      return CURATED_BOOKS;
    }
  });

  // English Academy
  const [diagnosticScore, setDiagnosticScoreState] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('zoir_diagnostic_score');
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem('zoir_flashcards');
      return saved ? JSON.parse(saved) : FLASHCARD_VOCAB_BANK;
    } catch {
      return FLASHCARD_VOCAB_BANK;
    }
  });

  // Studio items
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageItem[]>(() => {
    try {
      const saved = localStorage.getItem('zoir_generated_images');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'sample-img-1',
        prompt: 'Futuristic AI creative studio hologram workstation in modern architectural space',
        aspectRatio: '4:3',
        style: 'Cinematic Hyperreal',
        imageUrl: '/src/assets/images/studio_creative_visual_1792987992191.jpg',
        timestamp: 'Today, 14:20',
      },
      {
        id: 'sample-img-2',
        prompt: 'Deep space cosmic nebula with celestial starlight and ethereal indigo aura',
        aspectRatio: '16:9',
        style: 'Space Sci-Fi',
        imageUrl: '/src/assets/images/hero_space_cosmos_1792987991833.jpg',
        timestamp: 'Yesterday, 19:45',
      },
    ];
  });

  const [videoProjects, setVideoProjects] = useState<VideoProject[]>([
    {
      id: 'vp-1',
      prompt: 'Cinematic drone fly-through over an emerald mountain sanctuary at sunrise',
      cameraMovement: 'Drone Fly-through',
      style: 'Cinematic Hyperreal',
      duration: 5,
      aspectRatio: '16:9',
      status: 'ready',
      createdAt: 'Today, 11:30',
    },
    {
      id: 'vp-2',
      prompt: 'Cyberpunk neon rain reflections on wet glass in Tokyo alleyway with slow orbit camera',
      cameraMovement: 'Orbit 360',
      style: 'Cyber Noir',
      duration: 10,
      aspectRatio: '9:16',
      status: 'ready',
      createdAt: '2 days ago',
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync preferences with storage & HTML lang/dir
  useEffect(() => {
    localStorage.setItem('zoir_preferences', JSON.stringify(preferences));

    // Handle RTL check based on selected language
    const langObj = SUPPORTED_100_LANGUAGES.find(l => l.code === preferences.language);
    const isRtl = Boolean(langObj?.rtl);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = preferences.language;

    if (preferences.theme === 'light') {
      document.documentElement.classList.remove('dark', 'amoled');
      document.documentElement.classList.add('light');
    } else if (preferences.theme === 'amoled') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark', 'amoled');
    } else {
      document.documentElement.classList.remove('light', 'amoled');
      document.documentElement.classList.add('dark');
    }
  }, [preferences]);

  // Sync chats
  useEffect(() => {
    localStorage.setItem('zoir_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Sync saved books
  useEffect(() => {
    localStorage.setItem('zoir_saved_books', JSON.stringify(savedBooks));
  }, [savedBooks]);

  // Sync flashcards
  useEffect(() => {
    localStorage.setItem('zoir_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      return next;
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    showToast('Preferences reset to default values.');
  };

  // Chat operations
  const currentSession = chatSessions.find(s => s.id === currentSessionId) || chatSessions[0];

  const createNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      messages: [INITIAL_MESSAGE],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    return newId;
  };

  const selectChat = (id: string) => {
    setCurrentSessionId(id);
    setActiveTab('chat');
  };

  const deleteChat = (id: string) => {
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        return [INITIAL_SESSION];
      }
      return filtered;
    });
    if (currentSessionId === id) {
      setCurrentSessionId(chatSessions[0]?.id || 'session-default');
    }
  };

  const renameChat = (id: string, newTitle: string) => {
    setChatSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, title: newTitle.trim() || 'Conversation' } : s))
    );
  };

  const addMessageToCurrent = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatSessions(prev =>
      prev.map(s => {
        if (s.id === currentSessionId) {
          const updatedMessages = [...s.messages, newMsg];
          // Update title if it's the first user message
          let title = s.title;
          if (s.title === 'New Conversation' && msg.role === 'user') {
            title = msg.content.slice(0, 32).trim() + (msg.content.length > 32 ? '...' : '');
          }
          return {
            ...s,
            title,
            messages: updatedMessages,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      })
    );
  };

  const updateLastMessage = (updater: (prev: ChatMessage) => ChatMessage) => {
    setChatSessions(prev =>
      prev.map(s => {
        if (s.id === currentSessionId && s.messages.length > 0) {
          const lastIdx = s.messages.length - 1;
          const updatedMsgs = [...s.messages];
          updatedMsgs[lastIdx] = updater(updatedMsgs[lastIdx]);
          return {
            ...s,
            messages: updatedMsgs,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      })
    );
  };

  // Reader actions
  const openBookInReader = (book: BookItem) => {
    setActiveBook(book);
    setActiveTab('only-reading');
  };

  const toggleBookmarkBook = (book: BookItem) => {
    setSavedBooks(prev => {
      const exists = prev.some(b => b.id === book.id);
      if (exists) {
        showToast(`Removed "${book.title}" from saved library.`);
        return prev.filter(b => b.id !== book.id);
      } else {
        showToast(`Saved "${book.title}" to personal bookshelf.`);
        return [book, ...prev];
      }
    });
  };

  const updateReadingProgress = (bookId: string, progress: number) => {
    setSavedBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, readingProgress: Math.min(100, Math.max(0, progress)) } : b))
    );
  };

  // English Academy
  const setDiagnosticScore = (score: number) => {
    setDiagnosticScoreState(score);
    localStorage.setItem('zoir_diagnostic_score', String(score));
  };

  const toggleFlashcardMastered = (id: string) => {
    setFlashcards(prev =>
      prev.map(f => (f.id === id ? { ...f, mastered: !f.mastered } : f))
    );
  };

  // Studio actions
  const addGeneratedImage = (img: GeneratedImageItem) => {
    setGeneratedImages(prev => [img, ...prev]);
    localStorage.setItem('zoir_generated_images', JSON.stringify([img, ...generatedImages]));
    showToast('High-fidelity artwork saved to your studio gallery.');
  };

  const addVideoProject = (vp: VideoProject) => {
    setVideoProjects(prev => [vp, ...prev]);
    showToast(`Video synthesis job for "${vp.prompt.slice(0, 24)}..." initiated.`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        preferences,
        updatePreferences,
        resetPreferences,
        chatSessions,
        currentSessionId,
        currentSession,
        createNewChat,
        selectChat,
        deleteChat,
        renameChat,
        addMessageToCurrent,
        updateLastMessage,
        activeBook,
        openBookInReader,
        savedBooks,
        toggleBookmarkBook,
        updateReadingProgress,
        diagnosticScore,
        setDiagnosticScore,
        flashcards,
        toggleFlashcardMastered,
        generatedImages,
        addGeneratedImage,
        videoProjects,
        addVideoProject,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
