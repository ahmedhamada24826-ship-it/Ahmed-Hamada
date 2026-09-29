"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.media) setMedia(data.media);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("folder", "general");

      try {
        await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
      } catch (err) {
        console.error("Upload failed for file:", files[i].name);
      }
    }
    setUploading(false);
    loadMedia();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media asset "${name}"?`)) return;
    try {
      await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      setMedia(media.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete media asset.");
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = media.filter(
    (m) =>
      m.fileName.toLowerCase().includes(search.toLowerCase()) ||
      m.originalName.toLowerCase().includes(search.toLowerCase()) ||
      m.folder.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-brand-light" />
            <span>Centralized Media Library</span>
          </h1>
          <p className="text-xs text-slate-400">
            Upload, preview, organize, and manage image assets and documents.
          </p>
        </div>

        <label className="px-4 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? "Uploading..." : "Upload Media Files"}</span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by file name or folder..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading media assets...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-xs">No media files found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-brand-royal/50 transition-all shadow-sm"
            >
              {/* Preview Thumbnail */}
              <div className="relative aspect-square w-full bg-slate-800">
                {item.mimeType.startsWith("image/") ? (
                  <img src={item.url} alt={item.originalName} className="object-cover w-full h-full group-hover:scale-105 transition-transform absolute inset-0" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-400">
                    <FileText className="w-10 h-10 mb-1 text-brand-light" />
                    <span className="text-[10px] font-mono uppercase truncate w-full text-center">
                      {item.mimeType.split("/")[1] || "DOC"}
                    </span>
                  </div>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-3 space-y-2">
                <div className="text-xs font-semibold text-white truncate" title={item.originalName}>
                  {item.originalName}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{formatBytes(item.size)}</span>
                  <span>{item.folder}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => copyToClipboard(item.url, item.id)}
                    title="Copy URL"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-light hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px]"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === item.id ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.originalName)}
                    title="Delete File"
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
