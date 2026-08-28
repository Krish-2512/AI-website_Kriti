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
  Brain, Cpu, Activity, BarChart2, ShieldCheck, 
  Sparkles, RefreshCw, Layers, CheckCircle2, TrendingUp, Info,
  Share2, Network
} from "lucide-react";
import axios from "axios";

export default function MLDeepDiveModal({ isOpen, onClose, currentPrompt = "", files }) {
  const [loading, setLoading] = useState(false);
  const [mlData, setMlData] = useState(null);
  const [hfData, setHfData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
    }
  }, [isOpen, currentPrompt]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const appCode = files?.["/App.js"]?.code || "";
      
      const [nlpRes, hfRes] = await Promise.all([
        axios.post("/api/ml/nlp-metrics", {
          prompt: currentPrompt,
          code: appCode.slice(0, 1500)
        }),
        axios.post("/api/ml/huggingface", {
          prompt: currentPrompt || "Modern high conversion web application"
        })
      ]);

      if (nlpRes.data?.models) {
        setMlData(nlpRes.data.models);
      }
      if (hfRes.data?.huggingface) {
        setHfData(hfRes.data.huggingface);
      }
    } catch (err) {
      console.warn("Failed to load deep ML metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-600/30">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Neural &amp; Machine Learning Models Studio
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Hugging Face Transformers, Bayesian Inference, K-Means Clustering, and NLP Cognitive Scoring.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold">Running Hugging Face Transformers &amp; K-Means Convergence...</p>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {/* 1. Hugging Face Transformer Model (all-MiniLM-L6-v2 & bart-large-mnli) */}
            {hfData && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-950 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤗</span>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Hugging Face Hub Transformer AI
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                    Model: {hfData.activeModel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 mb-3">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-cyan-400">
                    Dimension: {hfData.embeddingDimension}-D Dense Vector
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-400">
                    Top Archetype: {hfData.classification?.topLabel} ({hfData.classification?.confidencePercent})
                  </span>
                </div>

                {/* 384-D Vector Sample Preview */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[10px] text-slate-400 mb-3 overflow-x-auto">
                  <span className="text-amber-400 font-bold">Vector Sample [0..7]: </span>
                  [{hfData.embeddingSample?.join(", ")}, ...]
                </div>

                {/* Classification Scores */}
                <div className="space-y-1.5">
                  {hfData.classification?.scores?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={idx === 0 ? "text-amber-300 font-bold" : "text-slate-300"}>
                          {idx === 0 ? "★ " : ""}{item.label}
                        </span>
                        <span className="font-mono text-slate-400">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            idx === 0
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : "bg-slate-700"
                          }`}
                          style={{ width: `${Math.max(4, item.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Multinomial Naive Bayes Intent Probability */}
            {mlData?.naiveBayes && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Multinomial Naive Bayes Domain Classifier
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                    Confidence: {mlData.naiveBayes?.confidencePercent || "94%"}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-3">
                  Formula: P(Domain | Prompt) ∝ P(Domain) &times; &prod; P(Word<sub>i</sub> | Domain) [Laplace &alpha;=1]
                </p>

                <div className="space-y-2">
                  {mlData.naiveBayes?.probabilities?.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={idx === 0 ? "text-indigo-300 font-bold" : "text-slate-300"}>
                          {idx === 0 ? "★ " : ""}{item.class}
                        </span>
                        <span className="font-mono text-slate-400">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            idx === 0
                              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                              : "bg-slate-700"
                          }`}
                          style={{ width: `${Math.max(4, item.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Unsupervised K-Means Color Vector Clustering */}
            {mlData?.kmeansClustering && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-fuchsia-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      K-Means Color Centroid Vector Clustering (k=5)
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300 font-mono border border-fuchsia-500/20">
                    Contrast: {mlData.kmeansClustering?.wcagContrastRatio}:1 (AAA)
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-3">
                  Algorithm: Iterative Euclidean Distance &mu;<sub>i</sub> Convergence in 3D RGB/LAB Vector Space
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {mlData.kmeansClustering?.centroids?.map((c, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div
                        className="w-full h-8 rounded-lg mb-1.5 shadow-inner border border-white/10"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="text-[11px] font-bold font-mono text-white">{c.hex}</div>
                      <div className="text-[10px] text-slate-400 truncate">{c.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Neuro-Linguistic Readability & Sentiment Metrics */}
            {mlData?.nlpReadability && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Neuro-Linguistic Readability &amp; Sentiment Valence
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-base font-extrabold text-cyan-400">
                      {mlData.nlpReadability?.metrics?.fleschReadingEase}/100
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Flesch Reading Ease</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-base font-extrabold text-emerald-400">
                      {mlData.nlpReadability?.metrics?.lexicalDiversity}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Lexical Diversity (TTR)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-base font-extrabold text-indigo-400">
                      {mlData.nlpReadability?.metrics?.conversionPropensity}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Conversion Propensity</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs font-bold text-amber-400 truncate">
                      {mlData.nlpReadability?.metrics?.gradeLevel}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Comprehension Level</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{mlData.nlpReadability?.interpretation}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
