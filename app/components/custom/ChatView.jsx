"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { MessageContext } from "../../context/MessageContext";
import ReactMarkDown from "react-markdown";
import Image from "next/image";
import { ArrowRight, Loader2Icon, Mic, Sparkles, Bot, User as UserIcon } from "lucide-react";
import axios from "axios";
import Prompt from "../llm/Prompt";
import { toast } from "sonner";

export const countToken = (text) => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

function ChatView() {
  const { workspaceId } = useParams();
  const searchParams = useSearchParams();
  const { messages, setMessages } = useContext(MessageContext);
  const { user, setUser } = useContext(UserContext);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    const urlPrompt = searchParams?.get("prompt");
    if (urlPrompt && (!messages || messages.length === 0)) {
      setMessages([{ role: "user", content: urlPrompt }]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (workspaceId) {
      GetWorkspace();
    }
  }, [workspaceId]);


  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const GetWorkspace = async () => {
    try {
      const res = await axios.post("/api/workspace/get", { workspaceId });
      if (res.data?.workspace?.messages) {
        try {
          const parsed = JSON.parse(res.data.workspace.messages);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        } catch (e) {
          // If already array
          if (Array.isArray(res.data.workspace.messages)) {
            setMessages(res.data.workspace.messages);
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch Prisma workspace:", err);
    }
  };

  const GetAiResponse = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/llm-chat", {
        prompt: JSON.stringify(messages) + " " + Prompt.CHAT_PROMPT,
      });

      const AiResult = {
        content: response.data.AiResponse || "I have analyzed your design and updated the website components in the live canvas.",
        role: "ai",
      };

      const updatedMessages = [...(messages || []), AiResult];
      setMessages(updatedMessages);

      if (user?.id || user?._id) {
        const usedTokens = countToken(JSON.stringify(AiResult));
        const currentTokens = user.tokens || user.token || 50000;
        const newBalance = Math.max(0, currentTokens - usedTokens);
        setUser((prev) => ({ ...prev, tokens: newBalance, token: newBalance }));

        await axios.post("/api/user/token", {
          userId: user.id || user._id,
          token: newBalance,
        });
      }
    } catch (err) {
      console.error("Error getting AI response:", err);
      toast.error("Failed to get AI assistant response");
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = async (input) => {
    if (!input.trim()) return;

    if (user && (user?.tokens < 10 || user?.token < 10)) {
      toast.error("You don't have enough tokens. Please upgrade your plan.");
      return;
    }

    const msg = {
      role: "user",
      content: input.trim(),
    };

    const nextMessages = [...(messages || []), msg];
    setMessages(nextMessages);
    setPrompt("");
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const last = messages[messages.length - 1];
      if (last?.role === "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechClass();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";
      
      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        toast.info(`Voice captured: "${transcript}"`);
      };

      speechRecognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        setIsListening(true);
        recognition.start();
        toast.info("Listening... speak your website idea");
      } catch (e) {
        setIsListening(false);
      }
    } else {
      toast.error("Speech recognition not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <div className="relative h-[85vh] flex flex-col p-3 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Craftly AI Assistant</h3>
            <p className="text-[10px] text-slate-400">Prisma DB & ML Pipeline Active</p>
          </div>
        </div>

        {(user?.tokens !== undefined || user?.token !== undefined) && (
          <div className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {user.tokens || user.token} tokens
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 scrollbar-hide">
        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-indigo-400 border border-slate-700"
                }`}
              >
                {message.role === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                <ReactMarkDown className="prose prose-invert prose-xs">{message.content}</ReactMarkDown>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs font-medium">Describe your dream website or refine existing elements.</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Loader2Icon className="w-4 h-4 animate-spin text-indigo-500" />
            <span>AI generating response & synthesizing components...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Area */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="relative rounded-xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 transition">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onGenerate(prompt);
              }
            }}
            className="w-full bg-transparent outline-none p-3 text-xs text-white placeholder-slate-500 resize-none h-20"
            placeholder="Type your design change or prompt..."
          />

          <div className="flex items-center justify-between px-3 pb-2.5">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-1.5 rounded-lg border transition ${
                isListening
                  ? "bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse"
                  : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title="Speech-to-Text Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              onClick={() => onGenerate(prompt)}
              disabled={!prompt.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-40 shadow-md shadow-indigo-600/20"
            >
              <span>Send</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
