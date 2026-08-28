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
import { KeyRound, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function JoinSpaceModal({ isOpen, onClose, onJoined }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error("Please enter a valid invite code");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/spaces/join", {
        inviteCode: inviteCode.trim(),
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name || "Collaborator",
      });

      if (res.data.success) {
        toast.success(`Joined space "${res.data.spaceName}" successfully!`);
        setInviteCode("");
        onClose();
        if (onJoined) onJoined(res.data.spaceId);
        router.push(`/spaces/${res.data.spaceId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to join space. Please check the invite code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">
                Join Collaborative Space
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Enter the 6-character team invite code shared by your project lead.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleJoin} className="space-y-4 mt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Invite Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. KRITI-8921"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none text-sm font-mono tracking-widest text-center text-white placeholder:text-slate-600 uppercase transition"
            />
          </div>

          <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Instant access to all shared websites, templates & components in the space.</span>
          </div>

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
              className="rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <ArrowRight className="w-3.5 h-3.5 mr-1.5" />}
              Join Space
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
