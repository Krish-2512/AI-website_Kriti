"use client";
import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { UserContext } from "../../context/UserContext";
import { Button } from "../../../components/ui/button";
import { Sparkles, Users, Loader2, Rocket, Globe, Shield, Tag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function CreateSpaceModal({ isOpen, onClose, onCreated }) {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🚀");
  const [loading, setLoading] = useState(false);

  const iconOptions = ["🚀", "✨", "🔥", "⚡", "💎", "🎨", "🌐", "💻", "🤖", "📈"];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a space name");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/spaces/create", {
        name: name.trim(),
        description: description.trim() || "Collaborative web development and AI synthesis space.",
        icon,
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name,
      });

      if (res.data.success) {
        toast.success(`Space "${name}" created successfully! Invite Code: ${res.data.space.inviteCode}`);
        setName("");
        setDescription("");
        onClose();
        if (onCreated) onCreated(res.data.space);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create space");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">
                Create Collaborative Space
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Organize projects, share components, and invite teammates with 1-click codes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4 mt-2">
          {/* Icon Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Space Emoji Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition ${
                    icon === emoji
                      ? "bg-indigo-600 border-2 border-indigo-400 scale-105 shadow-md shadow-indigo-600/30"
                      : "bg-slate-950 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Space Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Frontend Core Team, SaaS Hub, Hackathon 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white placeholder:text-slate-600 transition"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="What are you and your team building in this space?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white placeholder:text-slate-600 resize-none transition"
            />
          </div>

          <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Includes 1-Click Invite Code & AI Smart Component Search.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-slate-800 text-xs hover:bg-slate-800 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Rocket className="w-3.5 h-3.5 mr-1.5" />}
              Create Space
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
