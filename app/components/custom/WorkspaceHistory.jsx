"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Link from "next/link";
import { useSidebar } from "../../../components/ui/sidebar";
import { Loader2Icon, Sparkles, Folder } from "lucide-react";
import axios from "axios";

function WorkspaceHistory() {
  const { user } = useContext(UserContext);
  const [workSpaceHistory, setWorkspaceHistory] = useState([]);
  const { toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);

  const GetAllWorkspace = async () => {
    const userId = user?.id || user?._id;
    if (!userId) return;

    try {
      setLoading(true);
      const res = await axios.post("/api/workspace/history", { userId });
      if (res.data?.workspaces) {
        setWorkspaceHistory(res.data.workspaces);
      }
    } catch (error) {
      console.error("Error fetching workspace history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id || user?._id) {
      GetAllWorkspace();
    }
  }, [user]);

  return (
    <div className="mt-4 px-2">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Folder className="w-4 h-4 text-indigo-400" />
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Workspace Projects
        </h2>
      </div>

      {user?.name ? (
        <div className="flex flex-col gap-1.5">
          {loading && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
              <Loader2Icon className="animate-spin w-3.5 h-3.5 text-indigo-400" />
              <span>Loading projects...</span>
            </div>
          )}

          {workSpaceHistory?.length > 0 ? (
            workSpaceHistory.map((workspace, index) => {
              let firstPrompt = "Kriti Website";
              try {
                const parsed = JSON.parse(workspace.messages);
                firstPrompt = parsed[0]?.content || "Website Project";
              } catch (e) {
                // raw string
                firstPrompt = workspace.messages || "Website Project";
              }

              return (
                <Link key={workspace.id || index} href={`/workspace/${workspace.id}`}>
                  <div
                    onClick={toggleSidebar}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-900 hover:border-indigo-500/40 text-slate-300 text-xs transition line-clamp-1 cursor-pointer"
                  >
                    {firstPrompt}
                  </div>
                </Link>
              );
            })
          ) : (
            !loading && (
              <div className="text-slate-500 text-xs p-2 text-center">
                No past projects found.
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-slate-500 text-xs p-2 text-center">
          Sign in to view your projects.
        </div>
      )}
    </div>
  );
}

export default WorkspaceHistory;
