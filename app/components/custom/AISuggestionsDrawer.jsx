"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Check, Zap, TrendingUp, ShieldCheck, X, RefreshCw } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function AISuggestionsDrawer({ sections, setSections, currentPrompt = "" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/ml/runtime-suggestions", {
        currentSections: sections,
        currentPrompt: currentPrompt
      });

      if (res.data?.suggestions) {
        setSuggestions(res.data.suggestions);
      }
    } catch (e) {
      console.warn("Could not fetch runtime suggestions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [sections.length]);

  const handleApplySuggestion = (sug) => {
    if (sug.actionType === "inject_section") {
      const type = sug.payload?.sectionType || "features";
      const newSec = {
        id: "sec-" + Date.now(),
        type: type,
        name: `AI Enhanced ${type.toUpperCase()}`,
        content: {
          title: sug.payload?.recommendedTitle || `Optimized ${type.toUpperCase()} Section`,
          subtitle: "Synthesized based on real-time conversion recommendations.",
          items: [
            { title: "Autonomous Speed", desc: "Designed for high-scale performance." },
            { title: "Verified Trust", desc: "Built with industry-proven compliance." }
          ]
        },
        styles: { bgColor: "#030712", textColor: "#ffffff" }
      };

      setSections(prev => [...prev, newSec]);
      toast.success(`✨ Applied ML Suggestion: ${sug.title}!`);
    } else {
      toast.success(`✨ Applied ML Quality Enhancement: ${sug.title}!`);
    }

    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== sug.id));
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white text-xs font-bold shadow-2xl shadow-indigo-600/40 hover:scale-105 transition group"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span>AI Co-Pilot Suggestions ({suggestions.length})</span>
        </button>
      ) : (
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700 rounded-3xl p-4 shadow-2xl space-y-3 w-84">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Live ML Design Suggestions</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={fetchSuggestions}
                disabled={loading}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                title="Refresh Suggestions"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {suggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                    {sug.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {sug.impact}
                  </span>
                </div>

                <h5 className="text-xs font-bold text-white">{sug.title}</h5>
                <p className="text-[11px] text-slate-400 leading-snug">{sug.explanation}</p>

                <button
                  onClick={() => handleApplySuggestion(sug)}
                  className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition flex items-center justify-center gap-1 mt-2 shadow-md shadow-indigo-600/20"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>1-Click Apply Enhancement</span>
                </button>
              </div>
            ))}

            {suggestions.length === 0 && !loading && (
              <div className="text-center py-4 text-xs text-slate-400">
                ✨ Flawless design quality! No critical improvements needed.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
