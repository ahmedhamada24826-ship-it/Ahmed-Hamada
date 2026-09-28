"use client";

import React from "react";
import * as Icons from "lucide-react";

interface IconRendererProps {
  name?: string | null;
  className?: string;
  size?: number;
}

export function IconRenderer({ name, className = "w-5 h-5", size }: IconRendererProps) {
  if (!name) return <Icons.Sparkles className={className} size={size} />;

  const cleanName = name.trim();
  const iconMap = Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>;
  const LucideIcon = iconMap[cleanName] || Icons.BarChart3;

  return <LucideIcon className={className} size={size} />;
}
