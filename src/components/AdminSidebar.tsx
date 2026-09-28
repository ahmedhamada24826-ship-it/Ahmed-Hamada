"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  User,
  Cpu,
  Briefcase,
  FolderGit2,
  Calendar,
  GraduationCap,
  Award,
  Menu,
  MessageSquare,
  Image as ImageIcon,
  Search,
  Palette,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronLeft,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
}

export function AdminSidebar({ isOpen, onClose, unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      title: "Core CMS",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Projects & Cases", href: "/admin/projects", icon: FolderGit2 },
        { label: "Skills & Tech", href: "/admin/skills", icon: Cpu },
        { label: "Services", href: "/admin/services", icon: Briefcase },
        { label: "Experience", href: "/admin/experience", icon: Calendar },
        { label: "Education", href: "/admin/education", icon: GraduationCap },
        { label: "Certificates", href: "/admin/certificates", icon: Award },
      ],
    },
    {
      title: "Content & Sections",
      items: [
        { label: "Hero Section", href: "/admin/hero", icon: Sparkles },
        { label: "About Me", href: "/admin/about", icon: User },
        { label: "Navigation Menu", href: "/admin/navigation", icon: Menu },
        {
          label: "Messages Inbox",
          href: "/admin/messages",
          icon: MessageSquare,
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      title: "Settings & System",
      items: [
        { label: "Website Settings", href: "/admin/settings", icon: Settings },
        { label: "Theme & Styling", href: "/admin/theme", icon: Palette },
        { label: "SEO & Social", href: "/admin/seo", icon: Search },
        { label: "Account & Security", href: "/admin/account", icon: ShieldCheck },
      ],
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-royal flex items-center justify-center text-white font-bold text-base shadow-md">
              AH
            </div>
            <div>
              <div className="font-bold text-white text-sm">Ahmed Hamada</div>
              <div className="text-[10px] text-brand-light font-medium tracking-wide uppercase">
                Admin Control Center
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item, iIdx) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-brand-royal text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-light text-slate-900">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Live Website</span>
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
