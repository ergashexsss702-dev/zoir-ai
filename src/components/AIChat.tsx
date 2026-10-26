import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { marked } from 'marked';
import {
  Send,
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Search,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Compass,
  Code2,
  Globe,
  BookOpen,
  Languages,
} from 'lucide-react';

export const AIChat: React.FC = () => {
  const {
    currentSession,
    chatSessions,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    addMessageToCurrent,
    updateLastMessage,
    showToast,
  } = useApp();

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [enableSearch, setEnableSearch] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mime: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isStreaming]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      // @ts-expect-error browser SpeechRecognition constructor
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = (event: { results: Array<Array<{ transcript: string }>> }) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition is not supported in this browser.');
      return;
    }
    if (isRecording) {
      // @ts-expect-error browser recognition
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        // @ts-expect-error browser recognition
        recognitionRef.current.start();
        setIsRecording(true);
        showToast('Listening... Speak naturally.');
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Please upload files under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage({
        base64,
        mime: file.type || 'image/jpeg',
      });
      showToast(`Attached ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if ((!promptToSend.trim() && !selectedImage) || isStreaming) return;

    const userMessageContent = promptToSend.trim();
    const attachedImage = selectedImage;

    // Reset input
    setInput('');
    setSelectedImage(null);

    // 1. Add user message
    addMessageToCurrent({
      role: 'user',
      content: userMessageContent || 'Analyzed attached image',
      imageBase64: attachedImage?.base64,
      imageMime: attachedImage?.mime,
    });

    // 2. Prepare assistant placeholder
    addMessageToCurrent({
      role: 'assistant',
      content: '',
      isStreaming: true,
    });

    setIsStreaming(true);

    try {
      // Collect prior messages
      const allMsgs = currentSession?.messages || [];
      const messagesPayload = [
        ...allMsgs.map(m => ({
          role: m.role,
          content: m.content,
          imageBase64: m.imageBase64,
          imageMime: m.imageMime,
        })),
        {
          role: 'user',
          content: userMessageContent,
          imageBase64: attachedImage?.base64,
          imageMime: attachedImage?.mime,
        },
      ];

      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          enableSearch,
          systemInstruction:
            'You are ZOIR AI, an intelligent, high-precision AI assistant. You excel at coding, science, literature, multilingual translation (including fluent Uzbek), and step-by-step reasoning. Structure answers with clean headings, markdown, and bullet points. When appropriate, provide concise actionable conclusions.',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      if (reader) {
        let streamDone = false;
        while (!streamDone) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  accumulated += data.text;
                  updateLastMessage(prev => ({
                    ...prev,
                    content: accumulated,
                  }));
                }
                if (data.done) {
                  streamDone = true;
                }
                if (data.error) {
                  accumulated += `\n\n*(Notice: ${data.error})*`;
                  updateLastMessage(prev => ({
                    ...prev,
                    content: accumulated,
                  }));
                }
              } catch {
                // partial chunk ignore
              }
            }
          }
        }
      }

      updateLastMessage(prev => ({
        ...prev,
        isStreaming: false,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network failure';
      updateLastMessage(prev => ({
        ...prev,
        content: `I encountered an unexpected connection error: ${msg}. Please verify network status and try again.`,
        isStreaming: false,
      }));
    } finally {
      setIsStreaming(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const playTTS = async (text: string) => {
    try {
      showToast('Synthesizing audio...');
      const cleanText = text.replace(/[*#`_]/g, '').slice(0, 1000);
      const res = await fetch('/api/audio/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: 'Kore' }),
      });
      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
      } else {
        // Fallback to Web Speech Synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch {
      if ('speechSynthesis' in window) {
        const cleanText = text.replace(/[*#`_]/g, '').slice(0, 500);
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(cleanText));
      }
    }
  };

  const promptStarters = [
    { title: 'Explain Quantum Computing', prompt: 'Explain quantum computing and qubits to a high school student with intuitive analogies.' },
    { title: 'Debug / Code Architecture', prompt: 'Explain how to design an event-driven microservices architecture with clean failure isolation in Node.js.' },
    { title: 'IELTS Essay Strategy', prompt: 'Provide a structured roadmap with cohesive devices to achieve Band 9.0 in IELTS Writing Task 2.' },
    { title: 'Uzbek History & Literature', prompt: 'Alisher Navoiyning jahon adabiyotiga qo‘shgan hissasi va uning "Xamsa" asari haqida batafsil ma‘lumot bering.' },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-neutral-950 text-slate-100">
      {/* Sessions Drawer */}
      <div className="hidden md:flex w-72 flex-col border-r border-white/10 bg-neutral-900/60 backdrop-blur-xl p-3">
        <button
          onClick={createNewChat}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mb-3 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg shadow-cyan-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>

        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {chatSessions
            .filter(s => s.title.toLowerCase().includes(searchFilter.toLowerCase()))
            .map(s => {
              const isSelected = s.id === currentSession?.id;
              return (
                <div
                  key={s.id}
                  className={`group relative flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                  onClick={() => selectChat(s.id)}
                >
                  {editingTitleId === s.id ? (
                    <input
                      type="text"
                      value={titleInput}
                      onChange={e => setTitleInput(e.target.value)}
                      onBlur={() => {
                        renameChat(s.id, titleInput);
                        setEditingTitleId(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          renameChat(s.id, titleInput);
                          setEditingTitleId(null);
                        }
                      }}
                      autoFocus
                      className="w-full bg-black/60 px-2 py-0.5 rounded text-white border border-cyan-400 focus:outline-none"
                    />
                  ) : (
                    <span className="truncate flex-1 pr-2">{s.title}</span>
                  )}

                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setEditingTitleId(s.id);
                        setTitleInput(s.title);
                      }}
                      className="p-1 hover:text-cyan-400"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteChat(s.id);
                      }}
                      className="p-1 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Control Ribbon */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/10 bg-neutral-900/40 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white truncate max-w-xs">{currentSession?.title}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono text-[11px]">Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnableSearch(!enableSearch)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors ${
                enableSearch
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
              title="Google Search Grounding for verified external citations"
            >
              <Compass className="w-3 h-3" />
              <span>Web Citations: {enableSearch ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6">
          {currentSession?.messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-cyan-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed border ${
                    isUser
                      ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-50 rounded-tr-none'
                      : 'bg-white/[0.04] border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md shadow-xl'
                  }`}
                >
                  {/* Attached Image if any */}
                  {msg.imageBase64 && (
                    <div className="mb-3 rounded-lg overflow-hidden max-w-sm border border-white/10">
                      <img src={msg.imageBase64} alt="Uploaded attachment" className="w-full object-cover max-h-60" />
                    </div>
                  )}

                  {/* Render Markdown Content */}
                  <div
                    className="prose prose-invert prose-sm max-w-none prose-headings:text-cyan-300 prose-headings:font-semibold prose-a:text-cyan-400 prose-code:font-mono prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(msg.content || (msg.isStreaming ? 'Thinking...' : '')),
                    }}
                  />

                  {/* Action buttons on assistant response */}
                  {!isUser && !msg.isStreaming && msg.content && (
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2 text-slate-400 text-xs">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-cyan-300 p-1 flex items-center gap-1 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[11px]">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => playTTS(msg.content)}
                        className="hover:text-cyan-300 p-1 flex items-center gap-1 transition-colors"
                        title="Listen with Text-to-Speech"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Listen</span>
                      </button>

                      <button
                        onClick={() => handleSend(msg.content)}
                        className="hover:text-cyan-300 p-1 flex items-center gap-1 transition-colors"
                        title="Regenerate"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Prompt Starters if empty/few messages */}
          {currentSession?.messages.length === 1 && (
            <div className="pt-6 max-w-2xl mx-auto">
              <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-3 text-center">
                Suggested exploration topics
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {promptStarters.map((ps, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(ps.prompt)}
                    className="p-3 text-left rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300 flex items-center justify-between">
                      <span>{ps.title}</span>
                      <Sparkles className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">{ps.prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div className="p-4 bg-neutral-950 border-t border-white/10">
          <div className="max-w-4xl mx-auto relative">
            {/* Attachment Preview */}
            {selectedImage && (
              <div className="mb-2 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1.5 w-fit">
                <img src={selectedImage.base64} alt="Attachment" className="w-8 h-8 rounded object-cover" />
                <span className="text-xs text-slate-300">Image attached</span>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-slate-400 hover:text-rose-400 px-1 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/15 focus-within:border-cyan-500/60 rounded-2xl p-2 shadow-2xl backdrop-blur-xl transition-all">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-cyan-400 rounded-xl hover:bg-white/5 transition-colors"
                title="Attach image or document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-xl transition-colors ${
                  isRecording ? 'text-rose-400 bg-rose-500/20 animate-pulse' : 'text-slate-400 hover:text-cyan-400 hover:bg-white/5'
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask ZOIR AI anything... (Shift+Enter for new line)"
                rows={1}
                className="flex-1 max-h-32 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none py-1.5"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isStreaming || (!input.trim() && !selectedImage)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 text-center mt-2">
              ZOIR AI combines Gemini 3.8 Flash intelligence with verified citations and instant multilingual reasoning.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
