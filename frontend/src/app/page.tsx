"use client";

import { useState } from "react";
import PDFUpload from "@/components/PDFUpload";
import ChatInterface from "@/components/ChatInterface";
import { motion } from "framer-motion";

export default function Home() {
  const [filename, setFilename] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 font-sans overflow-auto">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 flex justify-center items-center pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-2 border-b border-white/5"
        >
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
             <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center font-bold text-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] border border-white/20">
               R
             </div>
             <div>
               <h1 className="text-2xl font-bold tracking-tight text-white/90">Insight<span className="text-indigo-400">PDF</span></h1>
               <p className="text-xs text-neutral-500 font-medium">Next-Gen Document Intelligence</p>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium backdrop-blur-md flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>System Online</span>
             </div>
          </div>
        </motion.header>

        {/* Main Content Areas */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 pt-4 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 h-[400px] lg:h-full flex flex-col"
          >
            <PDFUpload onUploadSuccess={setFilename} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 h-[600px] lg:h-full flex flex-col"
          >
            <ChatInterface filename={filename} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
