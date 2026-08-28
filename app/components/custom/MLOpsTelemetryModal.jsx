"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { 
  Activity, Cpu, Clock, DollarSign, CheckCircle2, 
  Layers, RefreshCw, BarChart3, Database, ShieldAlert 
} from "lucide-react";
import { DEFAULT_PIPELINE_TELEMETRY } from "@/lib/telemetry";

export default function MLOpsTelemetryModal({ isOpen, onClose }) {
  const [telemetry, setTelemetry] = useState(DEFAULT_PIPELINE_TELEMETRY);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                MLOps & Pipeline Telemetry Inspector
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Real-time observability, stage-by-stage model latency, token economics, and confidence metrics.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{telemetry.totalLatencyMs}ms</div>
              <div className="text-[11px] text-slate-400">Total Latency</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Cpu className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{telemetry.totalTokensProcessed}</div>
              <div className="text-[11px] text-slate-400">Tokens Processed</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">${telemetry.estimatedCostUSD}</div>
              <div className="text-[11px] text-slate-400">Est. Generation Cost</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Database className="w-4 h-4 text-fuchsia-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{telemetry.cacheHitRate}</div>
              <div className="text-[11px] text-slate-400">RAG Cache Rate</div>
            </div>
          </div>

          {/* Model Deployment Strategy */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Inference Model</div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{telemetry.activeModel}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">Primary</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fallback Route</div>
              <div className="text-xs font-mono text-slate-300 mt-1">{telemetry.fallbackModel} (Zero Downtime)</div>
            </div>
          </div>

          {/* Pipeline Execution Latency Stages */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Multi-Stage Pipeline Execution Timeline
            </h4>
            <div className="space-y-2">
              {telemetry.pipelineStages.map((stage, idx) => {
                const percentage = Math.round((stage.latencyMs / telemetry.totalLatencyMs) * 100);
                return (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-white">{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                        <span>Confidence: {Math.round(stage.confidence * 100)}%</span>
                        <span className="text-cyan-400 font-bold">{stage.latencyMs}ms</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(8, percentage * 1.5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
