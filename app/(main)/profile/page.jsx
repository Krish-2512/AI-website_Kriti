"use client";
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserContext } from "../../context/UserContext";
import { User as UserIcon, Coins, Sparkles, ArrowLeft, Zap, Mail, Shield } from "lucide-react";

function Profile() {
  const { user } = useContext(UserContext);
  const currentTokens = user?.tokens || user?.token || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col items-center text-center">
        <Link
          href="/"
          className="self-start inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        {user ? (
          <>
            <div className="relative mb-4">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="User Profile"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-indigo-500/40 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl">
                  <UserIcon className="w-10 h-10" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
                <Shield className="w-3.5 h-3.5" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name || "Creator"}</h1>
            <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>

            {/* Token Balance & Upgrade Card */}
            <div className="mt-8 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 w-full flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Token Balance
                  </div>
                  <div className="text-lg font-extrabold text-white font-mono">
                    {Number(currentTokens).toLocaleString()} Tokens
                  </div>
                </div>
              </div>

              <Link
                href="/pricing"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Upgrade</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="py-8">
            <UserIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white">Not Signed In</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">Please sign in to view your profile and tokens.</p>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
            >
              Go to Home Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
