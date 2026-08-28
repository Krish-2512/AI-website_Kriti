"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserContext } from "../../../context/UserContext";
import { 
  Users, KeyRound, Sparkles, Plus, Copy, Check, ArrowLeft, 
  ExternalLink, Play, Repeat, Shield, Search, Loader2, Code2, Clock, Activity, Wand2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

export default function SingleSpacePage() {
  const params = useParams();
  const spaceId = params?.spaceId;
  const router = useRouter();
  const { user } = useContext(UserContext);

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSearching, setAiSearching] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [remixingId, setRemixingId] = useState(null);

  useEffect(() => {
    if (spaceId) {
      fetchSpaceDetails();
    }
  }, [spaceId]);

  const fetchSpaceDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/spaces/get", { spaceId });
      if (res.data.success) {
        setSpace(res.data.space);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load space details");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (!space?.inviteCode) return;
    navigator.clipboard.writeText(space.inviteCode);
    setCopiedCode(true);
    toast.success(`Invite code "${space.inviteCode}" copied! Share with your team.`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ML Feature 1: AI Semantic Search across team projects
  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setAiSearchResults(null);
      return;
    }

    setAiSearching(true);
    try {
      const res = await axios.post("/api/spaces/smart-search", {
        spaceId,
        query: searchQuery.trim(),
      });
      if (res.data.success) {
        setAiSearchResults(res.data.results || []);
        toast.success(`Found ${res.data.results.length} semantic matches!`);
      }
    } catch (err) {
      console.error("Error in AI semantic search:", err);
    } finally {
      setAiSearching(false);
    }
  };

  // ML Feature 2: 1-Click AI Smart Remix & Style Harmonization
  const handleSmartRemix = async (workspaceId) => {
    setRemixingId(workspaceId);
    try {
      const res = await axios.post("/api/spaces/smart-remix", {
        sourceWorkspaceId: workspaceId,
        targetUserId: user?.id,
        targetUserName: user?.name || "Creator",
        customTheme: "indigo",
      });

      if (res.data.success) {
        toast.success("AI Smart Remix generated! Opening workspace...");
        router.push(`/workspace/${res.data.workspaceId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remix project");
    } finally {
      setRemixingId(null);
    }
  };

  const displayedProjects = aiSearchResults !== null ? aiSearchResults : (space?.workspaces || []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-xs text-slate-400 font-medium">Loading collaborative space...</p>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Space Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">This space may have been deleted or the link is invalid.</p>
        <Link
          href="/spaces"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
        >
          Back to Spaces Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/spaces"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Spaces
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-start gap-4">
              <span className="text-4xl p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                {space.icon || "🚀"}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {space.name}
                  </h1>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold">
                    Team Space
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  {space.description || "Collaborative space for building and sharing web applications."}
                </p>

                {/* Member avatars */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex -space-x-2">
                    {space.members?.slice(0, 5).map((m, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                        title={m.user?.name || "Member"}
                      >
                        {m.user?.name ? m.user.name.charAt(0).toUpperCase() : "M"}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    {space.members?.length || 1} Active Collaborators
                  </span>
                </div>
              </div>
            </div>

            {/* Invite Code & Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 pl-2">
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">Code:</span>
                  <span className="text-xs font-mono font-extrabold text-white tracking-widest">
                    {space.inviteCode}
                  </span>
                </div>
                <button
                  onClick={copyInviteCode}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-slate-800"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Build New Project Here</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ML Feature 1: AI Semantic Search Bar */}
        <form onSubmit={handleAiSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="🔍 AI Semantic Search across team projects (e.g. 'dark pricing table', 'crypto hero', 'e-commerce cart')..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) setAiSearchResults(null);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white placeholder:text-slate-500 transition shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={aiSearching}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/25 shrink-0"
          >
            {aiSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            <span>Smart Search</span>
          </button>
          {aiSearchResults !== null && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setAiSearchResults(null);
              }}
              className="px-3.5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition border border-slate-800"
            >
              Reset
            </button>
          )}
        </form>

        {/* Projects Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Collective Team Projects ({displayedProjects.length})</span>
            </h2>
            {aiSearchResults !== null && (
              <span className="text-xs text-amber-400 font-mono">
                Showing semantic AI search matches
              </span>
            )}
          </div>

          {displayedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((p) => {
                let firstPrompt = "Interactive Website Application";
                try {
                  const msgs = JSON.parse(p.messages || "[]");
                  firstPrompt = msgs[0]?.content || "Interactive Website Application";
                } catch (e) {
                  firstPrompt = p.messages || "Interactive Website Application";
                }

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition flex flex-col justify-between shadow-xl group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono">
                          React + Tailwind
                        </span>
                        {p.relevanceScore && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            {p.relevanceScore}% Match
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition mb-1">
                        {p.title || "Kriti Web App"}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {p.matchReason ? `💡 ${p.matchReason}` : firstPrompt}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/80 mb-4">
                        <span className="truncate">By {p.author || p.user?.name || "Team Member"}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(p.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          href={`/workspace/${p.id}`}
                          className="flex items-center justify-center gap-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm"
                          title="Open in Sandpack Editor"
                        >
                          <Play className="w-3 h-3" /> Edit
                        </Link>

                        <Link
                          href={`/preview/${p.id}`}
                          target="_blank"
                          className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
                          title="Direct Fullscreen Preview"
                        >
                          <ExternalLink className="w-3 h-3" /> Live
                        </Link>

                        <button
                          disabled={remixingId === p.id}
                          onClick={() => handleSmartRemix(p.id)}
                          className="flex items-center justify-center gap-1 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600 hover:text-white text-purple-300 text-xs font-semibold transition"
                          title="1-Click AI Style Remix"
                        >
                          {remixingId === p.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-amber-300" /> Remix
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
              <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No Projects in this Space Yet</h3>
              <p className="text-xs text-slate-400 mb-6">
                Be the first to publish an AI web app to this collaborative space!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-3.5 h-3.5" /> Launch Project Generator
              </Link>
            </div>
          )}
        </div>

        {/* Team Activity Feed */}
        {space.activities?.length > 0 && (
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recent Space Activity</span>
            </h3>
            <div className="space-y-3">
              {space.activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between text-xs py-2 border-b border-slate-800/40 last:border-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="font-semibold text-white">{act.userName}</span>
                    <span className="text-slate-400">{act.details || act.action}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
