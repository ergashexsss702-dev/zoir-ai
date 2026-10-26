export type NavTab =
  | 'dashboard'
  | 'chat'
  | 'image-studio'
  | 'video-studio'
  | 'library'
  | 'only-reading'
  | 'english-academy'
  | 'ielts-prep'
  | 'translation'
  | 'integrations'
  | 'settings'
  | 'admin';

export type ThemeMode = 'dark' | 'light' | 'amoled';

export type AccentColor = 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';

export interface UserPreferences {
  theme: ThemeMode;
  accentColor: AccentColor;
  language: string;
  isRtl: boolean;
  customBgUrl: string | null;
  bgBlur: number; // 0 to 20 px
  bgOpacity: number; // 10 to 100 %
  bgContrast: number; // 50 to 150 %
  fontSize: 'compact' | 'normal' | 'large';
  ttsVoice: string;
  studyStreakDays: number;
  targetIeltsBand: number;
  explainInUzbek: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  imageBase64?: string;
  imageMime?: string;
  citations?: Array<{ title: string; url: string }>;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  year: string | number;
  category: string;
  coverUrl?: string | null;
  description: string;
  fullContent?: string;
  chapters?: Array<{ title: string; text: string }>;
  isCuratedFullText?: boolean;
  readingProgress?: number; // 0 to 100
  bookmarked?: boolean;
}

export interface Flashcard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  uzbekTranslation: string;
  exampleSentence: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  mastered: boolean;
}

export interface IELTSDiagnosticQuestion {
  id: number;
  skill: 'Grammar' | 'Vocabulary' | 'Collocations' | 'Reading' | 'Idioms';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  uzbekNote: string;
}

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  aspectRatio: string;
  style: string;
  imageUrl: string;
  timestamp: string;
  caption?: string;
}

export interface VideoProject {
  id: string;
  prompt: string;
  cameraMovement: string;
  style: string;
  duration: number;
  aspectRatio: string;
  status: 'ready' | 'rendering' | 'queued';
  videoPreviewUrl?: string;
  createdAt: string;
}

export interface ProviderStatus {
  name: string;
  configured: boolean;
  connected?: boolean;
  latencyMs?: number;
  status?: string;
  models?: string[];
  error?: string | null;
}
