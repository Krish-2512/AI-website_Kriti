"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { UserContext } from "../../context/UserContext";
import { Button } from "../../../components/ui/button";
import { Share2, Users, Loader2, Check, ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

export default function ShareToSpaceModal({ isOpen, onClose, workspaceId, projectTitle = "Kriti Web App" }) {
  const { user } = useContext(UserContext);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sharingSpaceId, setSharingSpaceId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserSpaces();
    }
  }, [isOpen]);

  const fetchUserSpaces = async () => {
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
      console.error("Error fetching spaces for sharing:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareToSpace = async (spaceId, spaceName) => {
    setSharingSpaceId(spaceId);
    try {
      const res = await axios.post("/api/spaces/add-project", {
        spaceId,
        workspaceId,
        title: projectTitle,
        userName: user?.name || "Creator",
      });

      if (res.data.success) {
        toast.success(`Published "${projectTitle}" to space "${spaceName}"!`);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish project to space");
    } finally {
      setSharingSpaceId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">
                Publish to Collaborative Space
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Share this website with your team members so they can preview, fork, and remix it.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-3 space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Destination Space
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span>Loading your spaces...</span>
            </div>
          ) : spaces.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {spaces.map((sp) => (
                <div
                  key={sp.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {sp.icon || "🚀"}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                        {sp.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {sp.members?.length || 1} members • {sp.workspaces?.length || 0} projects
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={sharingSpaceId === sp.id}
                    onClick={() => handleShareToSpace(sp.id, sp.name)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white transition shadow-md shadow-indigo-600/20"
                  >
                    {sharingSpaceId === sp.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Publish Here"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950 text-center border border-slate-800">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-xs font-semibold text-white">No spaces found</div>
              <p className="text-[11px] text-slate-400 mt-1 mb-4">
                You haven't created or joined any collaborative space yet.
              </p>
              <Link
                href="/spaces"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-3.5 h-3.5" /> Go to Spaces Hub
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
