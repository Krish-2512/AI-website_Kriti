"use client";
import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, Palette, Eye, Type, Zap, 
  Download, RefreshCw, Layers, Sliders, LayoutTemplate, Activity, Brain, Users, Share2
} from "lucide-react";
import MLAuditModal from "./MLAuditModal";
import PaletteStudioModal from "./PaletteStudioModal";
import VisionUploadModal from "./VisionUploadModal";
import CopyOptimizerModal from "./CopyOptimizerModal";
import ThemeCustomizerModal from "./ThemeCustomizerModal";
import ComponentLibraryModal from "./ComponentLibraryModal";
import MLOpsTelemetryModal from "./MLOpsTelemetryModal";
import MLDeepDiveModal from "./MLDeepDiveModal";
import ShareToSpaceModal from "./ShareToSpaceModal";
import { downloadProjectZip } from "../../../lib/exportZip";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";

export default function MLToolbar({ files, setFiles, currentPrompt = "", projectTitle = "Kriti App" }) {
  const params = useParams();
  const workspaceId = params?.workspaceId || "default";
  const [openAudit, setOpenAudit] = useState(false);
  const [openPalette, setOpenPalette] = useState(false);
  const [openVision, setOpenVision] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);
  const [openComponents, setOpenComponents] = useState(false);
  const [openShareSpace, setOpenShareSpace] = useState(false);
  const [openTelemetry, setOpenTelemetry] = useState(false);
  const [openDeepDive, setOpenDeepDive] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);


  // Quick 1-Click Auto-Heal Handler
  const handleQuickHeal = async () => {
    try {
      setIsHealing(true);
      const appCode = files?.["/App.js"]?.code || "";
      const res = await axios.post("/api/ml/self-heal", {
        code: appCode,
        errorMessage: "Verify all imports, Lucide icons, and React JSX balance."
      });

      if (res.data?.files) {
        setFiles(prev => ({ ...prev, ...res.data.files }));
        toast.success("✨ Code automatically healed and verified!");
      }
    } catch (err) {
      toast.error("Auto-healing error: " + (err.response?.data?.error || err.message));
    } finally {
      setIsHealing(false);
    }
  };

  // Instant ZIP Download Handler
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadProjectZip(files, projectTitle);
      toast.success("📦 Complete React Vite + Docker repository ZIP downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ZIP");
    } finally {
      setIsZipping(false);
    }
  };

  // Apply Palette Callback
  const handleApplyPalette = (palette) => {
    const appCode = files?.["/App.js"]?.code || "";
    const updatedCode = `/* ML Palette: ${palette.name} | Primary: ${palette.primary} | Accent: ${palette.accent} */\n` + appCode;
    setFiles(prev => ({
      ...prev,
      "/App.js": { code: updatedCode }
    }));
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-xs">
        {/* Left: ML Pipeline Status & Studio Tools */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
          <button
            onClick={() => setOpenDeepDive(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-bold transition shadow-sm"
            title="Inspect Real Naive Bayes, K-Means Clustering & NLP Sentiment Models"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Neural Models Studio</span>
          </button>

          <button
            onClick={() => setOpenTelemetry(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 font-semibold transition"
            title="Inspect MLOps Metrics & Stage Latencies"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>MLOps Telemetry</span>
          </button>

          <button
            onClick={() => setOpenAudit(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 transition"
            title="Run UI/UX, a11y & SEO Quality Audit"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Audit</span>
          </button>

          <button
            onClick={() => setOpenPalette(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 text-fuchsia-300 transition"
            title="Intelligent Color Harmony Studio"
          >
            <Palette className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Palette</span>
          </button>

          <button
            onClick={() => setOpenTheme(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition"
            title="Theme & Typography Customizer"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Theme/Font</span>
          </button>

          <button
            onClick={() => setOpenComponents(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 transition"
            title="Inject Pre-built Modular React Sections"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" />
            <span>Blocks</span>
          </button>

          <button
            onClick={() => setOpenVision(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition"
            title="Upload Sketch or Wireframe Image"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Vision Sketch</span>
          </button>

          <button
            onClick={() => setOpenCopy(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition"
            title="AI Copywriting & Conversion Engine"
          >
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Copy</span>
          </button>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenShareSpace(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition shadow-sm"
            title="Publish to Collaborative Team Space"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Share to Space</span>
          </button>

          <button
            onClick={handleQuickHeal}
            disabled={isHealing}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 transition disabled:opacity-50"
            title="Automated Syntax & Import Self-Heal"
          >
            {isHealing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-indigo-400" />}
            <span>Auto Heal</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            title="Download Complete Standalone React Project ZIP with Docker & CI/CD"
          >
            {isZipping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Export ZIP</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ShareToSpaceModal
        isOpen={openShareSpace}
        onClose={() => setOpenShareSpace(false)}
        workspaceId={workspaceId}
        projectTitle={projectTitle}
      />
      <MLDeepDiveModal
        isOpen={openDeepDive}
        onClose={() => setOpenDeepDive(false)}
        currentPrompt={currentPrompt}
        files={files}
      />

      <MLOpsTelemetryModal
        isOpen={openTelemetry}
        onClose={() => setOpenTelemetry(false)}
      />

      <MLAuditModal
        isOpen={openAudit}
        onClose={() => setOpenAudit(false)}
        files={files}
        onApplyFix={(fixedFiles) => setFiles(prev => ({ ...prev, ...fixedFiles }))}
      />

      <PaletteStudioModal
        isOpen={openPalette}
        onClose={() => setOpenPalette(false)}
        currentPrompt={currentPrompt}
        onSelectPalette={handleApplyPalette}
      />

      <ThemeCustomizerModal
        isOpen={openTheme}
        onClose={() => setOpenTheme(false)}
        files={files}
        onUpdateFiles={(updated) => setFiles(prev => ({ ...prev, ...updated }))}
      />

      <ComponentLibraryModal
        isOpen={openComponents}
        onClose={() => setOpenComponents(false)}
        files={files}
        onUpdateFiles={(updated) => setFiles(prev => ({ ...prev, ...updated }))}
      />

      <VisionUploadModal
        isOpen={openVision}
        onClose={() => setOpenVision(false)}
        onGeneratedCode={(newFiles) => setFiles(prev => ({ ...prev, ...newFiles }))}
      />

      <CopyOptimizerModal
        isOpen={openCopy}
        onClose={() => setOpenCopy(false)}
        currentPrompt={currentPrompt}
      />
    </>
  );
}

