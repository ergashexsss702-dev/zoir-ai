import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VideoProject } from '../types';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Film,
  Camera,
  Layers,
  Clock,
  Sliders,
  CheckCircle2,
  UploadCloud,
} from 'lucide-react';

export const VideoStudio: React.FC = () => {
  const { videoProjects, addVideoProject, showToast } = useApp();

  const [prompt, setPrompt] = useState('');
  const [cameraMovement, setCameraMovement] = useState('Drone Fly-through');
  const [stylePreset, setStylePreset] = useState('Cinematic Hyperreal');
  const [duration, setDuration] = useState<3 | 5 | 10>(5);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [includeCaptions, setIncludeCaptions] = useState(true);
  const [includeVoiceover, setIncludeVoiceover] = useState(false);
  const [referenceFrame, setReferenceFrame] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  // Playback canvas state
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [activeProject, setActiveProject] = useState<VideoProject>(videoProjects[0]);

  const cameraOptions = [
    'Drone Fly-through',
    'Smooth Cinematic Pan Left',
    'Smooth Cinematic Pan Right',
    'Slow Push-In (Dolly Zoom)',
    'Dynamic Tilt Up',
    '360 Orbit Around Subject',
    'Static Master Shot with Ambient Wind',
  ];

  const styles = [
    'Cinematic Hyperreal (Arri Alexa 65mm)',
    'Anime 60fps Studio Ghibli Aesthetic',
    'Unreal Engine 5 Photorealistic CGI',
    'Cyberpunk Neo-Noir Neon Glow',
    'Vintage 35mm Grain & Warm Film Halation',
  ];

  // Dynamic simulation of scene motion on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // Dark space backdrop with moving light gradients
      const grad = ctx.createRadialGradient(
        width / 2 + Math.sin(time) * 100,
        height / 2 + Math.cos(time) * 60,
        20,
        width / 2,
        height / 2,
        width * 0.8
      );
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.3, '#1e1b4b');
      grad.addColorStop(0.7, '#09090b');
      grad.addColorStop(1, '#000000');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Starfield / particles moving with selected camera angle
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 80; i++) {
        const x = (Math.sin(i * 99 + time * (cameraMovement.includes('Pan') ? 2 : 1)) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 33 + time * (cameraMovement.includes('Tilt') ? 2 : 0.8)) * 0.5 + 0.5) * height;
        const radius = (Math.sin(i + time) * 0.5 + 0.5) * 2.5 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dynamic cinematic letterbox overlay
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, height - 70, width, 70);

      // Scene caption banner
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.fillText(`CAM: ${activeProject.cameraMovement}`, 24, height - 38);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px Plus Jakarta Sans, sans-serif';
      ctx.fillText(activeProject.prompt.slice(0, 65) + '...', 24, height - 16);

      // Timecode
      ctx.fillStyle = '#64748b';
      ctx.font = '12px JetBrains Mono, monospace';
      const sec = Math.floor(time % activeProject.duration);
      const ms = Math.floor((time * 100) % 100);
      ctx.fillText(`00:0${sec}:${ms < 10 ? '0' : ''}${ms} / 00:0${activeProject.duration}:00`, width - 150, height - 24);

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, activeProject, cameraMovement]);

  const handleStartRender = () => {
    if (!prompt.trim()) {
      showToast('Describe the video scene you want to generate.');
      return;
    }

    setIsRendering(true);
    setRenderProgress(0);

    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          const newProject: VideoProject = {
            id: `vp-${Date.now()}`,
            prompt,
            cameraMovement,
            style: stylePreset,
            duration,
            aspectRatio,
            status: 'ready',
            createdAt: 'Just now',
          };
          addVideoProject(newProject);
          setActiveProject(newProject);
          setIsPlaying(true);
          showToast('Video synthesized successfully!');
          return 100;
        }
        return prev + 12;
      });
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Video Creation Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate cinematic video clips with precise camera control, lighting styles, and motion choreography.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg w-fit">
          <Film className="w-3.5 h-3.5" />
          <span>Interactions Video Pipeline · Omni 1.1 Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Controls */}
        <div className="lg:col-span-5 space-y-6 bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          {/* Scene Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Scene Description & Motion Script
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. An ancient celestial observatory atop cloud-covered peaks, glowing stellar charts floating in air as dawn light streams through arched stained glass..."
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Camera Movement Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Camera Movement</span>
            </label>
            <select
              value={cameraMovement}
              onChange={e => setCameraMovement(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {cameraOptions.map(cam => (
                <option key={cam} value={cam} className="bg-neutral-900 text-white">
                  {cam}
                </option>
              ))}
            </select>
          </div>

          {/* Style Preset */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Cinematography & Style
            </label>
            <select
              value={stylePreset}
              onChange={e => setStylePreset(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {styles.map(s => (
                <option key={s} value={s} className="bg-neutral-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Duration & Aspect Ratio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Duration</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[3, 5, 10].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d as 3 | 5 | 10)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      duration === d
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['16:9', '9:16', '1:1'].map(ar => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspectRatio(ar as '16:9' | '9:16' | '1:1')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      aspectRatio === ar
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Captions and Audio toggles */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCaptions}
                onChange={e => setIncludeCaptions(e.target.checked)}
                className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-black"
              />
              <span>Generate Audio Captions</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVoiceover}
                onChange={e => setIncludeVoiceover(e.target.checked)}
                className="rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-black"
              />
              <span>Voiceover Narration</span>
            </label>
          </div>

          {/* Render Action / Progress */}
          {isRendering ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-cyan-400 font-mono">
                <span>Rendering scene frames...</span>
                <span>{renderProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartRender}
              disabled={!prompt.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Video Project</span>
            </button>
          )}
        </div>

        {/* Right Column: Viewport & Projects List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Render Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full aspect-video object-contain bg-black"
            />

            {/* Play/Pause Overlay Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 text-white hover:text-cyan-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Live Motion'}</span>
              </button>
            </div>
          </div>

          {/* Projects Queue */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Rendered Projects ({videoProjects.length})
            </h3>

            <div className="space-y-2">
              {videoProjects.map(vp => (
                <div
                  key={vp.id}
                  onClick={() => {
                    setActiveProject(vp);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    activeProject.id === vp.id
                      ? 'bg-cyan-500/15 border-cyan-400/50 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{vp.prompt}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {vp.cameraMovement} · {vp.duration}s · {vp.aspectRatio} · {vp.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        showToast(`Exporting video clip for "${vp.prompt.slice(0, 16)}..."`);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Download clip"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
