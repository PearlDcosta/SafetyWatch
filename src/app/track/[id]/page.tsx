"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAllCrimeReports } from "@/lib/reports";
import { MainNav } from "@/components/main-nav";
import type { CrimeReport as BaseCrimeReport } from "@/types";

interface CrimeReportWithTracking extends BaseCrimeReport {
  trackingId: string;
}

export default function TrackReportPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : null;
  const [report, setReport] = useState<CrimeReportWithTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputId, setInputId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(id);
  const [inputFocused, setInputFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!submittedId) return;
    async function fetchReport() {
      setLoading(true);
      setNotFound(false);
      setError(null);
      try {
        if (!submittedId) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        if (typeof getAllCrimeReports !== "function") {
          setError("Report lookup is not available. Please contact support.");
          setLoading(false);
          return;
        }
        const reports = await getAllCrimeReports();
        if (!Array.isArray(reports)) {
          setError("Unexpected data format from server.");
          setLoading(false);
          return;
        }
        const found = (reports as CrimeReportWithTracking[]).find(r => r.trackingId === submittedId || r.id === submittedId);
        if (found) setReport(found);
        else setNotFound(true);
      } catch (e: any) {
        setError(e?.message || "An error occurred while fetching the report.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [submittedId]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset transition-colors duration-200";
    
    switch (status) {
      case "resolved":
        return `${baseClasses} bg-green-50 text-green-700 ring-green-600/20`;
      case "rejected":
        return `${baseClasses} bg-red-50 text-red-700 ring-red-600/20`;
      case "reviewing":
        return `${baseClasses} bg-blue-50 text-blue-700 ring-blue-600/20`;
      case "verified":
        return `${baseClasses} bg-purple-50 text-purple-700 ring-purple-600/20`;
      default:
        return `${baseClasses} bg-yellow-50 text-yellow-700 ring-yellow-600/20`;
    }
  };

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

          {!submittedId ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputId.trim()) setSubmittedId(inputId.trim());
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
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-fade-in">
              <div className="border-4 border-blue-100 border-t-blue-500 rounded-full h-12 w-12 animate-spin duration-700" />
              <span className="text-blue-600 font-medium animate-pulse">
                Searching for your report...
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-8 space-y-4 animate-fade-in-up">
              <div className="p-3 bg-red-100 rounded-full">
                <svg 
                  className="h-8 w-8 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-red-600">{error}</h3>
                <p className="text-gray-500 text-sm">
                  Please verify your tracking ID and try again
                </p>
              </div>
              <button 
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium rounded-lg transition-colors duration-200"
                onClick={() => { setSubmittedId(null); setInputId(""); }}
              >
                ← Try another ID
              </button>
            </div>
          ) : notFound ? (
            <div className="flex flex-col items-center py-8 space-y-4 animate-fade-in-up">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg 
                  className="h-8 w-8 text-yellow-500" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" 
                  />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-yellow-700">
                  Report Not Found
                </h3>
                <p className="text-gray-500 text-sm">
                  No report found with ID: {submittedId}
                </p>
              </div>
              <button 
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium rounded-lg transition-colors duration-200"
                onClick={() => { setSubmittedId(null); setInputId(""); }}
              >
                ← Try another ID
              </button>
            </div>
          ) : report ? (
            <div className="animate-fade-in-up">
              <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2 pr-2">
                      {report.title}
                    </h2>
                    <span className={getStatusBadge(report.status)}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-3">
                    <span className="flex items-center">
                      <svg 
                        className="h-4 w-4 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" 
                        />
                      </svg>
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <svg 
                        className="h-4 w-4 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      {report.time || "N/A"}
                    </span>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {report.description}
                    </p>
                  </div>

                  {report.location?.address && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        Location
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <svg 
                          className="h-4 w-4 mr-1.5 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
                          />
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
                          />
                        </svg>
                        <span>{report.location.address}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50/50">
                  <div className="flex flex-col space-y-3">
                    <button
                      className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      onClick={() => window.location.assign(`/reports/${report.id}`)}
                    >
                      View Full Details
                    </button>
                    <button
                      className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                      onClick={() => { setSubmittedId(null); setInputId(""); }}
                    >
                      Track another report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}