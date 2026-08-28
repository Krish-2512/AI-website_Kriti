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
  Rocket, Globe, ExternalLink, Download, CheckCircle2, 
  Sparkles, Terminal, Copy, ShieldCheck, ArrowRight 
} from "lucide-react";
import { toast } from "sonner";
import { downloadProjectZip } from "@/lib/exportZip";

export default function DeployModal({ isOpen, onClose, files, htmlContent, projectTitle = "Craftly Website" }) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  // Direct 1-Click HTML Download for Netlify Drop
  const handleDownloadHtml = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded index.html! Drag & drop to Netlify Drop for instant live hosting.");
  };

  // Full Project ZIP Download
  const handleDownloadZip = async () => {
    try {
      await downloadProjectZip(files, projectTitle);
      toast.success("Downloaded production Vite React project with Docker & CI/CD!");
    } catch (e) {
      toast.error("Failed to export project ZIP");
    }
  };

  // Trigger Custom Webhook
  const handleTriggerWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a valid Netlify/Vercel Deploy Hook URL");
      return;
    }
    try {
      setIsDeploying(true);
      await fetch(webhookUrl, { method: "POST" });
      toast.success("🚀 Live deploy hook triggered successfully!");
      onClose();
    } catch (err) {
      toast.error("Webhook trigger error: " + err.message);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Deploy Website to Production
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Host your website live on a public domain (Vercel, Netlify, Cloudflare Pages, or Docker).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* Method 1: Instant 10-Second Free Hosting (Netlify Drop) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                <h4 className="text-sm font-bold text-white">Instant 10-Second Live Hosting (Netlify Drop)</h4>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">Free & Instant</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download the single-file production HTML bundle and drag & drop it into Netlify Drop to get an instant public <code className="text-indigo-400">https://your-site.netlify.app</code> URL.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadHtml}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>1. Download index.html</span>
              </button>
              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>2. Open Netlify Drop</span>
              </a>
            </div>
          </div>

          {/* Method 2: Standalone Vite React + Docker Repo */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">2</span>
                <h4 className="text-sm font-bold text-white">Full Vite React Repository (Vercel / GitHub)</h4>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300">Production</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download the complete source code containing <code className="text-indigo-300">package.json</code>, Tailwind CSS, Docker multi-stage build, and GitHub Actions CI/CD.
            </p>
            <button
              onClick={handleDownloadZip}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Complete Project ZIP</span>
            </button>
          </div>

          {/* Method 3: Netlify / Vercel Webhook Deploy Hook */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">3</span>
              <h4 className="text-sm font-bold text-white">Automated Webhook Deploy Trigger</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste your Netlify/Vercel build webhook URL to trigger an autonomous cloud build directly from Craftly.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://api.netlify.com/build_hooks/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleTriggerWebhook}
                disabled={isDeploying}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                {isDeploying ? "Deploying..." : "Trigger Deploy"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
