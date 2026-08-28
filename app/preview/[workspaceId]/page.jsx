"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { createSectionsFromPrompt, compileSectionsToHtml, INITIAL_SECTIONS } from "@/lib/defaultTemplate";

export default function FullscreenPreviewPage() {
  const { workspaceId } = useParams();
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function loadWorkspacePreview() {
      try {
        if (workspaceId && workspaceId !== "live") {
          const res = await axios.post("/api/workspace/get", { workspaceId });
          const msgs = res.data?.workspace?.messages;
          if (msgs) {
            let parsed = [];
            try {
              parsed = typeof msgs === "string" ? JSON.parse(msgs) : msgs;
            } catch (e) {
              if (Array.isArray(msgs)) parsed = msgs;
            }

            const userMsgs = parsed.filter(m => m.role === "user");
            const lastUserMsg = userMsgs[userMsgs.length - 1]?.content || "";
            if (lastUserMsg) {
              const dynamicSecs = createSectionsFromPrompt(lastUserMsg);
              setHtml(compileSectionsToHtml(dynamicSecs));
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic workspace preview:", err);
      }

      // Check URL query parameters or fallback
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const queryPrompt = params.get("prompt");
        if (queryPrompt) {
          const dynamicSecs = createSectionsFromPrompt(queryPrompt);
          setHtml(compileSectionsToHtml(dynamicSecs));
          return;
        }
      }

      setHtml(compileSectionsToHtml(INITIAL_SECTIONS));
    }

    loadWorkspacePreview();
  }, [workspaceId]);

  return (
    <div className="w-screen h-screen bg-slate-950 overflow-auto">
      <iframe
        srcDoc={html}
        title="Craftly Fullscreen Preview"
        className="w-full h-full border-none min-h-screen"
      />
    </div>
  );
}
