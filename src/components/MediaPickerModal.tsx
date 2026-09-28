"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Check, Image as ImageIcon, Search, Loader2 } from "lucide-react";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  folder?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select Image",
  folder = "general",
}: MediaPickerModalProps) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.media) setMedia(data.media);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.file?.url) {
        onSelect(data.file.url);
        onClose();
      }
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const filteredMedia = media.filter(
    (item) =>
      item.fileName.toLowerCase().includes(search.toLowerCase()) ||
      item.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-light" />
            <span>{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Action & URL Input Bar */}
        <div className="py-4 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <label className="w-full sm:w-auto px-4 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload New File"}</span>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {/* Direct URL input */}
          <div className="flex items-center gap-2 w-full sm:flex-1">
            <input
              type="url"
              placeholder="Or paste direct image URL (e.g. https://...)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-royal"
            />
            {customUrl && (
              <button
                onClick={() => {
                  onSelect(customUrl);
                  onClose();
                }}
                className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-500"
              >
                Apply
              </button>
            )}
          </div>
        </div>

        {/* Search Media */}
        <div className="pt-3 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search uploaded media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto py-3">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading media library...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No media files found. Upload an image above to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 hover:border-brand-royal cursor-pointer transition-all"
                >
                  <Image
                    src={item.url}
                    alt={item.originalName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-brand-royal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[10px] text-white truncate text-center">
                    {item.originalName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
