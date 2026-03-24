"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  filename: string | null;
}

export default function ChatInterface({ filename }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! Upload a PDF on the left and I'll be ready to answer your questions about its contents."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filename) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `I've analyzed "${filename}". What would you like to know?`
        }
      ]);
    }
  }, [filename]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !filename || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", userMsg.content);

      const res = await axios.post("http://127.0.0.1:8000/ask", formData);
      
      let answer;
      if (res.data.error) {
        answer = res.data.error;
      } else if (res.data.answer) {
        answer = res.data.answer;
      } else {
        answer = "I couldn't find an answer to that.";
      }
      
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: answer };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I encountered an error while processing your question." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/40 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden relative sm:rounded-[2rem]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between z-10 relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center p-[2px] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
             <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-indigo-400" />
             </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wide">Document Insight</h3>
            <p className="text-sm text-neutral-400 flex items-center mt-0.5">
               <span className={cn("w-2 h-2 rounded-full mr-2 shadow-[0_0_10px_currentColor]", filename ? "bg-emerald-500 text-emerald-500" : "bg-orange-500 text-orange-500 animate-pulse")}></span>
               {filename ? `Chatting about ${filename}` : "Awaiting document upload"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 z-10 flex flex-col scrollable-area">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              className={cn(
                "flex max-w-[85%] sm:max-w-[75%]",
                msg.role === "user" ? "ml-auto justify-end mt-4" : "mr-auto justify-start mt-4"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-3 mt-auto mb-1 flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-300" />
                </div>
              )}
              <div className={cn(
                "p-5 rounded-3xl text-[15px] leading-relaxed whitespace-pre-wrap overflow-auto max-w-full",
                msg.role === "user" 
                  ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_10px_30px_rgba(99,102,241,0.2)] rounded-br-sm"
                  : "bg-white/5 text-neutral-200 border border-white/10 rounded-bl-sm backdrop-blur-md"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mr-auto justify-start flex max-w-[85%] mt-4"
            >
               <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-3 mt-auto mb-1 flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-300" />
               </div>
               <div className="p-5 rounded-3xl bg-white/5 border border-white/5 rounded-bl-sm backdrop-blur-md flex items-center space-x-3 text-neutral-400">
                  <div className="flex space-x-1 border-r border-white/10 pr-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm font-medium">Extracting knowledge...</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-xl z-10 w-full relative">
        <form onSubmit={handleSubmit} className="relative flex items-center w-full group">
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             disabled={!filename || isLoading}
             placeholder={filename ? "Ask a question about your PDF..." : "Upload a PDF to start asking questions..."}
             className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-[2rem] pl-7 pr-16 py-5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
           />
           <button
             type="submit"
             disabled={!filename || isLoading || !input.trim()}
             className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-indigo-400 hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black shadow-lg hover:scale-105 active:scale-95"
           >
             <Send className="w-5 h-5 ml-0.5" />
           </button>
        </form>
      </div>
      
      {/* Decorative gradients */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
