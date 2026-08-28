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
  LayoutTemplate, Sparkles, ArrowRight, Check, 
  ShoppingBag, Cpu, Briefcase, Utensils, HeartPulse, CreditCard 
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import uuid4 from "uuid4";

export const STARTER_TEMPLATES = [
  {
    id: "ai-saas",
    title: "AI SaaS & Startup Platform",
    category: "SaaS",
    icon: Cpu,
    description: "Gradient glow hero, interactive bento feature matrix, 3-tier pricing calculator, and FAQ accordion.",
    badge: "Popular",
    palette: { primary: "#6366f1", accent: "#a855f7", background: "#0f172a" },
    samplePrompt: "Create a modern AI SaaS landing page with dark theme, bento feature grid, and transparent pricing"
  },
  {
    id: "luxury-ecommerce",
    title: "Luxury E-Commerce & Apparel",
    category: "E-Commerce",
    icon: ShoppingBag,
    description: "High-res product showcase cards, sticky navigation with cart count, discount ticker, and customer reviews.",
    badge: "Trending",
    palette: { primary: "#ec4899", accent: "#f59e0b", background: "#090d16" },
    samplePrompt: "Create a high-end streetwear and luxury sneakers ecommerce store with dark aesthetic"
  },
  {
    id: "fintech-crypto",
    title: "FinTech & Crypto Analytics",
    category: "FinTech",
    icon: CreditCard,
    description: "Real-time market charts, live transaction activity feed, portfolio stats, and secure wallet credentials.",
    badge: "High Conversion",
    palette: { primary: "#10b981", accent: "#06b6d4", background: "#051610" },
    samplePrompt: "Build a sleek FinTech investment and crypto trading analytics platform with emerald dark theme"
  },
  {
    id: "dev-portfolio",
    title: "Elite Developer & Designer Portfolio",
    category: "Portfolio",
    icon: Briefcase,
    description: "Interactive project cards with GitHub links, tech stack badges, experience timeline, and contact modal.",
    badge: "Career Ready",
    palette: { primary: "#3b82f6", accent: "#8b5cf6", background: "#0a0a0c" },
    samplePrompt: "Build a full-stack engineer portfolio with project showcase, skills grid, and resume download"
  },
  {
    id: "restaurant-cafe",
    title: "Gourmet Restaurant & Cafe",
    category: "Hospitality",
    icon: Utensils,
    description: "Chef specialty menu tabs, table reservation call-to-action, appetizing gallery, and food reviews.",
    badge: "New",
    palette: { primary: "#f97316", accent: "#eab308", background: "#1c120c" },
    samplePrompt: "Create an Italian fine dining restaurant website with online table booking and signature menu"
  },
  {
    id: "healthcare-clinic",
    title: "Healthcare & Wellness Clinic",
    category: "Medical",
    icon: HeartPulse,
    description: "Doctor credentials, medical specialties grid, patient testimonial cards, and appointment booking form.",
    badge: "Trust Verified",
    palette: { primary: "#0ea5e9", accent: "#14b8a6", background: "#071724" },
    samplePrompt: "Build a modern healthcare clinic website with doctor profiles and appointment scheduling"
  }
];

export default function TemplateGalleryModal({ isOpen, onClose, onSelectTemplate }) {
  const [selectedCat, setSelectedCat] = useState("All");
  const router = useRouter();

  const categories = ["All", "SaaS", "E-Commerce", "FinTech", "Portfolio", "Hospitality", "Medical"];

  const handleChoose = (tpl) => {
    if (onSelectTemplate) {
      onSelectTemplate(tpl);
    } else {
      // Direct navigation to workspace with template prompt
      const workspaceId = uuid4();
      router.push(`/workspace/${workspaceId}?prompt=${encodeURIComponent(tpl.samplePrompt)}`);
    }
    toast.success(`Selected "${tpl.title}" template!`);
    onClose();
  };

  const filtered = selectedCat === "All"
    ? STARTER_TEMPLATES
    : STARTER_TEMPLATES.filter(t => t.category === selectedCat);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Starter Website Templates
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Select a professionally curated starter layout to kickstart your web design immediately.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedCat === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {filtered.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                onClick={() => handleChoose(tpl)}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      {tpl.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                    {tpl.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition">
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
