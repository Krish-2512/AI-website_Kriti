"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  GripVertical, ArrowUp, ArrowDown, Trash2, Copy, Plus, 
  Monitor, Tablet, Smartphone, ExternalLink, Sparkles, 
  Sliders, Edit3, X, RefreshCw, Rocket, LayoutTemplate,
  Layers, CheckCircle2, Zap, ShieldCheck, Palette, Code2, PlusCircle,
  HelpCircle, CreditCard, MessageSquare, LayoutGrid, Check, MoveVertical
} from "lucide-react";
import { 
  INITIAL_SECTIONS, 
  createSectionsFromPrompt, 
  compileSectionsToReactCode 
} from "@/lib/defaultTemplate";
import { 
  SandpackProvider, 
  SandpackLayout 
} from "@codesandbox/sandpack-react";
import data from "../../../additional/data";
import SandpackPreviewClient from "./SandpackPreviewClient";
import DeployModal from "./DeployModal";
import TemplateGalleryModal from "./TemplateGalleryModal";
import ComponentLibraryModal from "./ComponentLibraryModal";
import { toast } from "sonner";
import axios from "axios";

export default function VisualBuilder({ 
  files, 
  setFiles, 
  workspaceId = "default", 
  currentPrompt = "", 
  projectTitle = "Craftly Website" 
}) {
  // Initialize sections tailored to user's current prompt/website
  const [sections, setSections] = useState(() => {
    if (currentPrompt || projectTitle) {
      return createSectionsFromPrompt(currentPrompt, projectTitle);
    }
    return INITIAL_SECTIONS;
  });

  const [activeSectionId, setActiveSectionId] = useState(null);
  const [viewMode, setViewMode] = useState("desktop"); // desktop | tablet | mobile
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [openDeploy, setOpenDeploy] = useState(false);
  const [openTemplates, setOpenTemplates] = useState(false);
  const [openComponents, setOpenComponents] = useState(false);
  const [isHealing, setIsHealing] = useState(false);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Adapt sections when prompt changes
  useEffect(() => {
    if (currentPrompt || projectTitle) {
      const dynamicSecs = createSectionsFromPrompt(currentPrompt, projectTitle);
      setSections(dynamicSecs);
      if (!activeSectionId && dynamicSecs.length > 0) {
        setActiveSectionId(dynamicSecs[0].id);
      }
    }
  }, [currentPrompt, projectTitle]);

  // Synchronize sections state with React files state
  const handleSectionsChange = (newSections, notifyMsg = null) => {
    setSections(newSections);
    const compiledCode = compileSectionsToReactCode(newSections);
    setFiles(prev => ({
      ...prev,
      "/App.js": { code: compiledCode }
    }));
    if (notifyMsg) {
      toast.success(notifyMsg);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...sections];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    handleSectionsChange(updated, `Moved "${movedItem.name}" to position ${targetIndex + 1}!`);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Move Section Up
  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    handleSectionsChange(next, `Moved "${temp.name}" up`);
  };

  // Move Section Down
  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    handleSectionsChange(next, `Moved "${temp.name}" down`);
  };

  // Duplicate Section
  const duplicateSection = (sec, index) => {
    const newSec = {
      ...JSON.parse(JSON.stringify(sec)),
      id: "sec-" + Date.now(),
      name: `${sec.name} (Copy)`
    };
    const next = [...sections];
    next.splice(index + 1, 0, newSec);
    handleSectionsChange(next, `Duplicated "${sec.name}"`);
  };

  // Delete Section
  const deleteSection = (id) => {
    if (sections.length <= 1) {
      toast.error("You must keep at least one section");
      return;
    }
    const target = sections.find(s => s.id === id);
    const next = sections.filter(s => s.id !== id);
    handleSectionsChange(next, `Deleted "${target?.name || 'Section'}"`);
    if (activeSectionId === id) {
      setActiveSectionId(next[0]?.id || null);
    }
  };

  // Add New Section
  const addSection = (type) => {
    let newSec;
    const timestamp = Date.now();

    if (type === "cta") {
      newSec = {
        id: `sec-cta-${timestamp}`,
        type: "cta",
        name: "Call to Action Banner",
        content: {
          badge: "🚀 Instant Acceleration",
          title: "Ready to Launch Your High-Performance Project?",
          subtitle: "Join visionary creators and launch your digital products today with 1-click simplicity.",
          primaryCta: "Claim Your Free Access",
          secondaryCta: "Schedule Live Demo"
        },
        styles: { bgColor: "#0f172a", textColor: "#ffffff", accentColor: "#6366f1" }
      };
    } else if (type === "bento") {
      newSec = {
        id: `sec-bento-${timestamp}`,
        type: "features",
        name: "Enterprise Bento Grid",
        content: {
          title: "Engineered for Velocity & Scale",
          subtitle: "High availability distributed edge architecture for global reliability.",
          items: [
            { title: "99.99% Uptime", desc: "Global edge routing guarantees uninterrupted client connectivity." },
            { title: "Sub-5ms Latency", desc: "Instant component hydration with zero runtime thread blocking." },
            { title: "100% Code Ownership", desc: "Full exportable React Vite source code ready for Docker." },
            { title: "WCAG AAA Ready", desc: "Automated color theory algorithms ensuring flawless contrast." }
          ]
        },
        styles: { bgColor: "#030712", textColor: "#ffffff", accentColor: "#a855f7" }
      };
    } else if (type === "testimonials") {
      newSec = {
        id: `sec-testimonials-${timestamp}`,
        type: "testimonials",
        name: "Social Proof & Reviews",
        content: {
          title: "Trusted by Visionary Teams Worldwide",
          subtitle: "Real verified feedback from industry leaders.",
          reviews: [
            {
              name: "Alex Rivera",
              role: "Founder, Vertex Labs",
              quote: "The velocity and polish we achieved using this architecture exceeded all our stakeholder expectations.",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            },
            {
              name: "Claire Dupont",
              role: "Lead Engineer, CloudScale",
              quote: "Hands down the cleanest generated React code with full accessibility compliance.",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            }
          ]
        },
        styles: { bgColor: "#030712", textColor: "#ffffff", accentColor: "#06b6d4" }
      };
    } else if (type === "pricing") {
      newSec = {
        id: `sec-pricing-${timestamp}`,
        type: "pricing",
        name: "3-Tier Pricing Matrix",
        content: {
          title: "Simple, Transparent Pricing",
          subtitle: "No hidden fees. Scale as you grow.",
          tiers: [
            { name: "Starter", price: "$19", desc: "For individual creators.", features: ["Single workspace", "Community support", "Standard export"] },
            { name: "Pro", price: "$49", desc: "For growing teams.", features: ["Unlimited workspaces", "Priority AI generation", "Docker CI/CD export"], popular: true },
            { name: "Enterprise", price: "$99", desc: "For large scale apps.", features: ["Dedicated instances", "Custom SLAs", "24/7 Phone support"] }
          ]
        },
        styles: { bgColor: "#030712", textColor: "#ffffff", accentColor: "#10b981" }
      };
    } else if (type === "faq") {
      newSec = {
        id: `sec-faq-${timestamp}`,
        type: "faq",
        name: "FAQ Accordion",
        content: {
          title: "Frequently Asked Questions",
          faqs: [
            { q: "How do I deploy this application?", a: "You can download the full Vite React ZIP directly and deploy to Vercel, Netlify, or AWS in 1 click." },
            { q: "Can I customize the Tailwind styling?", a: "Yes, every component utilizes standard Tailwind utility classes for effortless customization." },
            { q: "Is the source code fully owned by me?", a: "Yes, you have 100% code ownership with zero vendor lock-in." }
          ]
        },
        styles: { bgColor: "#030712", textColor: "#ffffff", accentColor: "#f59e0b" }
      };
    } else {
      newSec = {
        id: `sec-custom-${timestamp}`,
        type: "cta",
        name: "Custom Feature Block",
        content: {
          title: "Modular Feature Showcase",
          subtitle: "Tailored to deliver high-conversion user engagement.",
          primaryCta: "Get Started Now",
          secondaryCta: "Learn More"
        },
        styles: { bgColor: "#030712", textColor: "#ffffff", accentColor: "#6366f1" }
      };
    }

    const next = [...sections, newSec];
    setActiveSectionId(newSec.id);
    handleSectionsChange(next, `Added new "${newSec.name}"!`);
  };

  // Update Active Section Field
  const updateActiveSectionField = (field, value) => {
    if (!activeSectionId) return;
    const next = sections.map(s => {
      if (s.id === activeSectionId) {
        return {
          ...s,
          content: {
            ...s.content,
            [field]: value
          }
        };
      }
      return s;
    });
    handleSectionsChange(next);
  };

  // Quick Auto-Heal Handler
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
        toast.success("✨ AST syntax verified & self-healed!");
      }
    } catch (err) {
      toast.error("Auto-healing error: " + (err.response?.data?.error || err.message));
    } finally {
      setIsHealing(false);
    }
  };

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  const getContainerWidth = () => {
    if (viewMode === "mobile") return "max-w-[375px] h-[780px]";
    if (viewMode === "tablet") return "max-w-[768px] h-[820px]";
    return "w-full h-full";
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-none relative">
      {/* Top Visual Toolbar */}
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Viewport Selector & Quick Blueprint Library */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("desktop")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === "desktop" ? "bg-indigo-600 text-white font-semibold shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="Desktop Fullscreen (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Desktop</span>
            </button>

            <button
              onClick={() => setViewMode("tablet")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === "tablet" ? "bg-indigo-600 text-white font-semibold shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Tablet</span>
            </button>

            <button
              onClick={() => setViewMode("mobile")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === "mobile" ? "bg-indigo-600 text-white font-semibold shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="Mobile Responsive (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Mobile</span>
            </button>
          </div>

          <button
            onClick={() => setOpenComponents(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-300 hover:text-white transition cursor-pointer"
            title="Inject Pre-built Modular React Blocks"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Blocks Library</span>
          </button>

          <button
            onClick={() => setOpenTemplates(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Templates</span>
          </button>
        </div>

        {/* Right: Section Actions, Inspector, Preview & Live Deploy */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickHeal}
            disabled={isHealing}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-600/20 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Auto-heal JSX syntax & dependencies"
          >
            {isHealing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
            <span>Auto-Heal</span>
          </button>

          <button
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
              isInspectorOpen
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Section Inspector</span>
          </button>

          <button
            onClick={() => window.open(`/preview/${workspaceId || 'live'}`, "_blank")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            title="Direct Live Website Preview"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live URL</span>
          </button>

          <button
            onClick={() => setOpenDeploy(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            title="Deploy Live to Netlify / Vercel"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Deploy Live</span>
          </button>
        </div>
      </div>

      {/* Main Builder Area: Left Drag & Drop Reorder Panel + Center Live Sandpack Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Drag & Drop Panel */}
        <div className="w-80 bg-slate-900/95 border-r border-slate-800 flex flex-col p-3 overflow-y-auto shrink-0 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MoveVertical className="w-3.5 h-3.5 text-indigo-400" />
                <span>Drag &amp; Drop Reorder</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">{sections.length} Sections</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Drag handles or click &uarr; / &darr; to reorder website components in real-time.
            </p>
          </div>

          {/* Draggable Sections List */}
          <div className="space-y-1.5">
            {sections.map((sec, index) => {
              const isActive = sec.id === activeSectionId;
              const isBeingDragged = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <div
                  key={sec.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setIsInspectorOpen(true);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing flex items-center justify-between gap-2 select-none ${
                    isBeingDragged 
                      ? "opacity-40 border-dashed border-indigo-500 bg-indigo-950/20" 
                      : isOver
                      ? "border-indigo-400 bg-indigo-600/20 scale-[1.02]"
                      : isActive
                      ? "bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-600/10"
                      : "bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {index + 1}
                        </span>
                        <span className="truncate">{sec.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono tracking-tight">
                        {sec.type}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Move Up, Move Down, Duplicate, Delete */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === sections.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => duplicateSection(sec, index)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition"
                      title="Duplicate Section"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => deleteSection(sec.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 1-Click Add Section Palette */}
          <div className="pt-3 border-t border-slate-800/80">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add New Elements / Sections</span>
            </h5>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => addSection("cta")}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-left transition text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-indigo-400" />
                <span>+ CTA Banner</span>
              </button>

              <button
                onClick={() => addSection("bento")}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-fuchsia-500/40 text-left transition text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-fuchsia-400" />
                <span>+ Bento Grid</span>
              </button>

              <button
                onClick={() => addSection("testimonials")}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-cyan-400" />
                <span>+ Reviews</span>
              </button>

              <button
                onClick={() => addSection("pricing")}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>+ Pricing</span>
              </button>

              <button
                onClick={() => addSection("faq")}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-amber-400" />
                <span>+ FAQ Cards</span>
              </button>

              <button
                onClick={() => addSection("custom")}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-left transition text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>+ Custom Block</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Live Website Sandpack Canvas */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 overflow-y-auto relative">
          <div className={`${getContainerWidth()} transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col`}>
            {/* Viewport Frame Header */}
            <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-300">
                  {viewMode === "mobile" ? "Mobile View (375 × 780)" : viewMode === "tablet" ? "Tablet View (768 × 820)" : "Desktop Live Canvas (100%)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                React 18 &bull; Tailwind CSS
              </span>
            </div>

            {/* Sandpack Live Runner */}
            <div className="flex-1 overflow-hidden">
              <SandpackProvider
                key={files?.["/App.js"]?.code ? `vb-live-${files["/App.js"].code.length}` : "vb-init"}
                template="react"
                theme="dark"
                customSetup={{
                  dependencies: {
                    ...data.DEPENDANCY,
                  },
                }}
                files={files}
                options={{
                  externalResources: ["https://cdn.tailwindcss.com"],
                }}
              >
                <SandpackLayout style={{ height: "100%", border: "none", borderRadius: 0 }}>
                  <SandpackPreviewClient />
                </SandpackLayout>
              </SandpackProvider>
            </div>
          </div>

          {/* Floating Element Property Inspector */}
          {isInspectorOpen && activeSection && (
            <div className="absolute top-6 right-6 w-80 bg-slate-900/95 backdrop-blur-2xl border border-slate-700 rounded-2xl p-4 shadow-2xl z-30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Edit: {activeSection.name}</span>
                </div>
                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {activeSection.content?.title !== undefined && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Section Title / Heading
                    </label>
                    <input
                      type="text"
                      value={activeSection.content.title}
                      onChange={(e) => updateActiveSectionField("title", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {activeSection.content?.subtitle !== undefined && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Section Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={activeSection.content.subtitle}
                      onChange={(e) => updateActiveSectionField("subtitle", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                )}

                {activeSection.content?.primaryCta !== undefined && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={activeSection.content.primaryCta}
                      onChange={(e) => updateActiveSectionField("primaryCta", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {activeSection.content?.secondaryCta !== undefined && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Secondary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={activeSection.content.secondaryCta}
                      onChange={(e) => updateActiveSectionField("secondaryCta", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {activeSection.content?.badge !== undefined && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Top Pill Badge
                    </label>
                    <input
                      type="text"
                      value={activeSection.content.badge}
                      onChange={(e) => updateActiveSectionField("badge", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" /> Live Hot-Reload Active
                  </span>
                  <button
                    onClick={() => deleteSection(activeSection.id)}
                    className="text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Delete Section
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeployModal
        isOpen={openDeploy}
        onClose={() => setOpenDeploy(false)}
        files={files}
      />

      <TemplateGalleryModal
        isOpen={openTemplates}
        onClose={() => setOpenTemplates(false)}
      />

      <ComponentLibraryModal
        isOpen={openComponents}
        onClose={() => setOpenComponents(false)}
        files={files}
        onUpdateFiles={(updated) => setFiles(prev => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
