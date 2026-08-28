"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { 
  Layers, Plus, Check, Sparkles, LayoutGrid, 
  CreditCard, MessageSquare, HelpCircle, Mail 
} from "lucide-react";
import { toast } from "sonner";

const COMPONENT_PRESETS = [
  {
    id: "bento-metrics",
    name: "Interactive Bento Metrics Grid",
    category: "Features",
    icon: LayoutGrid,
    description: "4-card bento grid with gradient borders, statistics counters, and Lucide icons.",
    snippet: `
      {/* Injected Bento Metrics Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 col-span-2">
            <h3 className="text-xl font-bold text-white mb-2">99.9% Uptime SLA</h3>
            <p className="text-xs text-slate-400">High availability distributed edge architecture for global reliability.</p>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="text-3xl font-extrabold text-indigo-400">10x</div>
            <div className="text-xs text-slate-300 mt-1">Faster Velocity</div>
          </div>
          <div className="p-6 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-500/30">
            <div className="text-3xl font-extrabold text-fuchsia-400">100%</div>
            <div className="text-xs text-slate-300 mt-1">Code Ownership</div>
          </div>
        </div>
      </section>
`
  },
  {
    id: "pricing-matrix",
    name: "Interactive 3-Tier Pricing Matrix",
    category: "Conversion",
    icon: CreditCard,
    description: "Modern pricing tiers with monthly/annual toggle and feature checkmarks.",
    snippet: `
      {/* Injected Pricing Matrix */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
          {['Starter', 'Professional', 'Enterprise'].map((tier, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">{tier}</h4>
                <div className="text-3xl font-extrabold text-white my-3">\${i === 0 ? '19' : i === 1 ? '49' : '99'}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                <p className="text-xs text-slate-400 mb-4">Comprehensive suite of tools tailored for growing projects.</p>
              </div>
              <button className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">Choose {tier}</button>
            </div>
          ))}
        </div>
      </section>
`
  },
  {
    id: "testimonial-carousel",
    name: "Social Proof & Testimonial Showcase",
    category: "Trust",
    icon: MessageSquare,
    description: "Star ratings, verified customer quotes, and team avatars.",
    snippet: `
      {/* Injected Social Proof Showcase */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-8">Loved by Visionary Teams Worldwide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-300 italic mb-4">"The velocity and polish we achieved using this architecture exceeded all our stakeholder expectations."</p>
            <div className="font-bold text-xs text-white">Alex Rivera — Founder, Vertex Labs</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-300 italic mb-4">"Hands down the cleanest generated React code with full accessibility compliance."</p>
            <div className="font-bold text-xs text-white">Claire Dupont — Lead Engineer</div>
          </div>
        </div>
      </section>
`
  },
  {
    id: "faq-accordion",
    name: "Interactive FAQ Accordion",
    category: "Content",
    icon: HelpCircle,
    description: "Expandable questions and answers with subtle borders and smooth transitions.",
    snippet: `
      {/* Injected FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: "How do I deploy this application?", a: "You can download the full Vite React ZIP directly and deploy to Vercel, Netlify, or AWS in 1 click." },
            { q: "Can I customize the Tailwind styling?", a: "Yes, every component utilizes standard Tailwind utility classes for effortless customization." }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-bold text-white mb-1">{item.q}</div>
              <div className="text-xs text-slate-400">{item.a}</div>
            </div>
          ))}
        </div>
      </section>
`
  },
  {
    id: "contact-card",
    name: "Glassmorphic Contact & Lead Magnet",
    category: "Conversion",
    icon: Mail,
    description: "Form inputs with interactive submission state and gradient buttons.",
    snippet: `
      {/* Injected Contact & Lead Form */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Elevate Your Project?</h2>
          <p className="text-xs text-slate-400 mb-6">Join thousands of creators building high-conversion experiences.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500" />
            <button className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition">Get Started</button>
          </div>
        </div>
      </section>
`
  }
];

export default function ComponentLibraryModal({ isOpen, onClose, files, onUpdateFiles }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Features", "Conversion", "Trust", "Content"];

  const handleInject = (comp) => {
    const currentCode = files?.["/App.js"]?.code || "";

    // Find insertion point before final closing div or footer
    let updatedCode = currentCode;
    const lastClosingDiv = updatedCode.lastIndexOf("</div>");

    if (lastClosingDiv !== -1) {
      updatedCode = updatedCode.slice(0, lastClosingDiv) + comp.snippet + "\n    </div>" + updatedCode.slice(lastClosingDiv + 6);
    } else {
      updatedCode += comp.snippet;
    }

    onUpdateFiles({
      "/App.js": { code: updatedCode }
    });

    toast.success(`Injected "${comp.name}" into your website!`);
    onClose();
  };

  const filtered = selectedCategory === "All" 
    ? COMPONENT_PRESETS 
    : COMPONENT_PRESETS.filter(c => c.category === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                AI Component Blueprint Library
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Inject modular pre-built React + Tailwind sections into your website with 1-click.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Components List */}
        <div className="space-y-3 pt-2">
          {filtered.map((comp) => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{comp.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {comp.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{comp.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleInject(comp)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inject</span>
                </button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
