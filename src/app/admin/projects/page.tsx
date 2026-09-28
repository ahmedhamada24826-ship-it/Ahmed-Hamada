"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderGit2,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete project.");
      }
    } catch (err) {
      alert("Error deleting project.");
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (project: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !project.isPublished }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) =>
            p.id === project.id ? { ...p, isPublished: !p.isPublished } : p
          )
        );
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      p.titleAr.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-brand-light" />
            <span>Projects &amp; Case Studies</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage your analytical case studies, Power BI dashboards, and datasets.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="px-4 py-2.5 bg-brand-royal hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-royal/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by project title, tool, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Project Table / Cards */}
      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mr-2 text-brand-royal" />
          <span className="text-xs">Loading projects database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-xs">No projects found.</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-4 py-2 bg-brand-royal text-white rounded-xl text-xs font-semibold"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                          {project.coverImage ? (
                            <Image
                              src={project.coverImage}
                              alt={project.titleEn}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <FolderGit2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-white text-sm line-clamp-1">
                            {project.titleEn}
                          </div>
                          <div className="text-slate-400 text-[11px] line-clamp-1 font-arabic">
                            {project.titleAr}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300 font-medium">
                      {project.categoryName}
                    </td>

                    <td className="p-4">
                      {project.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-royal/20 text-brand-light text-[10px] font-bold">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Standard</span>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(project)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          project.isPublished
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        }`}
                      >
                        {project.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          title="View Case Study"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          title="Edit Project"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-light hover:bg-slate-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.titleEn)}
                          disabled={deletingId === project.id}
                          title="Delete Project"
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
