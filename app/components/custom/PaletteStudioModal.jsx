"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Palette, Sparkles, Check, RefreshCw, Wand2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function PaletteStudioModal({ isOpen, onClose, onSelectPalette, currentPrompt = "" }) {
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customMood, setCustomMood] = useState("");

  useEffect(() => {
    if (isOpen && palettes.length === 0) {
      fetchPalettes();
    }
  }, [isOpen]);

  const fetchPalettes = async (mood = "") => {
    try {
      setLoading(true);
      const res = await axios.post("/api/ml/color-palette", {
        prompt: currentPrompt,
        mood: mood || customMood,
      });
      if (res.data?.palettes) {
        setPalettes(res.data.palettes);
      }
    } catch (err) {
      console.error("Error fetching palettes:", err);
      toast.error("Failed to load color palettes");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (palette) => {
    onSelectPalette(palette);
    toast.success(`Applied "${palette.name}" color harmony!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Intelligent Palette Studio (ML Color Theory)
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Harmonic color palettes computed with WCAG AA/AAA contrast ratios and psychological color theory.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Custom Mood Generator Input */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            placeholder="e.g. Luxury Velvet, Neon Tokyo, Eco Green, Solar Sunset..."
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
          />
          <button
            onClick={() => fetchPalettes(customMood)}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            Generate
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-fuchsia-500" />
            <p className="text-sm font-medium">Computing harmonic color matrices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {palettes.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-slate-950/80 ${
                  selectedIdx === idx
                    ? "border-fuchsia-500 shadow-lg shadow-fuchsia-500/10 ring-1 ring-fuchsia-500"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <span className="text-[10px] text-fuchsia-400 font-medium">{p.badge || "Curated"}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 font-mono">
                    WCAG: {p.contrastScore}%
                  </span>
                </div>

                {/* Color Swatches */}
                <div className="flex rounded-xl overflow-hidden h-8 border border-slate-800 mb-3 shadow-inner">
                  <div style={{ backgroundColor: p.primary }} className="flex-1" title="Primary" />
                  <div style={{ backgroundColor: p.secondary }} className="flex-1" title="Secondary" />
                  <div style={{ backgroundColor: p.accent }} className="flex-1" title="Accent" />
                  <div style={{ backgroundColor: p.surface }} className="flex-1" title="Surface" />
                  <div style={{ backgroundColor: p.background }} className="flex-1" title="Background" />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(p);
                  }}
                  className="w-full py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-fuchsia-600 text-white transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Apply to Site
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
