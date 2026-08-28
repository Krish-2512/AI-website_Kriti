"use client";
import React, { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { UserContext } from "../../context/UserContext";
import { ArrowRight, Loader2Icon, Mic, Sparkles, Wand2, ShieldCheck, Palette, Eye, Zap, Layers, LayoutTemplate } from "lucide-react";
import SignInPopUp from "./SignInPopUp";
import TemplateGalleryModal from "./TemplateGalleryModal";
import FlipCard from "./_components/flipCard";
import { useRouter } from "next/navigation";
import HighlightSection from "./_components/contents";
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
    { key: 1, prompt: "Make an Anime Merchandise E-Commerce Store with Dark Mode", tag: "E-Commerce" },
    { key: 2, prompt: "Build a Modern AI SaaS Landing Page with Bento Grid & Pricing", tag: "SaaS / B2B" },
    { key: 3, prompt: "Create a Luxury Watch Brand Showcase with Interactive Gallery", tag: "Luxury" },
    { key: 4, prompt: "Create a Senior Full-Stack Developer Portfolio with Live Projects", tag: "Portfolio" },
    { key: 5, prompt: "Build a FinTech Crypto Investment Dashboard with Charts", tag: "FinTech" },
  ];

  const exampleQnA = [
    { key: 1, question: "What makes Craftly ML Studio different?", answer: "Craftly combines multiple specialized ML pipelines — Semantic Intent Classification, WCAG Color Harmony, Multi-Modal Vision Wireframe synthesis, AST Self-Healing, and Automated a11y & SEO Quality Auditing." },
    { key: 2, question: "What technologies power this platform?", answer: "The application is built on Next.js 15, React 18, Tailwind CSS, PostgreSQL / SQLite with Prisma ORM, Sandpack in-browser live execution environment, and Google Gemini." },
    { key: 3, question: "Can I download and export the source code?", answer: "Yes! Craftly features 1-click standalone ZIP export, providing a ready-to-run Vite React repository complete with Tailwind, Lucide icons, and package configuration." },
    { key: 4, question: "Can I generate websites from paper wireframes or UI sketches?", answer: "Yes, our Multi-Modal Vision ML pipeline analyzes uploaded wireframe drawings and UI screenshots, automatically translating visual geometry into responsive React components." },
    { key: 5, question: "Is my data stored securely?", answer: "All workspace state, message history, and user preferences are securely managed in PostgreSQL / Prisma ORM with relational integrity." }
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
    <div className="flex flex-col items-center w-full px-4 sm:px-6 max-w-7xl mx-auto pt-16 pb-24">
      {/* Top ML Badge & Template Quick Button */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>7+ Intelligent ML Pipelines for Instant Web Creation</span>
        </div>

        <button
          onClick={() => setOpenTemplates(true)}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 text-xs font-semibold backdrop-blur-md transition shadow-md shadow-fuchsia-500/10 cursor-pointer"
        >
          <LayoutTemplate className="w-4 h-4 text-fuchsia-400" />
          <span>Browse Starter Templates</span>
        </button>
      </div>

      {/* Main Headlines */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
        Prompt, Harmonize, & Launch <br />
        <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Stunning React Web Apps
        </span>
      </h1>

      <p className="text-slate-400 text-center max-w-2xl text-base sm:text-lg mb-10 leading-relaxed">
        Craftly turns natural language, voice commands, or paper wireframe sketches into production-ready React applications with automated a11y scoring, color theory, and live visual editing.
      </p>

      {/* Main Interactive Prompt Box */}
      <div className="w-full max-w-3xl rounded-3xl p-3 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl transition focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onGenerate(prompt);
            }
          }}
          className="bg-transparent outline-none w-full h-32 p-3 text-sm text-white placeholder-slate-500 resize-none"
          placeholder="Describe what you want to build (e.g. 'Build an anime merchandise e-commerce platform with dark cyberpunk vibes and interactive cart')..."
        />

        <div className="flex items-center justify-between pt-2 px-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs ${
                isListening
                  ? "bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title="Voice Prompt"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">{isListening ? "Listening..." : "Voice"}</span>
            </button>

            <button
              onClick={() => setOpenTemplates(true)}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs"
              title="Starter Templates"
            >
              <LayoutTemplate className="w-4 h-4 text-fuchsia-400" />
              <span className="hidden sm:inline">Templates</span>
            </button>
          </div>

          <button
            onClick={() => onGenerate(prompt)}
            disabled={!prompt.trim() || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 disabled:opacity-40 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin" />
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <span>Generate Site</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Starter Prompts */}
      <div className="w-full max-w-3xl mb-20">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
          Or start with a curated blueprint:
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {examplePrompts.map((p) => (
            <button
              key={p.key}
              onClick={() => onGenerate(p.prompt)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition group cursor-pointer"
            >
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                {p.tag}
              </span>
              <span>{p.prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-ML Pipeline Feature Cards */}
      <div className="w-full mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Multi-ML Intelligence at Work</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            7 coordinated machine learning pipelines ensuring your web application looks and performs like an award winner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md hover:border-indigo-500/40 transition group">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Semantic Intent & Layout Synthesizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deconstructs natural language prompts into full component graphs, generating responsive Vite React structures with Tailwind CSS and Lucide icons.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md hover:border-fuchsia-500/40 transition group">
            <div className="p-3 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 w-fit mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Color Harmony & WCAG Contrast</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent color theory engine calculating harmonic palettes with verified AAA readability ratios and dynamic real-time theme injection.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md hover:border-cyan-500/40 transition group">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Modal Vision Wireframe Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accepts hand-drawn paper sketches, digital wireframes, or reference screenshots, synthesizing visual geometry directly into clean JSX.
            </p>
          </div>
        </div>
      </div>

      <HighlightSection />

      {/* FAQ Section */}
      <div className="w-full max-w-3xl my-20">
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {exampleQnA.map((entry) => (
            <Accordion key={entry.key} type="single" collapsible className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5">
              <AccordionItem value={`item-${entry.key}`} className="border-none">
                <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition">
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

      <SignInPopUp openDialog={openDialog} closeDialog={() => setOpenDialog(false)} />
      <TemplateGalleryModal isOpen={openTemplates} onClose={() => setOpenTemplates(false)} />
    </div>
  );
}

export default Hero;
