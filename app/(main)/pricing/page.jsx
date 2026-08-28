"use client";
import React, { useContext } from "react";
import Lookup from "../../components/llm/Lookup";
import PricingModel from "../../components/custom/PricingModel";
import { UserContext } from "../../context/UserContext";
import { Coins, Sparkles, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

function PricingPage() {
  const { user } = useContext(UserContext);
  const currentTokens = user?.tokens || user?.token || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header section */}
      <div className="max-w-4xl text-center flex flex-col items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time PayPal Payment Gateway & Token Top-Up</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
          Subscription & Token Plans
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-4 leading-relaxed">
          {Lookup.PRICING_DESC}
        </p>

        {/* User token balance card */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl w-full max-w-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Current Token Balance
              </div>
              <div className="text-2xl font-extrabold text-white flex items-center gap-2">
                <span>{Number(currentTokens).toLocaleString()}</span>
                <span className="text-xs font-medium text-amber-400">Tokens Available</span>
              </div>
            </div>
          </div>

          <div className="text-right sm:text-right text-center">
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1 justify-center sm:justify-end">
              <Zap className="w-3.5 h-3.5" /> Instant Delivery
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Top up below for unlimited AI code synthesis
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Models & PayPal Payment Cards */}
      <PricingModel />

      {/* Security & Guarantee footer badge */}
      <div className="mt-16 flex items-center justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted PayPal Checkout</span>
        </div>
        <span>•</span>
        <div>Instant Token Balance Credit</div>
        <span>•</span>
        <div>Cancel anytime</div>
      </div>
    </div>
  );
}

export default PricingPage;