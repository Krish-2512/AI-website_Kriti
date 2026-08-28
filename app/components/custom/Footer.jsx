"use client";
import React from "react";
import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin, MessageSquare, ShieldCheck, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-6 sm:px-12 lg:px-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Brand & Mission */}
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Kriti AI Studio</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-5">
            Intelligent multi-pipeline AI web engineering platform transforming natural language prompts and wireframe sketches into production-ready React applications.
          </p>

          <div className="flex items-center gap-3 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-indigo-500/50 transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-indigo-500/50 transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-indigo-500/50 transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-indigo-400 transition">AI Web Generator</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-400 transition">Subscription & Pricing</Link></li>
              <li><Link href="/" className="hover:text-indigo-400 transition">Visual Drag & Drop</Link></li>
              <li><Link href="/" className="hover:text-indigo-400 transition">1-Click ZIP Exporter</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">ML Pipelines</h3>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-400 transition">Semantic Intent RAG</span></li>
              <li><span className="hover:text-indigo-400 transition">K-Means Harmonizer</span></li>
              <li><span className="hover:text-indigo-400 transition">Vision Wireframe CNN</span></li>
              <li><span className="hover:text-indigo-400 transition">AST Self-Healing</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Resources</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/pricing" className="hover:text-indigo-400 transition">Token Top-Up</Link></li>
              <li><span className="hover:text-indigo-400 transition">Documentation</span></li>
              <li><span className="hover:text-indigo-400 transition">Privacy & Security</span></li>
              <li><span className="hover:text-indigo-400 transition">API Telemetry</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>All Systems Operational • Kriti Engine v2.4</span>
        </div>

        <div>
          © {new Date().getFullYear()} Kriti AI Studio. Built with Next.js 15, React 18, and Tailwind CSS.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

