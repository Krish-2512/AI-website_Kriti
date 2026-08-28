"use client";
import React, { useContext, useState } from "react";
import { Button } from "../../../components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import uuid4 from "uuid4";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { UserContext } from "../../context/UserContext";
import { Sparkles, UserCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

function SignInPopUp({ openDialog, closeDialog }) {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  // Quick 1-Click Demo Login using Prisma Database
  const handleGuestLogin = async () => {
    const demoData = {
      name: "Krish (Demo Creator)",
      email: "krish12252005@gmail.com",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      uuid: uuid4(),
    };

    try {
      const res = await axios.post("/api/user/create", demoData);
      const dbUser = res.data?.user || { ...demoData, tokens: 50000 };
      setUser(dbUser);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(dbUser));
      }

      toast.success("Welcome, Krish! Logged in with 50,000 free tokens (Prisma DB).");
      closeDialog(false);
    } catch (e) {
      console.warn("Guest login fallback:", e);
      const fallbackUser = { ...demoData, tokens: 50000, id: demoData.uuid };
      setUser(fallbackUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(fallbackUser));
      }
      toast.success("Welcome! Logged in with 50,000 free tokens.");
      closeDialog(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
        );

        const userData = userInfo?.data;
        const res = await axios.post("/api/user/create", {
          name: userData?.name,
          email: userData?.email,
          image: userData?.picture,
          uuid: uuid4(),
        });

        const finalUser = res.data?.user || {
          ...userData,
          image: userData?.picture,
          tokens: 50000,
        };

        setUser(finalUser);

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(finalUser));
        }

        toast.success(`Welcome back, ${finalUser.name}!`);
        closeDialog(false);
      } catch (err) {
        console.error("Google Auth error:", err);
        toast.error("Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn("Google OAuth Error:", errorResponse);
      toast.error("Google OAuth client not configured or origin unverified.");
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-center text-white">
            Welcome to Kriti AI Studio
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 text-xs mt-1">
            Sign in to create, synthesize, audit, and deploy your AI-generated React websites.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          {/* Quick 1-Click Demo Login */}
          <button
            onClick={handleGuestLogin}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>1-Click Continue as Demo Creator</span>
          </button>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 text-[11px] text-slate-500 uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign in with Google OAuth</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500">
            Backed by PostgreSQL & Prisma ORM persistent storage.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignInPopUp;
