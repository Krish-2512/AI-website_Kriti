"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { 
  Sparkles, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, 
  Search, Palette, Zap, ArrowRight, RefreshCw, Layers, Check
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function MLAuditModal({ isOpen, onClose, files, onApplyFix }) {
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [fixing, setFixing] = useState(false);

  useEffect(() => {
    if (isOpen && files) {
      runAudit();
    }
  }, [isOpen, files]);

  const runAudit = async () => {
    try {
      setLoading(true);
      const appCode = files?.["/App.js"]?.code || "";
      const res = await axios.post("/api/ml/quality-audit", { code: appCode });
      if (res.data?.audit) {
        setAuditData(res.data.audit);
      }
    } catch (err) {
      console.error("Audit error:", err);
      toast.error("Failed to run quality audit");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = async () => {
    try {
      setFixing(true);
      const appCode = files?.["/App.js"]?.code || "";
      const res = await axios.post("/api/ml/self-heal", { 
        code: appCode,
        errorMessage: "Improve accessibility attributes, semantic headings, and ARIA labels based on AI audit."
      });

      if (res.data?.files) {
        onApplyFix(res.data.files);
        toast.success("AI auto-healed your website with full a11y & SEO standards!");
        onClose();
      }
    } catch (err) {
      toast.error("Failed to apply auto-fix");
    } finally {
      setFixing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                AI Quality & Accessibility Auditor (ML Pipeline)
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Real-time multi-dimensional scoring for a11y (WCAG AAA), SEO, and UX fidelity.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Analyzing AST structure & computing quality metrics...</p>
          </div>
        ) : auditData ? (
          <div className="space-y-6 pt-2">
            {/* Top Score Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Quality Score</div>
                <div className="text-4xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {auditData.overallScore}/100
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Grade {auditData.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">{auditData.summary}</p>
              </div>

              <button
                onClick={handleAutoFix}
                disabled={fixing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {fixing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                1-Click Auto Fix All
              </button>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Accessibility (a11y)", score: auditData.scores?.a11y, icon: ShieldCheck, color: "text-emerald-400" },
                { label: "SEO Readiness", score: auditData.scores?.seo, icon: Search, color: "text-cyan-400" },
                { label: "UI / UX Polish", score: auditData.scores?.ux, icon: Palette, color: "text-fuchsia-400" },
                { label: "Code Health", score: auditData.scores?.codeQuality, icon: Layers, color: "text-amber-400" }
              ].map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <Icon className={`w-5 h-5 mx-auto mb-1.5 ${p.color}`} />
                    <div className="text-lg font-bold text-white">{p.score}%</div>
                    <div className="text-[11px] text-slate-400 font-medium">{p.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Detected Insights & Issues */}
            {auditData.issues?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detected Optimizations</h4>
                <div className="space-y-2">
                  {auditData.issues.map((issue, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                      {issue.severity === "high" ? (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">{issue.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono uppercase">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
                        <p className="text-xs text-indigo-300 mt-1 font-medium">Tip: {issue.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {auditData.strengths?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Architectural Strengths</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {auditData.strengths.map((str, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
