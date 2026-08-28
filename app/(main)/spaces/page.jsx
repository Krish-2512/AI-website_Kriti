"use client";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { 
  Users, Plus, KeyRound, Sparkles, FolderKanban, 
  ArrowRight, Copy, Check, Shield, Search, Loader2, Rocket
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import CreateSpaceModal from "../../components/custom/CreateSpaceModal";
import JoinSpaceModal from "../../components/custom/JoinSpaceModal";

export default function SpacesPage() {
  const { user } = useContext(UserContext);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchSpaces();
  }, [user]);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/spaces/list", {
        userId: user?.id,
        userEmail: user?.email,
      });
      if (res.data.success) {
        setSpaces(res.data.spaces || []);
      }
    } catch (err) {
      console.error("Error loading spaces:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Invite code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredSpaces = spaces.filter((sp) => {
    const q = searchQuery.toLowerCase();
    return sp.name.toLowerCase().includes(q) || (sp.description || "").toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" /> Collaborative Spaces Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Team Code Spaces & Shared Hubs
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Keep your team's AI-generated web applications, shared components, and templates organized in one place with 1-click invite codes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setOpenJoin(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-200 hover:text-white text-xs font-semibold transition"
            >
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Join with Code</span>
            </button>

            <button
              onClick={() => setOpenCreate(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Space</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white placeholder:text-slate-500 transition"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
              <span>{spaces.length} Active Spaces</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Search & Remix Enabled</span>
            </span>
          </div>
        </div>

        {/* Spaces Matrix */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs text-slate-400 font-medium">Loading collaborative spaces...</p>
          </div>
        ) : filteredSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((sp) => {
              const isOwner = sp.ownerId === user?.id;
              const projectCount = sp.workspaces?.length || 0;
              const memberCount = sp.members?.length || 1;

              return (
                <div
                  key={sp.id}
                  className="group p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-900/90 transition duration-300 shadow-xl backdrop-blur-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                          {sp.icon || "🚀"}
                        </span>
                        <div>
                          <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                            {sp.name}
                          </h2>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            By {sp.owner?.name || "Creator"} {isOwner && <span className="text-indigo-400 font-bold">(You)</span>}
                          </span>
                        </div>
                      </div>

                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        <Shield className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6">
                      {sp.description || "Collaborative space for building, sharing, and remixing AI websites."}
                    </p>

                    {/* Invite Code Pill */}
                    <div className="mb-6 p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] uppercase font-bold text-slate-400">Invite Code:</span>
                        <span className="text-xs font-mono font-extrabold text-white tracking-wider">
                          {sp.inviteCode}
                        </span>
                      </div>
                      <button
                        onClick={() => copyInviteCode(sp.inviteCode)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                        title="Copy Invite Code"
                      >
                        {copiedCode === sp.inviteCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{projectCount} Projects</span>
                      <span>•</span>
                      <span>{memberCount} Members</span>
                    </div>

                    <Link
                      href={`/spaces/${sp.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white text-indigo-300 text-xs font-semibold transition shadow-sm"
                    >
                      <span>Open Space</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">No Collaborative Spaces Found</h2>
            <p className="text-xs text-slate-400 mb-6">
              Create your first team space to share AI websites, or join an existing space using an invite code.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setOpenJoin(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold transition"
              >
                Join with Code
              </button>
              <button
                onClick={() => setOpenCreate(true)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
              >
                Create First Space
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateSpaceModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => fetchSpaces()}
      />
      <JoinSpaceModal
        isOpen={openJoin}
        onClose={() => setOpenJoin(false)}
        onJoined={() => fetchSpaces()}
      />
    </div>
  );
}
