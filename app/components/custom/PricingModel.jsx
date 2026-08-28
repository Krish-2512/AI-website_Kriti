"use client";
import React, { useState, useContext } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Lookup from "../llm/Lookup";
import { UserContext } from "../../context/UserContext";
import { Sparkles, Check, Zap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

function PricingModel() {
  const { user, setUser } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState(null);

  const onPaymentSuccess = async (pricing) => {
    const tokenToAdd = pricing?.value || Number(pricing?.tokens) || 50000;
    const currentTokens = user?.tokens || user?.token || 0;
    const newTokenTotal = currentTokens + tokenToAdd;

    const userId = user?.id || user?._id;
    if (userId) {
      try {
        await axios.post("/api/user/token", {
          userId: userId,
          token: newTokenTotal,
        });
      } catch (e) {
        console.warn("Prisma token update fallback:", e);
      }
    }

    setUser({ ...(user || {}), tokens: newTokenTotal, token: newTokenTotal });
    toast.success(`Successfully added ${pricing?.tokens} tokens to your account!`);
  };

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => {
        const isPopular = pricing.name === "Pro";

        return (
          <div
            key={index}
            onClick={() => setSelectedOption(pricing)}
            className={`relative p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer backdrop-blur-xl ${
              isPopular
                ? "bg-slate-900/90 border-indigo-500 shadow-2xl shadow-indigo-500/20 ring-1 ring-indigo-500"
                : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
            }`}
          >
            {isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{pricing.name}</h3>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Zap className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-white">${pricing.price}</span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>

              <div className="text-sm font-semibold text-indigo-300 mb-2">
                {pricing.tokens} AI Tokens
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">{pricing.desc}</p>

              <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-6">
                {[
                  "Multi-ML Pipeline Access",
                  "Visual Drag & Drop Canvas",
                  "WCAG AAA Quality Audit",
                  "1-Click Standalone ZIP Export",
                  "Vision Wireframe Synthesis"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              {!user && (
                <div className="mb-2 text-center text-[11px] text-amber-400 font-medium">
                  Please sign in to purchase tokens
                </div>
              )}
              <PayPalButtons
                style={{ layout: "horizontal", shape: "pill", color: "blue", height: 38 }}
                disabled={!user}
                onClick={(data, actions) => {
                  if (!user) {
                    toast.error("Please sign in first to upgrade your token plan.");
                    return actions.reject();
                  }
                  setSelectedOption(pricing);
                  return actions.resolve();
                }}
                onApprove={() => onPaymentSuccess(pricing)}
                onCancel={() => {
                  toast.info("Payment was cancelled.");
                }}
                onError={(err) => {
                  console.warn("PayPal transaction notice:", err);
                  toast.info("PayPal sandbox mode active. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID for live payments.");
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: Number(pricing.price).toFixed(2),
                          currency_code: "USD",
                        },
                      },
                    ],
                  });
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PricingModel;
