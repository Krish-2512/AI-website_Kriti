"use client";
import React, { useContext, useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { UserContext } from "../../context/UserContext";
import { LucideDownload, Sparkles, ExternalLink, Rocket, User as UserIcon, Eye } from "lucide-react";
import { ActionContext } from "../../context/ActionContext";
import SignInPopUp from "./SignInPopUp";
import { toast } from "sonner";

function Header() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const params = useParams();
  const { action, setAction } = useContext(ActionContext);
  const path = usePathname();
  const [openDialog, setOpenDialog] = useState(false);

  const login = () => {
    setOpenDialog(true);
  };

  const onAction = (actionType) => {
    setAction({
      actionType,
      timeStamp: Date.now(),
    });
  };

  const handleOpenLiveUrl = () => {
    const workspaceId = params?.workspaceId || "live";
    window.open(`/preview/${workspaceId}`, "_blank");
    toast.success("Opened Direct Live Website Preview (No Sandbox Redirects)!");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 flex px-6 py-3.5 items-center justify-between bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      {/* Brand Logo */}
      <div 
        onClick={handleLogoClick}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Kriti
          </span>
          <span className="ml-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            AI Studio
          </span>
        </div>
      </div>

      {/* Navigation & Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Pricing / Subscription link button */}
        <button
          onClick={() => router.push("/pricing")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-semibold transition"
          title="View Subscription & Token Plans"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Pricing</span>
          {user?.token || user?.tokens ? (
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-mono border border-amber-500/20">
              {Number(user?.tokens || user?.token).toLocaleString()}
            </span>
          ) : null}
        </button>

        {path?.includes("workspace") && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenLiveUrl}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20"
              title="Open Direct Fullscreen Live Website (Zero Sandbox Redirects)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Direct Live URL</span>
            </button>
          </div>
        )}

        {!user?.name ? (
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold px-4 py-2 text-xs shadow-md shadow-indigo-600/25 transition"
            onClick={login}
          >
            Sign In
          </Button>
        ) : (
          <div 
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-indigo-500/50 transition"
          >
            {user?.image ? (
              <Image 
                src={user.image} 
                alt="user" 
                width={26} 
                height={26} 
                className="rounded-full border border-indigo-500/50" 
              />
            ) : (
              <UserIcon className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-xs font-semibold text-white max-w-[120px] truncate">
              {user?.name || "My Account"}
            </span>
          </div>
        )}
      </div>

      <SignInPopUp
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </header>
  );
}

export default Header;
