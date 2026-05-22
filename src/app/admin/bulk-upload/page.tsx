"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { UploadCloud, FileSpreadsheet, Trash2, ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Clock, FileWarning } from "lucide-react";
import Link from "next/link";

interface ImportProgress {
  status: "pending" | "processing" | "completed" | "failed" | "unknown";
  processed: number;
  failed: number;
  errors: string[];
  completed_at: string | null;
}

export default function AdminBulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [batchToken, setBatchToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Progress status polling
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [polling, setPolling] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  // Handle input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setSuccess(null);
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (extension !== "xlsx" && extension !== "csv" && extension !== "xls") {
      setError("Unsupported file format. Please upload an Excel (.xlsx, .xls) or CSV (.csv) spreadsheet.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);
    setBatchToken(null);
    setProgress(null);

    const formData = new FormData();
    formData.append("excel_file", file);

    try {
      const res = await fetch(`${API_URL}/api/admin/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Spreadsheet uploaded successfully! Dispatching parsing worker to process records.");
        setBatchToken(data.batch_token);
        setFile(null);
        setPolling(true);
      } else {
        setError(data.message || "Bulk upload ingestion failed. Check your file columns mapping.");
      }
    } catch (err) {
      setError("Error sending multipart/form-data request to Laravel servers.");
    } finally {
      setUploading(false);
    }
  };

  // Status Polling Loop
  useEffect(() => {
    if (!batchToken || !polling) return;

    const pollStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/bulk-upload/status/${batchToken}`);
        if (res.ok) {
          const data = await res.json();
          setProgress(data);

          // If the status is completed or failed, stop polling
          if (data.status === "completed" || data.status === "failed") {
            setPolling(false);
            if (data.status === "completed") {
              setSuccess("Ingestion completed! All catalog items were verified, and inventory databases populated.");
            } else {
              setError("Queue worker encountered a fatal failure when parsing records.");
            }
          }
        }
      } catch (err) {
        console.error("Error polling queue status:", err);
      }
    };

    // Poll immediately on mount
    pollStatus();

    // Setup recurring interval of 2 seconds
    pollTimerRef.current = setInterval(pollStatus, 2000);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [batchToken, polling]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-[#a15c38] selection:text-white">
      {/* Mini Header */}
      <header className="bg-[#1c1c1c] text-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 hover:bg-neutral-800 rounded transition text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xs font-serif tracking-widest uppercase">West Elm India</h1>
            <p className="text-[10px] text-[#c2966e] tracking-widest uppercase font-semibold">
              Bulk Catalog Ingestion Zone
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">

        {/* Messages Feedback */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left/Main Column - Drag & Drop Zone */}
          <div className="md:col-span-7 bg-white p-6 md:p-8 border border-neutral-200 rounded shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-serif text-neutral-900 tracking-wide mb-1">Spreadsheet Loader</h2>
              <p className="text-neutral-500 text-[11px] uppercase tracking-wider">
                Upload CSV or Excel catalogs directly to SQL
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">

              {/* Drag Area */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition duration-300 ${isDragActive
                    ? "border-[#a15c38] bg-[#a15c38]/5"
                    : "border-neutral-300 bg-[#fbfbf9] hover:bg-[#f6f4f0]"
                  }`}
              >
                <input
                  type="file"
                  id="spreadsheet-file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <UploadCloud className={`w-12 h-12 mb-4 transition duration-300 ${isDragActive ? "text-[#a15c38] scale-110" : "text-neutral-400"}`} />

                {file ? (
                  <div className="space-y-1 z-10">
                    <p className="text-xs font-bold text-neutral-800 flex items-center justify-center gap-1.5 font-mono">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      {file.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-1 z-10">
                    <p className="text-xs font-medium text-neutral-800">
                      Drag and drop your spreadsheet here, or <span className="text-[#a15c38] underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-neutral-400">Accepts Excel (.xlsx, .xls) and CSV format, up to 20MB</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs tracking-widest uppercase font-semibold transition rounded flex items-center justify-center gap-2 cursor-pointer border border-neutral-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={uploading || !file}
                  className={`flex-1 py-3 text-white text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow ${!file
                      ? "bg-neutral-300 cursor-not-allowed"
                      : "bg-[#a15c38] hover:bg-[#894b2c]"
                    }`}
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Multipart Data...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Start Catalog Import</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column - Status Deck & Tracking */}
          <div className="md:col-span-5 bg-white border border-neutral-200 rounded shadow-sm overflow-hidden self-stretch flex flex-col">
            <div className="p-5 border-b border-neutral-200 bg-neutral-50/50">
              <h3 className="text-xs font-serif tracking-wider uppercase text-neutral-900">
                Queue Worker Monitoring
              </h3>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center space-y-6">

              {!progress ? (
                <div className="text-center py-8 text-neutral-400 flex flex-col items-center justify-center gap-3">
                  <Clock className="w-10 h-10 text-neutral-300" />
                  <p className="text-xs max-w-xs mx-auto leading-relaxed">
                    No active ingestion logs. Upload a product sheet to monitor the background queue worker processing ratios.
                  </p>

                  {/* Queue listen reminder */}
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] uppercase font-bold tracking-widest text-center mt-3 rounded">
                    ⚠️ Run: php artisan queue:listen
                  </div>
                </div>
              ) : (
                <div className="space-y-6">

                  {/* Status Indicator Banner */}
                  <div className={`p-4 border rounded flex items-center justify-between ${progress.status === "completed"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : progress.status === "processing"
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-neutral-50 border-neutral-200 text-neutral-800"
                    }`}>
                    <div className="flex items-center gap-2">
                      {progress.status === "completed" && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {progress.status === "processing" && <RefreshCw className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />}
                      {progress.status === "pending" && <Clock className="w-5 h-5 text-neutral-600 shrink-0" />}
                      {progress.status === "failed" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}

                      <div className="text-xs">
                        <span className="font-semibold block uppercase tracking-wider font-mono">
                          Status: {progress.status}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">Batch ID: {batchToken}</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      <span>Records Processed</span>
                      <span className="font-mono text-neutral-800">
                        {progress.processed} Total
                      </span>
                    </div>

                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                      <div
                        className={`h-full transition-all duration-300 ${progress.status === "completed" ? "bg-emerald-600" : "bg-[#a15c38]"
                          }`}
                        style={{
                          width: `${progress.status === "completed" ? 100 : Math.max(10, Math.min(100, (progress.processed / (progress.processed + progress.failed || 1)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Success vs Fail Ratios */}
                  <div className="grid grid-cols-2 gap-4 text-center font-mono">
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-0.5">Inserted</span>
                      <span className="text-lg font-bold text-emerald-700">{progress.processed - progress.failed}</span>
                    </div>
                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-0.5">Failed</span>
                      <span className="text-lg font-bold text-rose-700">{progress.failed}</span>
                    </div>
                  </div>

                  {/* Errors log */}
                  {progress.errors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                        <FileWarning className="w-3.5 h-3.5 text-rose-600" />
                        <span>Parser Warnings &amp; Errors ({progress.errors.length})</span>
                      </span>
                      <div className="max-h-32 overflow-y-auto bg-neutral-900 border border-neutral-800 p-3 rounded font-mono text-[9px] text-[#c2966e] space-y-1.5">
                        {progress.errors.map((err, i) => (
                          <div key={i} className="leading-relaxed border-b border-neutral-800 pb-1.5 last:border-0 last:pb-0">
                            {err}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
