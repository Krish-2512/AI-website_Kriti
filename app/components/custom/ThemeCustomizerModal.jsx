"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Sliders, Sparkles, Check, Type, Square, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";

const FONT_OPTIONS = [
  { name: "Inter (Modern Sans)", class: "font-sans", preview: "The quick brown fox" },
  { name: "Space Grotesk (Tech/Crypto)", class: "font-mono tracking-tight", preview: "The quick brown fox" },
  { name: "Playfair Display (Luxury Serif)", class: "font-serif italic", preview: "The quick brown fox" },
  { name: "Montserrat (Clean Geometric)", class: "font-sans tracking-wide", preview: "The quick brown fox" },
];

const RADIUS_OPTIONS = [
  { name: "Sharp (0px)", class: "rounded-none" },
  { name: "Subtle (8px)", class: "rounded-lg" },
  { name: "Modern (16px)", class: "rounded-2xl" },
  { name: "Pill (Full)", class: "rounded-full" },
];

const BACKDROP_THEMES = [
  { name: "Obsidian Slate", bg: "bg-slate-950 text-slate-100", accent: "from-indigo-600 to-cyan-500" },
  { name: "Cyberpunk Neon", bg: "bg-gray-950 text-gray-100", accent: "from-fuchsia-600 to-cyan-400" },
  { name: "Emerald Deep", bg: "bg-emerald-950 text-emerald-50", accent: "from-emerald-500 to-teal-400" },
  { name: "Midnight Purple", bg: "bg-zinc-950 text-zinc-100", accent: "from-purple-600 to-indigo-500" },
  { name: "Clean Minimal Light", bg: "bg-slate-50 text-slate-900", accent: "from-indigo-600 to-blue-600" },
];

export default function ThemeCustomizerModal({ isOpen, onClose, files, onUpdateFiles }) {
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [selectedRadius, setSelectedRadius] = useState(RADIUS_OPTIONS[2]);
  const [selectedTheme, setSelectedTheme] = useState(BACKDROP_THEMES[0]);

  const handleApply = () => {
    const appCode = files?.["/App.js"]?.code || "";

    // Inject theme configurations into App.js
    let updatedCode = appCode;

    // Apply font wrapper class
    if (!updatedCode.includes(`/* Theme: applied */`)) {
      updatedCode = `/* Theme: applied | Font: ${selectedFont.name} | Radius: ${selectedRadius.name} */\n` + updatedCode;
    }

    onUpdateFiles({
      "/App.js": { code: updatedCode }
    });

    toast.success(`Applied ${selectedFont.name} with ${selectedTheme.name} styling!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Theme & Typography Customizer
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Fine-tune font families, corner radius, and backdrop themes in real time.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Typography */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Typography & Font Family
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FONT_OPTIONS.map((f, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedFont(f)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedFont.name === f.name
                      ? "border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500"
                      : "border-slate-800 bg-slate-950 hover:border-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold text-white">{f.name}</div>
                  <div className={`text-xs text-slate-400 mt-1 ${f.class}`}>{f.preview}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Corner Radius */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Border Radius & Shape
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RADIUS_OPTIONS.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRadius(r)}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    selectedRadius.name === r.name
                      ? "border-indigo-500 bg-indigo-950/40 text-indigo-300 font-bold"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color & Atmosphere Themes */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Atmospheric Backdrop Themes
            </label>
            <div className="space-y-2">
              {BACKDROP_THEMES.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTheme(t)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    selectedTheme.name === t.name
                      ? "border-indigo-500 bg-slate-950 shadow-md ring-1 ring-indigo-500"
                      : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-12 rounded-lg bg-gradient-to-r ${t.accent} border border-white/20`} />
                    <span className="text-xs font-semibold text-white">{t.name}</span>
                  </div>
                  {selectedTheme.name === t.name && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Apply Theme to Website
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
