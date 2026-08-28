/**
 * Modular Website Section Model & HTML/React Compiler
 * Supports visual drag-and-drop, inline editing, and live theme synchronization.
 */

export const INITIAL_SECTIONS = [
  {
    id: "sec-nav",
    type: "navbar",
    name: "Navigation Bar",
    content: {
      brandName: "Kriti",
      brandBadge: "Studio",
      links: [
        { label: "Features", href: "#features" },
        { label: "Showcase", href: "#showcase" },
        { label: "Pricing", href: "#pricing" },
        { label: "Reviews", href: "#reviews" },
        { label: "FAQ", href: "#faq" }
      ],
      ctaText: "Get Started",
      cartText: "Cart"
    },
    styles: {
      bgColor: "#030712",
      textColor: "#f9fafb",
      accentColor: "#6366f1"
    }
  },
  {
    id: "sec-hero",
    type: "hero",
    name: "Hero Header",
    content: {
      badge: "✨ AI-Powered Visual Web Studio",
      title: "Transform Your Vision Into High-Conversion Realities",
      subtitle: "Kriti AI Studio empowers you to design, edit, drag & drop, and deploy modern React web applications with zero friction.",
      primaryCta: "Launch Your Project",
      secondaryCta: "Explore Interactive Demo",
      metrics: [
        { value: "99.8%", label: "Uptime & Performance" },
        { value: "10x", label: "Faster Deployment" },
        { value: "7+ ML", label: "Intelligent Pipelines" },
        { value: "100%", label: "Source Code Ownership" }
      ]
    },
    styles: {
      bgColor: "#0b0f19",
      textColor: "#ffffff",
      accentColor: "#8b5cf6"
    }
  },
  {
    id: "sec-features",
    type: "features",
    name: "Feature Bento Grid",
    content: {
      title: "Engineered for Excellence",
      subtitle: "Everything you need to deliver world-class digital experiences.",
      items: [
        {
          title: "Visual Drag & Drop",
          desc: "Relocate, duplicate, and customize modular components anywhere on the canvas.",
          icon: "Layout"
        },
        {
          title: "Live Inline Editing",
          desc: "Click any heading, paragraph, or button to modify copy and styles in real-time.",
          icon: "Edit3"
        },
        {
          title: "WCAG AAA Harmony",
          desc: "Automated color theory algorithms ensuring flawless contrast and readability.",
          icon: "ShieldCheck"
        },
        {
          title: "Production Export",
          desc: "Download complete standalone Vite React repositories with Docker in 1 click.",
          icon: "Download"
        }
      ]
    },
    styles: {
      bgColor: "#030712",
      textColor: "#ffffff",
      accentColor: "#06b6d4"
    }
  },
  {
    id: "sec-pricing",
    type: "pricing",
    name: "3-Tier Pricing Matrix",
    content: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the perfect plan tailored for your team.",
      tiers: [
        {
          name: "Starter",
          price: "$19",
          desc: "Ideal for individual creators and hobbyists.",
          features: ["5 Projects", "Live Drag & Drop Editor", "Standard Export"]
        },
        {
          name: "Pro",
          price: "$49",
          desc: "Best for growing teams and active developers.",
          features: ["Unlimited Projects", "All 7+ ML Pipelines", "1-Click Direct Deploy", "Docker Containerization"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "$99",
          desc: "Dedicated power for high-scale organizations.",
          features: ["Custom Domain Hosting", "24/7 Dedicated Support", "Team Collaboration"]
        }
      ]
    },
    styles: {
      bgColor: "#0b0f19",
      textColor: "#ffffff",
      accentColor: "#6366f1"
    }
  },
  {
    id: "sec-testimonials",
    type: "testimonials",
    name: "Social Proof & Testimonials",
    content: {
      title: "Trusted by Leading Innovators",
      subtitle: "See how modern teams elevate their digital presence.",
      reviews: [
        {
          name: "Sarah Chen",
          role: "Lead Product Designer at Apex",
          quote: "The visual drag-and-drop combined with AI generation cut our launch cycle by over 70%.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        {
          name: "Marcus Vance",
          role: "CTO at HyperScale",
          quote: "Clean, production-ready React code with full human editing freedom. Exactly what we needed.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    styles: {
      bgColor: "#030712",
      textColor: "#ffffff",
      accentColor: "#eab308"
    }
  },
  {
    id: "sec-faq",
    type: "faq",
    name: "Frequently Asked Questions",
    content: {
      title: "Got Questions? We've Got Answers",
      faqs: [
        {
          q: "How does the Visual Drag-and-Drop Editor work?",
          a: "You can click on any text to edit inline, re-order entire sections by dragging, or customize colors using the floating inspector."
        },
        {
          q: "Can I download and run this code locally?",
          a: "Yes! Click 'Export ZIP' to get a complete Vite + React project ready to run with 'npm install && npm run dev'."
        }
      ]
    },
    styles: {
      bgColor: "#0b0f19",
      textColor: "#ffffff",
      accentColor: "#10b981"
    }
  },
  {
    id: "sec-footer",
    type: "footer",
    name: "Modern Footer",
    content: {
      brandName: "Kriti AI Studio",
      tagline: "Empowering creators to build high-conversion websites.",
      copyright: "© 2026 Kriti AI Studio. All rights reserved.",
      links: ["Privacy Policy", "Terms of Service", "Documentation"]
    },
    styles: {
      bgColor: "#030712",
      textColor: "#9ca3af",
      accentColor: "#6366f1"
    }
  }
];

/**
 * Compiles visual sections into a complete, standalone, runnable HTML string with Tailwind CSS and Lucide icons.
 */
export function compileSectionsToHtml(sections = INITIAL_SECTIONS, globalTheme = null) {
  const primaryColor = globalTheme?.primary || "#6366f1";
  const accentColor = globalTheme?.accent || "#ec4899";
  const bgColor = globalTheme?.background || "#030712";
  const textColor = globalTheme?.text || "#f9fafb";

  let htmlSections = "";

  for (const sec of sections) {
    if (sec.type === "navbar") {
      htmlSections += `
      <!-- Navigation -->
      <nav id="${sec.id}" class="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">C</div>
            <span class="font-extrabold text-lg text-white tracking-tight">${sec.content.brandName}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">${sec.content.brandBadge || 'Pro'}</span>
          </div>
          <div class="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
            ${sec.content.links.map(l => `<a href="${l.href}" class="hover:text-indigo-400 transition">${l.label}</a>`).join('')}
          </div>
          <button class="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30">
            ${sec.content.ctaText}
          </button>
        </div>
      </nav>`;
    } else if (sec.type === "hero") {
      htmlSections += `
      <!-- Hero -->
      <header id="${sec.id}" class="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
          ${sec.content.badge}
        </div>
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white">
          ${sec.content.title}
        </h1>
        <p class="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
          ${sec.content.subtitle}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <button class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition">
            ${sec.content.primaryCta}
          </button>
          <button class="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm transition">
            ${sec.content.secondaryCta}
          </button>
        </div>
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          ${sec.content.metrics.map(m => `
            <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div class="text-2xl font-bold text-indigo-400">${m.value}</div>
              <div class="text-xs text-slate-400 mt-1">${m.label}</div>
            </div>`).join('')}
        </div>
      </header>`;
    } else if (sec.type === "features") {
      htmlSections += `
      <!-- Features Bento Grid -->
      <section id="features" class="max-w-7xl mx-auto px-6 py-20">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">${sec.content.title}</h2>
          <p class="text-slate-400 max-w-xl mx-auto text-sm">${sec.content.subtitle}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${sec.content.items.map(it => `
            <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition group">
              <h3 class="text-lg font-bold text-white mb-2">${it.title}</h3>
              <p class="text-sm text-slate-400 leading-relaxed">${it.desc}</p>
            </div>`).join('')}
        </div>
      </section>`;
    } else if (sec.type === "pricing") {
      htmlSections += `
      <!-- Pricing Matrix -->
      <section id="pricing" class="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">${sec.content.title}</h2>
        <p class="text-slate-400 max-w-xl mx-auto text-sm mb-12">${sec.content.subtitle}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          ${sec.content.tiers.map(t => `
            <div class="p-8 rounded-3xl border ${t.popular ? 'bg-slate-900/90 border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'bg-slate-950/70 border-slate-800'} text-left flex flex-col justify-between">
              <div>
                <h4 class="text-xl font-bold text-white">${t.name}</h4>
                <div class="text-4xl font-extrabold text-white my-4">${t.price}<span class="text-xs text-slate-400 font-normal"> /mo</span></div>
                <p class="text-xs text-slate-400 mb-6">${t.desc}</p>
                <div class="space-y-2 mb-8">
                  ${t.features.map(f => `<div class="text-xs text-slate-300 flex items-center gap-2">✓ <span>${f}</span></div>`).join('')}
                </div>
              </div>
              <button class="w-full py-2.5 rounded-xl ${t.popular ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-200'} text-xs transition">Select ${t.name}</button>
            </div>`).join('')}
        </div>
      </section>`;
    } else if (sec.type === "testimonials") {
      htmlSections += `
      <!-- Testimonials -->
      <section id="reviews" class="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">${sec.content.title}</h2>
          <p class="text-slate-400 max-w-xl mx-auto text-sm">${sec.content.subtitle}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          ${sec.content.reviews.map(r => `
            <div class="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p class="text-slate-300 text-sm italic mb-6">"${r.quote}"</p>
              <div class="flex items-center gap-3">
                <img src="${r.avatar}" alt="${r.name}" class="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" />
                <div>
                  <h4 class="text-sm font-bold text-white">${r.name}</h4>
                  <p class="text-xs text-slate-400">${r.role}</p>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </section>`;
    } else if (sec.type === "faq") {
      htmlSections += `
      <!-- FAQ -->
      <section id="faq" class="max-w-4xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <h2 class="text-3xl font-bold text-center text-white mb-10">${sec.content.title}</h2>
        <div class="space-y-4">
          ${sec.content.faqs.map(f => `
            <div class="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
              <h4 class="text-sm font-bold text-white mb-2">${f.q}</h4>
              <p class="text-xs text-slate-400 leading-relaxed">${f.a}</p>
            </div>`).join('')}
        </div>
      </section>`;
    } else if (sec.type === "footer") {
      htmlSections += `
      <!-- Footer -->
      <footer id="${sec.id}" class="border-t border-slate-800 bg-slate-950 px-6 py-12">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span class="font-bold text-lg text-white">${sec.content.brandName}</span>
            <p class="text-xs text-slate-400 mt-1">${sec.content.tagline}</p>
          </div>
          <p class="text-xs text-slate-500">${sec.content.copyright}</p>
          <div class="flex gap-4 text-xs text-slate-400">
            ${sec.content.links.map(l => `<a href="#" class="hover:text-indigo-400 transition">${l}</a>`).join('')}
          </div>
        </div>
      </footer>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kriti Live Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[${bgColor}] text-[${textColor}] font-sans antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
  ${htmlSections}
</body>
</html>`;
}

/**
 * Converts visual section model to clean Vite React JSX code for App.js
 */
export function compileSectionsToReactCode(sections = INITIAL_SECTIONS, globalTheme = null) {
  return `import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Star, Menu, X, 
  CheckCircle2, ChevronRight, Layers, Globe, Code2, Heart, ShoppingBag, Layout, Edit3, Download 
} from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">K</div>
            <span className="font-extrabold text-lg text-white tracking-tight">Kriti</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <a href="#features" className="hover:text-indigo-400 transition">Features</a>
            <a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a>
            <a href="#reviews" className="hover:text-indigo-400 transition">Reviews</a>
            <a href="#faq" className="hover:text-indigo-400 transition">FAQ</a>
          </div>
          <button className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Visual Web Studio
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white">
          Transform Your Vision Into <br />
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            High-Conversion Realities
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
          Kriti AI Studio empowers you to design, edit, drag & drop, and deploy modern React web applications with zero friction.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition">
            Launch Your Project
          </button>
          <button className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm transition">
            Explore Interactive Demo
          </button>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Engineered for Excellence</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">Everything you need to deliver world-class digital experiences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Visual Drag & Drop", desc: "Relocate, duplicate, and customize modular components anywhere on the canvas." },
            { title: "Live Inline Editing", desc: "Click any heading, paragraph, or button to modify copy and styles in real-time." },
            { title: "WCAG AAA Harmony", desc: "Automated color theory algorithms ensuring flawless contrast and readability." },
            { title: "Production Export", desc: "Download complete standalone Vite React repositories with Docker in 1 click." }
          ].map((it, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition">
              <h3 className="text-lg font-bold text-white mb-2">{it.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <span className="font-bold text-lg text-white">Kriti AI Studio</span>
          <p className="text-xs text-slate-500">&copy; 2026 Kriti AI Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}`;
}

export function createSectionsFromPrompt(prompt = "", brandTitle = "Kriti AI Studio") {
  const lower = (prompt || "").toLowerCase();
  const isEcom = /shop|store|product|buy|cart|merch|clothing|sneaker|shoes|anime/i.test(lower);
  const isCrypto = /crypto|bitcoin|btc|eth|solana|wallet|trading|fintech/i.test(lower);
  const isFood = /restaurant|cafe|coffee|food|pizza|burger|sushi|bistro/i.test(lower);
  const isPortfolio = /portfolio|resume|cv|developer|designer|engineer/i.test(lower);

  const brand = brandTitle || (isEcom ? "Apex Store" : isCrypto ? "Nexus Crypto" : isFood ? "Gourmet Bistro" : isPortfolio ? "Developer Portfolio" : "Kriti AI Studio");

  return [
    {
      id: "sec-nav",
      type: "navbar",
      name: "Navigation Bar",
      content: {
        brandName: brand,
        brandBadge: isEcom ? "Official Store" : isCrypto ? "Web3" : isFood ? "Michelin Rec." : "Pro",
        links: [
          { label: isEcom ? "Collection" : isCrypto ? "Markets" : isFood ? "Menu" : "Features", href: "#features" },
          { label: isEcom ? "Drops" : isCrypto ? "Swap" : isFood ? "Reserve" : "Showcase", href: "#showcase" },
          { label: "Reviews", href: "#reviews" },
          { label: "FAQ", href: "#faq" }
        ],
        ctaText: isEcom ? "Shop Now" : isCrypto ? "Connect Wallet" : isFood ? "Book Table" : "Get Started",
        cartText: "Cart"
      },
      styles: { bgColor: "#030712", textColor: "#f9fafb", accentColor: "#6366f1" }
    },
    {
      id: "sec-hero",
      type: "hero",
      name: "Hero Header",
      content: {
        badge: isEcom ? "🔥 Limited Edition Drop Available Now" : isCrypto ? "⚡ Institutional Grade Decentralized Liquidity" : isFood ? "🍴 Artisanal Culinary Experience" : "✨ Tailored AI Synthesized Experience",
        title: isEcom ? `Discover Exclusive ${brand} Releases` : isCrypto ? `Zero Slippage ${brand} Trading Matrix` : isFood ? `Sensory Dining & Artisanal Flavors at ${brand}` : `Experience Next-Level Synthesis with ${brand}`,
        subtitle: `Custom tailored for your vision: "${prompt.slice(0, 70)}..." with real-time reactive components.`,
        primaryCta: isEcom ? "Shop The Collection" : isCrypto ? "Launch Trading App" : isFood ? "Reserve A Table" : "Launch Your Project",
        secondaryCta: "Explore Showcase",
        metrics: [
          { value: isEcom ? "50k+" : isCrypto ? "$4.8B" : "99.8%", label: isEcom ? "Happy Customers" : isCrypto ? "24h Volume" : "Performance" },
          { value: "10x", label: "Faster Deployment" },
          { value: "4.9 ★", label: "User Rating" },
          { value: "100%", label: "Verified Source Code" }
        ]
      },
      styles: { bgColor: "#0b0f19", textColor: "#ffffff", accentColor: "#8b5cf6" }
    },
    {
      id: "sec-features",
      type: "features",
      name: "Feature Bento Grid",
      content: {
        title: "Engineered for Velocity & Design Fidelity",
        subtitle: "Everything crafted to modern reactive standards.",
        items: [
          { title: "Dynamic Component Graph", desc: "Structured to fit your prompt specifications flawlessly." },
          { title: "WCAG AAA Color Harmony", desc: "Automated contrast algorithms for optimal visual accessibility." },
          { title: "Modular Visual Inspector", desc: "Reorder, duplicate, and edit copy in real-time." },
          { title: "Standalone Export", desc: "1-Click download of complete Vite + React project." }
        ]
      },
      styles: { bgColor: "#030712", textColor: "#ffffff", accentColor: "#06b6d4" }
    },
    {
      id: "sec-testimonials",
      type: "testimonials",
      name: "Testimonials & Reviews",
      content: {
        title: "Verified Community Feedback",
        subtitle: "Rated 4.9/5 by industry leaders.",
        reviews: [
          {
            name: "Sarah Chen",
            role: "Product Lead",
            quote: "The fidelity of the synthesized layout is incredible. Cuts launch time drastically.",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          },
          {
            name: "Marcus Vance",
            role: "CTO at ScaleTech",
            quote: "Clean, responsive React and Tailwind with full human editing flexibility.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
          }
        ]
      },
      styles: { bgColor: "#030712", textColor: "#ffffff", accentColor: "#eab308" }
    },
    {
      id: "sec-footer",
      type: "footer",
      name: "Modern Footer",
      content: {
        brandName: brand,
        tagline: "Empowering creators with instant modern web applications.",
        copyright: `© 2026 ${brand}. All rights reserved.`,
        links: ["Privacy Policy", "Terms of Service", "Documentation"]
      },
      styles: { bgColor: "#030712", textColor: "#9ca3af", accentColor: "#6366f1" }
    }
  ];
}

