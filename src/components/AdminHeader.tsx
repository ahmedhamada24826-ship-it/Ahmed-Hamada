"use client";

import React from "react";
import Link from "next/link";
import { Menu, ExternalLink, User, Globe, Bell } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function AdminHeader({ onMenuClick, title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </Link>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-brand-royal/30 text-brand-light flex items-center justify-center font-bold text-xs">
            AH
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-300">
            Ahmed Hamada
          </span>
        </div>
      </div>
    </header>
  );
}
