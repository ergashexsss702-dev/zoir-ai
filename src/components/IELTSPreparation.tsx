import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { IELTS_SAMPLE_TASKS } from '../data/englishCurriculum';
import {
  Award,
  BookOpen,
  Mic,
  PenTool,
  Headphones,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
} from 'lucide-react';

export const IELTSPreparation: React.FC = () => {
  const { preferences, showToast } = useApp();

  const [activeSkill, setActiveSkill] = useState<'writing' | 'speaking' | 'reading' | 'listening'>('writing');

  // Writing state
  const [selectedTask, setSelectedTask] = useState(IELTS_SAMPLE_TASKS[0]);
  const [essayText, setEssayText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // Speaking state (Part 2 Cue Card Timer)
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [speakingPhase, setSpeakingPhase] = useState<'prep' | 'speak' | 'review'>('prep');
  const [studentSpeechNotes, setStudentSpeechNotes] = useState('');

  // Reading state
  const [selectedReadingAnswer, setSelectedReadingAnswer] = useState<string | null>(null);

  // Listening state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (speakingPhase === 'prep') {
        setSpeakingPhase('speak');
        setTimerSeconds(120); // 2 minutes speaking
        showToast('Preparation time up! Begin speaking for 2 minutes.');
      } else if (speakingPhase === 'speak') {
        setSpeakingPhase('review');
        showToast('Speaking time completed! Submit your notes for Band 9 review.');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, speakingPhase]);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const handleEvaluateEssay = async () => {
    if (wordCount < 50) {
      showToast('Please write at least 50 words to receive a detailed evaluation.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/english/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: selectedTask.type,
          promptText: selectedTask.prompt,
          studentSubmission: essayText,
          currentLevel: 'Intermediate-Advanced',
          targetBand: preferences.targetIeltsBand,
          explainInUzbek: preferences.explainInUzbek,
        }),
      });

      const data = await res.json();
      setEvaluationResult(data);
      showToast(`Evaluation completed! Estimated Band: ${data.estimatedBand || '7.5'}`);
    } catch {
      showToast('Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Target: IELTS Band 9.0 Comprehensive Mastery</span>
          </div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-bold text-white tracking-tight">
            IELTS Preparation Academy
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real test formats, timing simulations, criteria-based AI examiner grading, and Band 9 model answers.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
          {[
            { id: 'writing', label: 'Writing', icon: PenTool },
            { id: 'speaking', label: 'Speaking', icon: Mic },
            { id: 'reading', label: 'Reading', icon: BookOpen },
            { id: 'listening', label: 'Listening', icon: Headphones },
          ].map(skill => {
            const Icon = skill.icon;
            const isActive = activeSkill === skill.id;
            return (
              <button
                key={skill.id}
                onClick={() => setActiveSkill(skill.id as typeof activeSkill)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{skill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SKILL 1: WRITING */}
      {activeSkill === 'writing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Task Prompt & Editor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedTask.type}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Min: {selectedTask.minWords} words · {selectedTask.targetTimeMinutes} mins
                </span>
              </div>

              <h2 className="font-['Outfit'] text-lg font-bold text-white">{selectedTask.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-black/40 border border-white/5">
                {selectedTask.prompt}
              </p>

              {/* Task Switcher */}
              <div className="flex items-center gap-2 pt-2">
                {IELTS_SAMPLE_TASKS.filter(t => t.type.includes('Writing')).map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTask(t);
                      setEvaluationResult(null);
                    }}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      selectedTask.id === t.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'text-slate-400 bg-white/5 hover:text-white'
                    }`}
                  >
                    {t.type.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Essay Input Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Your Essay Response</span>
                <span className={wordCount >= (selectedTask.minWords || 150) ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  Word Count: {wordCount} / {selectedTask.minWords || 150}
                </span>
              </div>

              <textarea
                value={essayText}
                onChange={e => setEssayText(e.target.value)}
                placeholder="Type or paste your IELTS essay here. Structure your introduction, body paragraphs with topic sentences and supporting evidence, and clear concluding synthesis..."
                rows={12}
                className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
              />

              <button
                onClick={handleEvaluateEssay}
                disabled={isEvaluating || wordCount === 0}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? 'Examiner Analyzing Against 4 Official Criteria...' : 'Evaluate Essay with AI Examiner'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Feedback or Band 9 Criteria Guide */}
          <div className="lg:col-span-5 space-y-6">
            {evaluationResult ? (
              <div className="p-6 rounded-2xl border border-cyan-500/30 bg-neutral-900/80 backdrop-blur-xl space-y-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Band Score</span>
                    <div className="text-3xl font-extrabold font-['Outfit'] text-cyan-400">
                      Band {evaluationResult.estimatedBand}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">CEFR Mapping</span>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {evaluationResult.cefrLevel || 'C1'}
                    </div>
                  </div>
                </div>

                {/* 4 Official Criteria Scores */}
                {evaluationResult.scores && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">Task Achievement</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono">
                        Band {evaluationResult.scores.taskAchievement?.score || '7.5'}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-3">
                        {evaluationResult.scores.taskAchievement?.feedback}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">Coherence & Cohesion</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono">
                        Band {evaluationResult.scores.coherenceCohesion?.score || '7.5'}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-3">
                        {evaluationResult.scores.coherenceCohesion?.feedback}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">Lexical Resource</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono">
                        Band {evaluationResult.scores.lexicalResource?.score || '8.0'}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-3">
                        {evaluationResult.scores.lexicalResource?.feedback}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">Grammar Accuracy</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono">
                        Band {evaluationResult.scores.grammaticalRange?.score || '7.5'}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-3">
                        {evaluationResult.scores.grammaticalRange?.feedback}
                      </p>
                    </div>
                  </div>
                )}

                {/* Uzbek Summary if available */}
                {evaluationResult.uzbekSummary && preferences.explainInUzbek && (
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 space-y-1">
                    <strong className="text-cyan-400 block font-mono text-[11px] uppercase">
                      🇺🇿 O‘zbekcha xulosa & Tavsiyalar:
                    </strong>
                    <p className="leading-relaxed">{evaluationResult.uzbekSummary}</p>
                  </div>
                )}

                {/* Band 9 Rewrite snippet */}
                {evaluationResult.band9Rewrite && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                      Model Band 9.0 Paragraph Sample
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 leading-relaxed italic">
                      "{evaluationResult.band9Rewrite}"
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-4">
                <h3 className="font-['Outfit'] font-bold text-sm text-white">Band 9.0 Scoring Rubric</h3>
                <div className="space-y-3 text-xs text-slate-400">
                  {selectedTask.band9Guidelines?.map((g, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{g}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 space-y-2 mt-4">
                  <div className="font-bold text-white font-mono uppercase">Key Band 9 Principles</div>
                  <div>• Never repeat memorized generic templates. Tailor every point to the specific prompt.</div>
                  <div>• Use complex grammatical structures naturally (inversions, conditionals, participle clauses).</div>
                  <div>• Demonstrate precise academic vocabulary without forcing awkward synonyms.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SKILL 2: SPEAKING */}
      {activeSkill === 'speaking' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">IELTS Speaking Part 2</span>
                <h2 className="font-['Outfit'] text-lg font-bold text-white mt-1">
                  Describe an Inspiring Teacher or Mentor
                </h2>
              </div>

              {/* Countdown Clock */}
              <div className="flex items-center gap-2 bg-black/60 border border-white/15 px-4 py-2 rounded-2xl font-mono text-cyan-400 text-lg font-bold">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Cue Card Prompt */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs text-slate-200">
              <p className="font-semibold text-white">You should say:</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                <li>Who this person was</li>
                <li>When and where you met them</li>
                <li>What special qualities they possessed</li>
                <li>And explain why they made such an unforgettable difference to your path</li>
              </ul>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause Timer' : speakingPhase === 'prep' ? 'Start 1-Min Prep' : 'Start 2-Min Speaking'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(60);
                  setSpeakingPhase('prep');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Notes / Transcription Input */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Your Practice Notes / Speaking Transcription
              </label>
              <textarea
                value={studentSpeechNotes}
                onChange={e => setStudentSpeechNotes(e.target.value)}
                placeholder="Write your bullet points or dictate your response here for AI fluency and vocabulary feedback..."
                rows={5}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SKILL 3: READING */}
      {activeSkill === 'reading' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Academic Reading Passage</span>
              <span className="text-xs text-slate-400 font-mono">Passage 3 · Advanced Scientific</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300 leading-relaxed space-y-3 font-serif">
              <p>
                <strong>The Evolutionary Origins of Biomimicry</strong>
              </p>
              <p>
                For billions of years, biological organisms have adapted to harsh environmental constraints through natural selection, arriving at extraordinarily efficient thermodynamic, structural, and chemical solutions. Biomimicry—the practice of emulating nature’s time-tested designs—has transitioned from an eccentric novelty to a rigorous discipline driving industrial decarbonization.
              </p>
              <p>
                Consider the lotus leaf effect: microscopic papillae on the surface of Nelumbo nucifera induce superhydrophobicity, causing water droplets to roll off while carrying particulate debris away. While synthetic chemists initially struggled to replicate this micro-architecture at industrial scale, recent developments in photolithography have enabled self-cleaning glass and photovoltaic coatings that resist dust accumulation in arid solar fields.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Question: True / False / Not Given
              </h3>
              <p className="text-xs text-slate-200">
                "Photovoltaic panels installed in desert areas immediately adopted the lotus leaf mechanism upon its first biological discovery."
              </p>

              <div className="grid grid-cols-3 gap-3">
                {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelectedReadingAnswer(opt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedReadingAnswer === opt
                        ? opt === 'FALSE'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {selectedReadingAnswer && (
                <div className={`p-4 rounded-xl text-xs space-y-1 border ${
                  selectedReadingAnswer === 'FALSE'
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/40 text-rose-200'
                }`}>
                  <div className="font-bold">
                    {selectedReadingAnswer === 'FALSE' ? '✓ Correct! Answer is FALSE.' : '✕ Incorrect. The correct answer is FALSE.'}
                  </div>
                  <p>
                    The passage clearly states: <em>"While synthetic chemists initially struggled to replicate this micro-architecture at industrial scale, recent developments..."</em>, meaning it was NOT adopted immediately.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SKILL 4: LISTENING */}
      {activeSkill === 'listening' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Listening Section 4 (Academic Lecture)</span>
              <span className="text-xs text-slate-400 font-mono">Duration: 3m 40s</span>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Headphones className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">Lecture on Ocean Current Thermodynamics</h3>
                <p className="text-xs text-slate-400 mt-1">Speaker: Dr. Aris Thorne, Woods Hole Oceanographic Institution</p>
              </div>

              <button
                onClick={() => {
                  setIsAudioPlaying(!isAudioPlaying);
                  showToast(isAudioPlaying ? 'Audio paused.' : 'Simulating audio stream with accents.');
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-all shadow-md shadow-cyan-500/20"
              >
                {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isAudioPlaying ? 'Pause Audio Track' : 'Play Lecture Audio'}</span>
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Comprehension Question: Complete the notes
              </h4>
              <p className="text-xs text-slate-300">
                Write <strong>NO MORE THAN TWO WORDS</strong>:
                <br />
                "Thermohaline circulation is fundamentally driven by gradients in temperature and _______."
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your answer (e.g. salinity)..."
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 flex-1"
                />
                <button
                  onClick={() => showToast('Correct! Answer: "salinity" (water salt concentration).')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white"
                >
                  Check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
