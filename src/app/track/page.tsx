"use client";
import { useState } from "react";
import { MainNav } from "@/components/main-nav";
import { useRouter } from "next/navigation";

export default function TrackReportEntryPage() {
  const [inputId, setInputId] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const router = useRouter();

  return (
    <>
      <MainNav />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 transition-all duration-300">
        <div className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <svg 
              className="h-8 w-8 text-blue-500 transition-transform hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 3l8 4v5c0 5.25-3.5 9.75-8 11-4.5-1.25-8-5.75-8-11V7l8-4z" 
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Track Your Report
            </h1>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputId.trim()) {
                router.push(`/track/${inputId.trim()}`);
              }
            }}
            className="space-y-6 animate-fade-in-up"
          >
            <div className="relative">
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className={`peer w-full px-5 py-3.5 border ${
                  inputFocused ? "border-blue-400" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 bg-white placeholder-transparent text-gray-700`}
                placeholder="Tracking ID"
                required
              />
              <label
                className={`absolute left-5 transition-all duration-200 pointer-events-none ${
                  inputFocused || inputId
                    ? "-top-2.5 text-xs bg-white px-1 text-blue-500"
                    : "top-3.5 text-gray-400"
                }`}
              >
                Tracking ID
              </label>
              <span className="absolute right-4 top-3.5 text-blue-400/80 transition-colors duration-200 peer-focus:text-blue-500">
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
              </span>
            </div>
            <button 
              type="submit" 
              className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-[0.98]"
            >
              Track Report
            </button>
            <p className="text-center text-sm text-gray-400 animate-pulse">
              Enter your 16-character tracking ID
            </p>
          </form>
        </div>
      </div>
    </>
  );
}