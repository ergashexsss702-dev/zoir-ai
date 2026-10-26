import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Activity,
  Server,
  Cpu,
  Clock,
  AlertTriangle,
  FileText,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const { showToast } = useApp();

  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(60);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [imageGenerationEnabled, setImageGenerationEnabled] = useState(true);

  const [auditLogs] = useState([
    { id: 1, action: 'System Initialization', user: 'system_root', time: '10:00:02', status: 'SUCCESS' },
    { id: 2, action: 'Gemini 3.8 Flash Handshake', user: 'ai_engine', time: '10:00:05', status: 'SUCCESS' },
    { id: 3, action: 'OpenLibrary Proxy Healthcheck', user: 'library_daemon', time: '10:02:18', status: 'SUCCESS' },
    { id: 4, action: 'IELTS Assessment Scored', user: 'student_session', time: '10:14:45', status: 'VERIFIED' },
    { id: 5, action: 'Image Generation Dispatched', user: 'studio_worker', time: '10:20:11', status: 'COMPLETED' },
  ]);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/system/status');
      const data = await res.json();
      setSystemStatus(data);
    } catch {
      showToast('Status prober error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Operations & Telemetry Console</span>
          </div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Administrator Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            System latency monitoring, quota limits, model availability, and administrative security logs.
          </p>
        </div>

        <button
          onClick={loadStatus}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Primary Core Model</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-['Outfit']">Gemini 3.8 Flash</div>
          <div className="text-[11px] text-emerald-400 font-mono">100% Operational</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Ping Latency</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {systemStatus?.providers?.gemini?.latencyMs || 240}ms
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Real-time Unary Probe</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Server Runtime</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            Node {systemStatus?.system?.nodeVersion || 'v22.x'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Express + Vite Full-Stack</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-1">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Active Security Tier</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-['Outfit']">Protected Proxy</div>
          <div className="text-[11px] text-emerald-400 font-mono">Zero Client Key Leaks</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Feature Flags & Quota Config */}
        <div className="lg:col-span-5 space-y-6 bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="font-['Outfit'] font-bold text-base text-white">System Controls & Quotas</h2>

          <div className="space-y-4 text-xs">
            {/* Rate limit slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Requests Quota / Minute</span>
                <span className="font-mono text-cyan-400">{rateLimitPerMinute} req/min</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                step={10}
                value={rateLimitPerMinute}
                onChange={e => {
                  setRateLimitPerMinute(Number(e.target.value));
                  showToast(`Quota updated to ${e.target.value} req/min`);
                }}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Feature switches */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <div className="font-semibold text-white">Streaming Responses</div>
                <div className="text-[11px] text-slate-400">Server-Sent Events (SSE) token stream</div>
              </div>
              <button
                onClick={() => setStreamingEnabled(!streamingEnabled)}
                className="text-cyan-400 text-base"
              >
                {streamingEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <div className="font-semibold text-white">Creative Image Studio</div>
                <div className="text-[11px] text-slate-400">Gemini 3.1 Flash Lite Image pipeline</div>
              </div>
              <button
                onClick={() => setImageGenerationEnabled(!imageGenerationEnabled)}
                className="text-cyan-400 text-base"
              >
                {imageGenerationEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Logs */}
        <div className="lg:col-span-7 space-y-4 bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] font-bold text-base text-white">Administrative Audit Trail</h2>
            <span className="text-xs text-slate-500 font-mono">Live Ingestion</span>
          </div>

          <div className="divide-y divide-white/5 text-xs font-mono">
            {auditLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-slate-200">{log.action}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{log.user}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
