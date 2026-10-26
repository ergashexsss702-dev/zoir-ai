import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DIAGNOSTIC_QUESTIONS, FLASHCARD_VOCAB_BANK } from '../data/englishCurriculum';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Volume2,
  ChevronRight,
  BookOpen,
  Sparkles,
  Flame,
  Languages,
  Check,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';

export const EnglishAcademy: React.FC = () => {
  const {
    diagnosticScore,
    setDiagnosticScore,
    flashcards,
    toggleFlashcardMastered,
    preferences,
    updatePreferences,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeAcademyTab, setActiveAcademyTab] = useState<'assessment' | 'curriculum' | 'flashcards' | 'tutor'>('curriculum');

  // Diagnostic Test state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testFinished, setTestFinished] = useState(diagnosticScore !== null);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AI Tutor Quick Question
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorReply, setTutorReply] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  const levels = [
    { code: 'Pre-A1 & A1', title: 'Beginner Foundations', topics: 'Alphabet, Phonetics, Daily Verbs, Simple Present', unlocked: true },
    { code: 'A2', title: 'Elementary Fluency', topics: 'Past & Future Tenses, Everyday Dialogues, Shopping, Travel', unlocked: true },
    { code: 'B1', title: 'Intermediate Communicator', topics: 'Complex Sentences, Conditionals, Workplace Conversations', unlocked: true },
    { code: 'B2', title: 'Upper-Intermediate Scholar', topics: 'Academic Collocations, Passive Voice, Argumentation', unlocked: true },
    { code: 'C1', title: 'Advanced Fluency', topics: 'Subtle Nuance, Idiomatic Fluency, Critical Essays, Precision', unlocked: true },
    { code: 'C2 / IELTS 9', title: 'Mastery & Band 9.0', topics: 'Inversion, Stylistic Sophistication, Native Collocations', unlocked: true },
  ];

  const handleSelectOption = (qId: number, optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleCompleteTest = () => {
    let score = 0;
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setDiagnosticScore(score);
    setTestFinished(true);
    showToast(`Diagnostic Complete! Score: ${score}/${DIAGNOSTIC_QUESTIONS.length}`);
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[currentQIndex];
  const currentCard = flashcards[cardIndex];

  const handleSpeakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  const handleAskTutor = async () => {
    if (!tutorQuery.trim()) return;
    setIsTutorLoading(true);
    setTutorReply('');
    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `You are the personal AI English Tutor for ZOIR AI Academy. Explain this grammar rule or vocabulary question clearly for a student. Include clear practical examples. ${
                preferences.explainInUzbek
                  ? 'IMPORTANT: Provide an Uzbek translation and explanation summary alongside the English so the concept is crystal clear.'
                  : ''
              }\n\nStudent question: "${tutorQuery}"`,
            },
          ],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = '';
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunkStr = decoder.decode(value);
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) text += data.text;
              } catch {}
            }
          }
        }
      }
      setTutorReply(text);
    } catch {
      setTutorReply('Tutor connection interrupted. Please try again.');
    } finally {
      setIsTutorLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Academy Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 lg:p-10 bg-gradient-to-r from-neutral-950 via-indigo-950/40 to-neutral-950 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>CEFR Pre-A1 to C2 & IELTS Mastery</span>
            </div>

            <h1 className="font-['Outfit'] text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              ZOIR English Learning Academy
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Step-by-step curriculum with dual <strong>English & O‘zbek</strong> pedagogical explanations, spaced-repetition flashcards, and personalized tutor guidance.
            </p>

            <div className="flex items-center gap-4 pt-1 text-xs">
              <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                <Flame className="w-4 h-4" />
                <span>{preferences.studyStreakDays} Day Streak</span>
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400 font-mono">Target: Band {preferences.targetIeltsBand.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('ielts-prep')}
              className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-cyan-500/20 transition-all whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span>Go to IELTS Band 9.0 Exam Hub</span>
            </button>

            {/* Uzbek Language Explanation Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.explainInUzbek}
                onChange={e => updatePreferences({ explainInUzbek: e.target.checked })}
                className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-black"
              />
              <span className="font-medium">O‘zbekcha tushuntirishlarni yoqish (Uzbek Notes)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Academy Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        {[
          { id: 'curriculum', label: 'Curriculum & Modules' },
          { id: 'assessment', label: `Level Assessment (${diagnosticScore !== null ? 'Done' : 'Take Test'})` },
          { id: 'flashcards', label: `Vocabulary Flashcards (${flashcards.filter(f => f.mastered).length}/${flashcards.length})` },
          { id: 'tutor', label: 'AI Grammar & Concept Tutor' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAcademyTab(tab.id as typeof activeAcademyTab)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeAcademyTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Curriculum & Modules */}
      {activeAcademyTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((lvl, idx) => (
              <div
                key={lvl.code}
                className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                      {lvl.code}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Module 0{idx + 1}</span>
                  </div>

                  <h3 className="font-['Outfit'] text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {lvl.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lvl.topics}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Module</span>
                  </span>
                  <button
                    onClick={() => {
                      setActiveAcademyTab('tutor');
                      setTutorQuery(`Explain the key grammar concepts for ${lvl.code} (${lvl.title}).`);
                    }}
                    className="p-2 text-slate-400 group-hover:text-cyan-400 transition-colors"
                    title="Study with Tutor"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Diagnostic Assessment */}
      {activeAcademyTab === 'assessment' && (
        <div className="max-w-3xl mx-auto bg-neutral-900/70 border border-white/10 rounded-3xl p-6 lg:p-10 backdrop-blur-xl space-y-6 shadow-2xl">
          {testFinished ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="font-['Outfit'] text-2xl font-bold text-white">Diagnostic Completed!</h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                You scored <strong className="text-cyan-400 font-mono text-lg">{diagnosticScore}</strong> out of {DIAGNOSTIC_QUESTIONS.length}.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-sm mx-auto text-xs text-slate-300 font-mono">
                Suggested Curriculum: {diagnosticScore && diagnosticScore >= 5 ? 'Advanced (B2-C1 / IELTS Prep)' : 'Intermediate (B1-B2)'}
              </div>
              <button
                onClick={() => {
                  setTestFinished(false);
                  setCurrentQIndex(0);
                  setSelectedAnswers({});
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Diagnostic Test</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-4 border-b border-white/10">
                <span>Question {currentQIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
                <span className="text-cyan-400">{currentQ.skill}</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h3>

                <div className="space-y-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(currentQ.id, oIdx)}
                        className={`w-full p-3.5 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold'
                            : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Uzbek Note if enabled */}
                {preferences.explainInUzbek && (
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
                    <strong>💡 O‘zbekcha maslahat:</strong> {currentQ.uzbekNote}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
                >
                  Previous
                </button>

                {currentQIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleCompleteTest}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md"
                  >
                    Finish Diagnostic
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Spaced Repetition Flashcards */}
      {activeAcademyTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Card {cardIndex + 1} of {flashcards.length}</span>
            <span className="text-cyan-400">Level: {currentCard.level}</span>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[300px] p-8 rounded-3xl border border-white/15 bg-neutral-900/80 backdrop-blur-2xl shadow-2xl flex flex-col justify-between cursor-pointer transition-all hover:border-cyan-500/40 text-center relative"
          >
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
              <span className="capitalize">{currentCard.partOfSpeech}</span>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleSpeakWord(currentCard.word);
                }}
                className="p-1.5 rounded-lg hover:text-cyan-400 transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {!isFlipped ? (
              <div className="space-y-3 my-auto">
                <h2 className="font-['Outfit'] text-3xl font-extrabold text-white tracking-tight">
                  {currentCard.word}
                </h2>
                <div className="text-sm font-mono text-cyan-400">{currentCard.phonetic}</div>
                <div className="text-xs text-slate-500 pt-4">Click card to reveal definition & Uzbek translation</div>
              </div>
            ) : (
              <div className="space-y-4 my-auto text-left">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">English Definition:</div>
                  <div className="text-sm text-slate-100 font-medium mt-0.5">{currentCard.definition}</div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                  <div className="text-[11px] font-mono text-cyan-400 uppercase">O‘zbekcha tarjimasi:</div>
                  <div className="text-sm text-cyan-200 font-semibold mt-0.5">{currentCard.uzbekTranslation}</div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Academic Example:</div>
                  <div className="text-xs text-slate-300 italic mt-0.5">"{currentCard.exampleSentence}"</div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  toggleFlashcardMastered(currentCard.id);
                  showToast(currentCard.mastered ? 'Unmarked card' : 'Marked as mastered!');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium ${
                  currentCard.mastered
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{currentCard.mastered ? 'Mastered' : 'Mark Mastered'}</span>
              </button>
              <span className="text-[11px] text-slate-500">Tap to flip</span>
            </div>
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCardIndex(prev => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              disabled={cardIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
            >
              Previous Card
            </button>
            <button
              onClick={() => {
                setCardIndex(prev => (prev + 1) % flashcards.length);
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: AI Grammar & Concept Tutor */}
      {activeAcademyTab === 'tutor' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Outfit'] font-bold text-base text-white">Ask your Personal AI Tutor</h3>
                <p className="text-xs text-slate-400">Ask any grammar nuance, vocabulary difference, or IELTS dilemma.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tutorQuery}
                onChange={e => setTutorQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAskTutor();
                }}
                placeholder="e.g. When should I use 'Notwithstanding' vs 'Despite'? Explain with Uzbek translation."
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAskTutor}
                disabled={isTutorLoading || !tutorQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 font-semibold text-xs text-white transition-all whitespace-nowrap"
              >
                {isTutorLoading ? 'Explaining...' : 'Ask Tutor'}
              </button>
            </div>

            {tutorReply && (
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-line mt-4">
                {tutorReply}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
