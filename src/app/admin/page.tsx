import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FolderGit2,
  Cpu,
  Award,
  MessageSquare,
  PlusCircle,
  Settings,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalSkills,
    totalServices,
    totalCertificates,
    totalMessages,
    unreadMessages,
    recentMessages,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.project.count({ where: { isPublished: false } }),
    prisma.skill.count(),
    prisma.service.count(),
    prisma.certificate.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      take: 4,
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const statsCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      subtext: `${publishedProjects} Published • ${draftProjects} Drafts`,
      icon: FolderGit2,
      color: "from-blue-600 to-indigo-600",
      href: "/admin/projects",
    },
    {
      title: "Skills & Tech",
      value: totalSkills,
      subtext: "Categorized competencies",
      icon: Cpu,
      color: "from-cyan-600 to-blue-600",
      href: "/admin/skills",
    },
    {
      title: "Certificates",
      value: totalCertificates,
      subtext: "Verified credentials",
      icon: Award,
      color: "from-emerald-600 to-teal-600",
      href: "/admin/certificates",
    },
    {
      title: "Contact Messages",
      value: totalMessages,
      subtext: `${unreadMessages} Unread messages`,
      icon: MessageSquare,
      color: "from-purple-600 to-indigo-600",
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Portfolio Dashboard Overview</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-royal/20 text-brand-light font-mono font-normal">
              v1.0
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome back, Ahmed Hamada. Manage every section, project, skill, and message from here.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 text-xs font-bold text-white bg-brand-royal hover:bg-blue-600 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="group bg-slate-900 border border-slate-800 hover:border-brand-royal/50 rounded-2xl p-5 transition-all hover:-translate-y-1 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-white font-mono">{card.value}</div>
                <div className="text-[11px] text-slate-400 mt-1">{card.subtext}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Two Columns: Recent Projects & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Projects (8 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-brand-light" />
              <span>Recent Projects</span>
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-brand-light hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="space-y-1 pr-3">
                  <div className="text-sm font-bold text-white line-clamp-1">{p.titleEn}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <span>{p.categoryName}</span>
                    <span>•</span>
                    <span className={p.isPublished ? "text-emerald-400" : "text-amber-400"}>
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-brand-royal text-white rounded-lg transition-colors shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contact Messages (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-light" />
              <span>Recent Inquiries</span>
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-brand-light hover:underline flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    !msg.isRead
                      ? "bg-brand-royal/10 border-brand-royal/30"
                      : "bg-slate-800/40 border-slate-700/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <div className="text-xs text-brand-light font-medium truncate mb-1">
                    {msg.subject || "No Subject"}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Fast Navigation Shortcut Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Quick Management Portals
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link
            href="/admin/hero"
            className="p-3 bg-slate-800/60 hover:bg-brand-royal/20 border border-slate-700/60 rounded-xl text-center transition-colors"
          >
            <Sparkles className="w-5 h-5 text-brand-light mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-white block">Hero Editor</span>
          </Link>
          <Link
            href="/admin/skills"
            className="p-3 bg-slate-800/60 hover:bg-brand-royal/20 border border-slate-700/60 rounded-xl text-center transition-colors"
          >
            <Cpu className="w-5 h-5 text-brand-light mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-white block">Skills Stack</span>
          </Link>
          <Link
            href="/admin/services"
            className="p-3 bg-slate-800/60 hover:bg-brand-royal/20 border border-slate-700/60 rounded-xl text-center transition-colors"
          >
            <Briefcase className="w-5 h-5 text-brand-light mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-white block">Services</span>
          </Link>
          <Link
            href="/admin/experience"
            className="p-3 bg-slate-800/60 hover:bg-brand-royal/20 border border-slate-700/60 rounded-xl text-center transition-colors"
          >
            <Clock className="w-5 h-5 text-brand-light mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-white block">Timeline</span>
          </Link>
          <Link
            href="/admin/settings"
            className="p-3 bg-slate-800/60 hover:bg-brand-royal/20 border border-slate-700/60 rounded-xl text-center transition-colors"
          >
            <Settings className="w-5 h-5 text-brand-light mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-white block">Site Settings</span>
          </Link>
          <Link
            href="/admin/theme"
            className="p-3 bg-slate-800/60 hover:bg-brand-royal/20 border border-slate-700/60 rounded-xl text-center transition-colors"
          >
            <CheckCircle2 className="w-5 h-5 text-brand-light mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-white block">Theme & Brand</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
