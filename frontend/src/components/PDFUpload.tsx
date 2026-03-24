"use client";

import { useState } from "react";
import { UploadCloud, File, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { cn } from "@/lib/utils";

interface PDFUploadProps {
  onUploadSuccess: (filename: string) => void;
}

export default function PDFUpload({ onUploadSuccess }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadSuccess(file.name);
    } catch (err) {
      console.error(err);
      alert("Failed to upload PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-bold bg-gradient-to-br from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent mb-3">
            Upload Document
          </h2>
          <p className="text-neutral-400 text-sm">Drop your PDF below to start extracting insights instantly.</p>
        </div>

        <div
          className={cn(
            "relative z-10 border-2 border-dashed rounded-[1.5rem] p-10 flex flex-col items-center justify-center transition-all duration-300 ease-in-out cursor-pointer overflow-hidden min-h-[240px]",
            isDragging ? "border-indigo-400 bg-indigo-500/10" : "border-neutral-600 bg-black/20 hover:border-neutral-400 hover:bg-white/5"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileUpload')?.click()}
        >
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center pointer-events-none"
              >
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-5 rounded-full mb-5 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <UploadCloud className="w-10 h-10 text-indigo-400" />
                </div>
                <p className="text-neutral-200 font-medium text-lg">Click or drag PDF</p>
                <p className="text-neutral-500 text-xs mt-2 text-center max-w-[200px]">
                  Files are processed securely.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="filled"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center pointer-events-none"
              >
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-5 rounded-full mb-5 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <File className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-neutral-100 font-medium text-center truncate max-w-[220px] text-lg">{file.name}</p>
                <p className="text-emerald-400/80 text-xs mt-2 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">Ready to process</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {file && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 relative z-10"
          >
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white rounded-2xl font-medium shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all outline-none focus:ring-2 focus:ring-indigo-500/50 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed background-animate"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Document...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Upload & Analyze</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
