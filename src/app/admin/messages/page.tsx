"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Trash2,
  CheckCircle,
  Mail,
  Calendar,
  X,
  Loader2,
  MailOpen,
  Star,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeMessage, setActiveMessage] = useState<any | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg: any) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      try {
        await fetch(`/api/admin/messages/${msg.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
        setMessages(
          messages.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setMessages(messages.filter((m) => m.id !== id));
      if (activeMessage?.id === id) setActiveMessage(null);
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  const toggleStar = async (msg: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !msg.isStarred }),
      });
      if (res.ok) {
        setMessages(
          messages.map((m) =>
            m.id === msg.id ? { ...m, isStarred: !m.isStarred } : m
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-brand-light" />
          <span>Contact Messages &amp; Inquiries Inbox</span>
        </h1>
        <p className="text-xs text-slate-400">
          Review incoming client inquiries, consulting requests, and workshop invitations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by sender name, email, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Messages List & Preview */}
      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading messages...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <Mail className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-xs">Inbox is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Message List (Left 5/12) */}
          <div className="lg:col-span-5 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeMessage?.id === msg.id
                    ? "bg-brand-royal/20 border-brand-royal"
                    : !msg.isRead
                    ? "bg-slate-900 border-brand-royal/40 hover:border-brand-royal"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-xs font-bold ${!msg.isRead ? "text-brand-light" : "text-white"}`}>
                    {msg.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => toggleStar(msg, e)}
                      className={`p-1 ${msg.isStarred ? "text-amber-400" : "text-slate-600 hover:text-slate-400"}`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-300 truncate mb-1">
                  {msg.subject || "No Subject"}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Active Message Detail View (Right 7/12) */}
          <div className="lg:col-span-7">
            {activeMessage ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {activeMessage.subject || "No Subject"}
                    </h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      From: <span className="text-white font-semibold">{activeMessage.name}</span> (&lt;
                      <a
                        href={`mailto:${activeMessage.email}`}
                        className="text-brand-light hover:underline"
                      >
                        {activeMessage.email}
                      </a>
                      &gt;)
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(activeMessage.id)}
                    className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-3 font-mono">
                  <span>Received: {new Date(activeMessage.createdAt).toLocaleString()}</span>
                  {activeMessage.ipAddress && (
                    <span>• IP: {activeMessage.ipAddress}</span>
                  )}
                </div>

                {/* Message Body */}
                <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeMessage.message}
                </div>

                {/* Reply Button */}
                <div className="pt-2">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                      activeMessage.subject || "Inquiry"
                    )}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    <MailOpen className="w-4 h-4" />
                    <span>Reply via Email Client</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                <Mail className="w-8 h-8 mb-2 text-slate-600" />
                <span>Select a message from the list to view its contents.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
