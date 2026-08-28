"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MessageContext } from "../../context/MessageContext";
import Prompt from "../llm/Prompt";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import data from "../../../additional/data";
import { Loader2Icon, Code2, Eye, Layout, Sliders, ExternalLink } from "lucide-react";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "../../context/ActionContext";
import { UserContext } from "../../context/UserContext";
import { countToken } from "./ChatView";
import MLToolbar from "./MLToolbar";
import VisualBuilder from "./VisualBuilder";
import { useParams } from "next/navigation";

function CodeView() {
  const { user, setUser } = useContext(UserContext);
  const { messages } = useContext(MessageContext);
  const { workspaceId } = useParams();
  const [selectSection, setSelectSection] = useState("preview"); // preview | visual | code
  const [files, setFiles] = useState(data?.DEFAULT_FILE || {});
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Craftly Web App");
  const { action } = useContext(ActionContext);

  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "user") {
        generateWebsiteCode(lastMessage.content);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (action?.actionType) {
      setSelectSection("preview");
    }
  }, [action]);

  const generateWebsiteCode = async (userPrompt) => {
    try {
      setLoading(true);

      // Step 1: Pre-classify Intent via ML Intent Classifier
      let blueprint = null;
      try {
        const classRes = await axios.post("/api/ml/classify-intent", { prompt: userPrompt });
        if (classRes.data?.blueprint) {
          blueprint = classRes.data.blueprint;
        }
      } catch (err) {
        console.warn("Intent classifier step skipped:", err);
      }

      // Step 2: Synthesize React Code
      const response = await axios.post("/api/website-code", {
        prompt: userPrompt,
        blueprint,
      });

      if (response.data) {
        const result = response.data;
        if (result.projectTitle) {
          setProjectTitle(result.projectTitle);
        }

        const fileStructure = { ...data.DEFAULT_FILE, ...result?.files };
        setFiles(fileStructure);

        // Update token in Prisma DB
        const userId = user?.id || user?._id;
        if (userId) {
          const usedTokens = countToken(JSON.stringify(result));
          const currentTokens = user?.tokens || user?.token || 50000;
          const updatedTokens = Math.max(0, currentTokens - usedTokens);
          setUser((prev) => ({ ...prev, tokens: updatedTokens, token: updatedTokens }));

          try {
            await axios.post("/api/user/token", {
              userId: userId,
              token: updatedTokens,
            });
          } catch (e) {
            console.warn("Token update fallback:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error generating website code:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentPrompt = messages?.length > 0 ? messages[messages.length - 1]?.content : "";

  return (
    <div className="relative flex flex-col h-[85vh] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* ML Studio Toolbar */}
      <MLToolbar
        files={files}
        setFiles={setFiles}
        currentPrompt={currentPrompt}
        projectTitle={projectTitle}
      />

      {/* View Mode Tab Selector Header */}
      <div className="bg-slate-900/90 px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectSection("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              selectSection === "preview"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>

          <button
            onClick={() => setSelectSection("visual")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              selectSection === "visual"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            Drag & Drop Canvas
          </button>

          <button
            onClick={() => setSelectSection("code")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              selectSection === "code"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code Editor
          </button>
        </div>

        <div className="text-xs font-medium text-slate-400">
          Project: <span className="text-slate-200 font-semibold">{projectTitle}</span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        {selectSection === "preview" ? (
          /* Native Direct Interactive React Live Preview */
          <SandpackProvider
            key={files?.["/App.js"]?.code ? `${projectTitle}-${files["/App.js"].code.length}` : "sandpack-live-init"}
            template="react"
            theme="dark"
            customSetup={{
              dependencies: {
                ...data.DEPENDANCY,
              },
            }}
            files={files}
            options={{
              externalResources: ["https://cdn.tailwindcss.com"],
            }}
          >
            <SandpackLayout style={{ height: "100%", border: "none", borderRadius: 0 }}>
              <SandpackPreviewClient />
            </SandpackLayout>
          </SandpackProvider>
        ) : selectSection === "visual" ? (
          <VisualBuilder
            files={files}
            setFiles={setFiles}
            workspaceId={workspaceId}
            currentPrompt={currentPrompt}
            projectTitle={projectTitle}
          />
        ) : (
          /* Code Editor */
          <SandpackProvider
            key={files?.["/App.js"]?.code ? `editor-${projectTitle}-${files["/App.js"].code.length}` : "sandpack-editor-init"}
            template="react"
            theme="dark"
            customSetup={{
              dependencies: {
                ...data.DEPENDANCY,
              },
            }}
            files={files}
            options={{
              externalResources: ["https://cdn.tailwindcss.com"],
            }}
          >
            <SandpackLayout style={{ height: "100%", border: "none", borderRadius: 0 }}>
              <SandpackFileExplorer style={{ height: "calc(85vh - 90px)" }} />
              <SandpackCodeEditor style={{ height: "calc(85vh - 90px)" }} />
            </SandpackLayout>
          </SandpackProvider>
        )}



        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Loader2Icon className="animate-spin h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-white">Multi-ML Pipeline Synthesizing...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Classifying intent, harmonizing color palette, and building React component structure.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeView;
