"use client";
import React from 'react';
import CodeView from '../../../components/custom/CodeView';
import ChatView from '../../../components/custom/ChatView';


function Workspace() {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-950 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[1800px] mx-auto">
        <div className="lg:col-span-1">
          <ChatView />
        </div>
        <div className="lg:col-span-2">
          <CodeView />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
