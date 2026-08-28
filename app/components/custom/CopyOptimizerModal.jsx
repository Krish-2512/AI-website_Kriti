"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Type, Sparkles, RefreshCw, Copy, Check, Star } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function CopyOptimizerModal({ isOpen, onClose, currentPrompt = "", onInsertCopy }) {
  const [brandName, setBrandName] = useState("Nova");
  const [industry, setIndustry] = useState("SaaS / Tech");
  const [tone, setTone] = useState("High Conversion & Modern");
  const [loading, setLoading] = useState(false);
  const [copyData, setCopyData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/ml/copy-optimizer", {
        brandName,
        industry,
        tone,
        currentCopy: currentPrompt,
      });

      if (res.data?.copy) {
        setCopyData(res.data.copy);
      }
    } catch (err) {
      console.error("Copy generation error:", err);
      toast.error("Failed to generate copy");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                AI Copywriting & Marketing Engine (NLP Pipeline)
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Generate high-converting hero headlines, value propositions, and social proof.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Industry / Niche</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Copy Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            >
              <option>High Conversion & Modern</option>
              <option>Luxury & High End</option>
              <option>Playful & Creative</option>
              <option>Minimalist & Technical</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/20 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Generate Marketing Copy
        </button>

        {copyData && (
          <div className="space-y-4 pt-2">
            {/* Hero Headlines */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">High-Impact Hero Headlines</h4>
              <div className="space-y-2">
                {copyData.heroVariants?.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">{h.headline}</h5>
                      <p className="text-xs text-slate-400 mb-2">{h.subheadline}</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-medium">
                          CTA: {h.primaryCTA}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          Secondary: {h.secondaryCTA}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${h.headline}\n${h.subheadline}`, `hero-${idx}`)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white shrink-0"
                    >
                      {copiedKey === `hero-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Highlights */}
            {copyData.featureHighlights?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Value Propositions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {copyData.featureHighlights.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-xs font-bold text-white mb-1">{f.title}</div>
                      <p className="text-[11px] text-slate-400">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
