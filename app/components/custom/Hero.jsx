"use client";
import React, { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { UserContext } from "../../context/UserContext";
import { 
  ArrowRight, Loader2Icon, Mic, Sparkles, Wand2, ShieldCheck, 
  Palette, Eye, Zap, Layers, LayoutTemplate, Play, Code2, 
  Cpu, Rocket, CheckCircle2, ChevronRight, Activity, Globe, Download
} from "lucide-react";
import SignInPopUp from "./SignInPopUp";
import TemplateGalleryModal from "./TemplateGalleryModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import uuid4 from "uuid4";
import axios from "axios";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion.jsx";

function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTemplates, setOpenTemplates] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const { setMessages } = useContext(MessageContext);
  const { user } = useContext(UserContext);

  const examplePrompts = [
    { key: 1, prompt: "Build an Anime Merchandise Cyberpunk Store with Live Cart", tag: "E-Commerce", color: "from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-300" },
    { key: 2, prompt: "Build a Modern AI SaaS Landing Page with Bento Grid & Pricing", tag: "SaaS / B2B", color: "from-indigo-500/20 to-cyan-500/20 border-indigo-500/30 text-indigo-300" },
    { key: 3, prompt: "Create a Luxury Watch Brand Showcase with 3D-feel Gallery", tag: "Luxury", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300" },
    { key: 4, prompt: "Build a Senior Full-Stack Developer Portfolio with Terminal", tag: "Portfolio", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300" },
    { key: 5, prompt: "Build a FinTech Crypto Investment Dashboard with Charts", tag: "FinTech", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300" },
  ];

  const showcaseApps = [
    {
      title: "Nebula AI • Cloud SaaS Platform",
      tag: "SaaS Platform",
      tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      description: "Dark-mode Bento grid, interactive pricing toggle, live telemetry metrics, and AI workflow visualizer.",
      prompt: "Create a modern AI SaaS landing page with dark theme, bento feature grid, and transparent pricing",
      previewGradient: "from-indigo-900/60 via-slate-900/80 to-purple-900/40",
      stats: ["4.9★ UX Rating", "WCAG AAA", "Responsive"],
    },
    {
      title: "Kuro • Cyberpunk Streetwear Merch",
      tag: "E-Commerce",
      tagColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
      description: "High-contrast neon catalog, interactive size picker, cart drawer, and dynamic customer reviews.",
      prompt: "Build an Anime Merchandise E-Commerce Store with Dark Mode, interactive product catalog and cart",
      previewGradient: "from-fuchsia-900/60 via-slate-900/80 to-rose-900/40",
      stats: ["Instant Checkout", "Lucide Icons", "Vite Ready"],
    },
    {
      title: "Aether • Luxury Horology Showcase",
      tag: "Luxury Catalog",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      description: "Minimalist titanium aesthetic, curated timepiece gallery, specs comparison, and VIP consultation booking.",
      prompt: "Create a Luxury Watch Brand Showcase with Interactive Gallery and gold minimalist styling",
      previewGradient: "from-amber-900/60 via-slate-900/80 to-stone-900/40",
      stats: ["Precision Grid", "Parallax Vibe", "Tailwind 3"],
    },
    {
      title: "Nova • Senior Dev Portfolio & Lab",
      tag: "Interactive Portfolio",
      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      description: "Embedded interactive code sandbox, live GitHub activity simulator, skill badges, and contact modal.",
      prompt: "Create a Senior Full-Stack Developer Portfolio with Live Projects and interactive playground",
      previewGradient: "from-emerald-900/60 via-slate-900/80 to-teal-900/40",
      stats: ["Interactive", "Fast 60FPS", "Clean JSX"],
    }
  ];

  const exampleQnA = [
    { key: 1, question: "What makes Kriti AI Studio different from regular AI code generators?", answer: "Kriti executes a multi-pipeline architecture: Semantic Intent Classification, K-Means Color Harmonizer for WCAG AAA contrast, Multi-Modal Vision Wireframe synthesis, AST Self-Healing for zero build errors, and automated live Sandpack execution." },
    { key: 2, question: "Can I download and run the generated code locally on my machine?", answer: "Yes! Kriti includes a 1-click Standalone ZIP Exporter. You get a completely independent, production-ready Vite + React 18 repository configured with Tailwind CSS, Lucide icons, and package dependencies." },
    { key: 3, question: "How does the Multi-Modal Vision Wireframe feature work?", answer: "You can upload hand-drawn paper sketches, whiteboard drawings, or digital UI screenshots. Our Vision ML pipeline extracts component boundaries and translates visual geometry into clean, responsive React JSX." },
    { key: 4, question: "How do subscriptions and real-time payments work?", answer: "Kriti provides real-time PayPal payment integration. You can top up tokens on demand from the /pricing page, and token balances are credited instantly to your account with encrypted checkout." },
    { key: 5, question: "Can I customize the generated code visually without coding?", answer: "Yes! Kriti includes an interactive Visual Builder and Theme Studio allowing you to live-edit text, swap color harmonies, adjust typography, and rearrange sections with zero latency." }
  ];

  const onGenerate = async (input) => {
    if (!input.trim()) return;

    if (user && user?.tokens !== undefined && user?.tokens < 10) {
      toast.error("You don't have enough tokens to generate a response. Please upgrade your plan.");
      return;
    }

    try {
      setLoading(true);
      const msg = {
        role: "user",
        content: input.trim(),
      };

      setMessages([msg]);

      let workspaceId = uuid4();
      try {
        const res = await axios.post("/api/workspace/create", {
          messages: [msg],
          user: user?.id || user?._id || "creator-guest",
        });
        if (res.data?.workspaceId) {
          workspaceId = res.data.workspaceId;
        }
      } catch (err) {
        console.warn("Prisma workspace create fallback:", err);
      }

      router.push(`/workspace/${workspaceId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to initialize workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechClass();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";
      
      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        toast.info(`Voice captured: "${transcript}"`);
      };

      speechRecognition.onerror = () => setIsListening(false);
      speechRecognition.onend = () => setIsListening(false);

      setRecognition(speechRecognition);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        setIsListening(true);
        recognition.start();
        toast.info("Listening... Describe what website you want to build.");
      } catch (e) {
        setIsListening(false);
      }
    } else {
      toast.error("Speech recognition not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <div className="flex flex-col items-center w-full relative overflow-hidden">
      {/* Dynamic Ambient Glowing Orbs Background */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-[350px] left-[10%] w-[350px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[500px] right-[10%] w-[400px] h-[400px] bg-fuchsia-600/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section Container */}
      <div className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-14 pb-20">
        
        {/* Top Floating Announcement Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 text-indigo-300 text-xs font-semibold backdrop-blur-xl shadow-lg shadow-indigo-500/10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Pipeline AI Web Engineering Studio</span>
          </div>

          <button
            onClick={() => setOpenTemplates(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 text-xs font-semibold backdrop-blur-xl transition shadow-md shadow-fuchsia-500/10 cursor-pointer"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Explore Starter Blueprints</span>
          </button>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center font-extrabold tracking-tight mb-6 leading-[1.15] max-w-5xl">
          Build Full-Stack React Apps <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
            at the Speed of Thought
          </span>
        </h1>

        <p className="text-slate-300 text-center max-w-3xl text-base sm:text-lg mb-10 leading-relaxed font-normal">
          Turn natural language prompts, voice notes, or wireframe sketches into verified, responsive React web apps — complete with automated color harmonies, live code sandboxing, and 1-click Vite ZIP export.
        </p>

        {/* Main Glowing Interactive Prompt Box */}
        <div className="w-full max-w-3xl rounded-3xl p-3.5 bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl transition duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 mb-8 relative group">
          {/* Subtle glowing outline glow on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500 -z-10" />

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onGenerate(prompt);
              }
            }}
            className="bg-transparent outline-none w-full h-32 p-3 text-sm text-white placeholder-slate-400 resize-none font-medium leading-relaxed"
            placeholder="Describe what you want to build (e.g. 'Build an anime merchandise e-commerce platform with dark cyberpunk vibes, bento grid, and interactive cart drawer')..."
          />

          <div className="flex items-center justify-between pt-2 px-2 border-t border-slate-800/90">
            <div className="flex items-center gap-2">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                  isListening
                    ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                    : "bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
                title="Voice Prompting"
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">{isListening ? "Listening..." : "Voice Input"}</span>
              </button>

              <button
                onClick={() => setOpenTemplates(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
                title="Browse Templates"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-fuchsia-400" />
                <span className="hidden sm:inline">Templates</span>
              </button>
            </div>

            <button
              onClick={() => onGenerate(prompt)}
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/40 disabled:opacity-40 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Generate Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Curated Blueprints Quick Selector */}
        <div className="w-full max-w-4xl mb-24">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-slate-800" />
            <span>Or select a curated architectural blueprint</span>
            <span className="h-px w-8 bg-slate-800" />
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {examplePrompts.map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  setPrompt(p.prompt);
                  onGenerate(p.prompt);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border transition group cursor-pointer backdrop-blur-md ${p.color}`}
              >
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 font-mono font-bold">
                  {p.tag}
                </span>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                  {p.prompt}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive Showcase Gallery (Bento Preview Grid) */}
        <div className="w-full mb-28">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Generated Demos</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              What Kriti AI Studio Builds in Seconds
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Real React components synthesized through our coordinated ML pipelines with zero boilerplate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showcaseApps.map((app, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40 relative overflow-hidden"
              >
                {/* Background glow per card */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${app.previewGradient} blur-3xl opacity-30 rounded-full pointer-events-none -z-10 group-hover:opacity-60 transition`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${app.tagColor}`}>
                      {app.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {app.stats.map((s, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] font-medium text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                    {app.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {app.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Ready-to-run React App</span>
                  </div>

                  <button
                    onClick={() => {
                      setPrompt(app.prompt);
                      onGenerate(app.prompt);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <span>Launch & Remix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Key Metrics Bar */}
        <div className="w-full mb-28 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-2xl grid grid-cols-2 md:grid-cols-4 gap-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent font-mono">
              10,400+
            </span>
            <span className="text-xs text-slate-400 mt-1 font-medium">Web Apps Synthesized</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-pink-300 bg-clip-text text-transparent font-mono">
              99.8%
            </span>
            <span className="text-xs text-slate-400 mt-1 font-medium">AST Build Success Rate</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent font-mono">
              &lt; 2.8s
            </span>
            <span className="text-xs text-slate-400 mt-1 font-medium">Average Synthesis Speed</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent font-mono">
              AAA
            </span>
            <span className="text-xs text-slate-400 mt-1 font-medium">WCAG Color Harmony</span>
          </div>
        </div>

        {/* Coordinated ML Pipelines Deep-Dive */}
        <div className="w-full mb-28">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Engine Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              7 Specialized ML Pipelines
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Our models don't just generate text — they build, check, harmonize, and audit code in a closed-loop system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-indigo-500/50 transition">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Semantic Intent Synthesizer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Breaks down natural prompts into structural graphs, selecting optimal layouts, hero sections, and interactive micro-states.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-fuchsia-500/50 transition">
              <div className="p-3 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 w-fit mb-4">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">K-Means Color Harmonizer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts dominant brand colors, applying color theory algorithms to ensure mathematical WCAG AAA contrast ratios.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-cyan-500/50 transition">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Modal Vision Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts hand-drawn sketches, wireframes, and UI mockups directly into clean, responsive React JSX layouts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-emerald-500/50 transition">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AST Self-Healing Runtime</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parses AST trees on the fly to detect missing imports, tag mismatches, and syntax errors, correcting them before preview.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-amber-500/50 transition">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">NLP Sentiment & Copywriting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyzes readability, reading grade, and emotional tone, providing instant suggestions to increase conversion.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-rose-500/50 transition">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 w-fit mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1-Click Vite ZIP Packager</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Packages the entire project into a self-contained Vite React zip with all assets, configs, and Lucide icons ready for deployment.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step Creation Flow */}
        <div className="w-full mb-28 p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">How It Works in 3 Simple Steps</h2>
            <p className="text-slate-400 text-xs sm:text-sm">From idea to live deployable code in under 10 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-lg shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Describe or Sketch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Type your requirements, speak through voice input, or upload a paper wireframe sketch.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-pink-500 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-lg shadow-fuchsia-600/30">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">ML Synthesis & Polish</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                7 coordinated ML pipelines build components, calculate color harmony, and heal any runtime code.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-lg shadow-cyan-600/30">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Live Preview & Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interact with the live sandbox, edit visually with drag-and-drop, or export standalone Vite ZIP.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="w-full max-w-3xl mb-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to know about the platform and features.
            </p>
          </div>

          <div className="space-y-3">
            {exampleQnA.map((entry) => (
              <Accordion key={entry.key} type="single" collapsible className="bg-slate-900/80 border border-slate-800/90 rounded-2xl px-5 shadow-lg backdrop-blur-md">
                <AccordionItem value={`item-${entry.key}`} className="border-none">
                  <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition py-4">
                    {entry.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-400 leading-relaxed pt-1 pb-4">
                    {entry.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="w-full rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Build Your Next Website in Seconds?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Start with our intelligent multi-pipeline platform today. No credit card required to explore.
          </p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 transition cursor-pointer"
          >
            Start Prompting Now ⚡
          </button>
        </div>

        <SignInPopUp openDialog={openDialog} closeDialog={() => setOpenDialog(false)} />
        <TemplateGalleryModal isOpen={openTemplates} onClose={() => setOpenTemplates(false)} />
      </div>
    </div>
  );
}

export default Hero;

