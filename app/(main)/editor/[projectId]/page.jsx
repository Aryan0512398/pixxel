"use client";
import { CanvasContext } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Loader2, Monitor } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RingLoader } from "react-spinners";
import CanvasEditor from "./_components/CanvasEditor";
import EditorSidebar from "./_components/EditorSidebar";
import { EditorTopBar } from "./_components/EditorTopbar";

const Editor = () => {
  const params = useParams();
  const projectId = params.projectId;

  const [canvasEditor, setCanvasEditor] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [activeTool, setActiveTool] = useState("resize");
  const [particles, setParticles] = useState([]);

  // ✅ Generate particles only in client to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  // ✅ Simple validation for projectId to prevent Convex errors
  const isInvalidProjectId = !projectId || projectId.length < 10;

  const {
    data: project,
    error,
    isLoading,
  } = useConvexQuery(
    api.project.getProject,
    isInvalidProjectId ? "skip" : { projectId } // skip query if invalid
  );

  // Loader
  if (!isInvalidProjectId && isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        {/* Animated Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-md"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0%", "-40%", "0%"],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}

        <div className="flex flex-col items-center gap-6 p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl relative z-10">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-cyan-300/80 text-lg font-medium animate-pulse">
            Loading your project...
          </p>
        </div>
      </div>
    );
  }

  // Error / Invalid Project ID
  if (isInvalidProjectId || error || !project) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        {/* Animated Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-red-400/20 blur-md"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0%", "-40%", "0%"],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}

        <div className="text-center p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl max-w-md relative z-10">
          <h1 className="text-3xl font-bold text-red-400 mb-3 animate-pulse">
            Project Not Found
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Oops! The project ID is invalid or you don’t have access to this
            project.
          </p>
          <Button
            variant="default"
            className="mt-6 bg-cyan-500 hover:bg-cyan-400 shadow-lg hover:shadow-cyan-500/30 transition-all duration-200"
            onClick={() => (window.location.href = "/")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Main editor
  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        processingMessage,
        setProcessingMessage,
        activeTool,
        onToolChange: setActiveTool,
      }}
    >
      {/* Mobile Block */}
      <div className="lg:hidden min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Desktop Required
          </h1>
          <p className="text-white/70 text-lg mb-2">
            This editor is only usable on desktop.
          </p>
          <p className="text-white/50 text-sm">
            Please use a larger screen to access the full editing experience.
          </p>
        </div>
      </div>

      {/* Desktop Editor */}
      <div className="hidden lg:block min-h-screen bg-slate-800 p-1">
        <div className="flex flex-col  h-screen">
          {processingMessage && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="rounded-lg p-6 flex flex-col items-center gap-4">
                <RingLoader color="#fff" />
                <div className="text-center">
                  <p className="text-white font-medium">{processingMessage}</p>
                  <p className="text-white/70 text-sm mt-1">
                    Please wait, do not switch tabs or navigate away
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Bar */}
          <EditorTopBar project={project} />
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <EditorSidebar project={project} />
            <div className="flex-1 bg-slate-800">{/* Canvas */}
            <CanvasEditor project={project} />
            </div>
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
};

export default Editor;
