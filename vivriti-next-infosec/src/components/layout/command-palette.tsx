import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, CornerDownLeft, FileText, Building2, ClipboardList, LayoutDashboard, HelpCircle } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { entities, assessments, templates } from "@/data/mock";
import { cn } from "@/lib/utils";

interface Result { label: string; sub: string; to: string; icon: React.ElementType; }

export function CommandPalette() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo<Result[]>(() => {
    const pages: Result[] = [
      { label: "Dashboard", sub: "Overview", to: "/dashboard", icon: LayoutDashboard },
      { label: "Question Bank", sub: "Question Master", to: "/questions", icon: HelpCircle },
      { label: "Templates", sub: "Assessment design", to: "/templates", icon: FileText },
      { label: "Entities", sub: "Third parties", to: "/entities", icon: Building2 },
      { label: "Assessments", sub: "All assessments", to: "/assessments", icon: ClipboardList },
    ];
    if (!q.trim()) return pages;
    const term = q.toLowerCase();
    const ent = entities.filter((e) => e.name.toLowerCase().includes(term)).slice(0, 5)
      .map((e) => ({ label: e.name, sub: `${e.type} · ${e.riskRating} risk`, to: `/entities/${e.id}`, icon: Building2 }));
    const asm = assessments.filter((a) => a.code.toLowerCase().includes(term) || a.entityName.toLowerCase().includes(term)).slice(0, 5)
      .map((a) => ({ label: a.code, sub: a.entityName, to: `/assessments/${a.id}`, icon: ClipboardList }));
    const tpl = templates.filter((t) => t.name.toLowerCase().includes(term)).slice(0, 4)
      .map((t) => ({ label: t.name, sub: `${t.questionCount} questions`, to: `/templates/${t.id}`, icon: FileText }));
    return [...pages.filter((p) => p.label.toLowerCase().includes(term)), ...ent, ...asm, ...tpl];
  }, [q]);

  if (!searchOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setSearchOpen(false)} />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border bg-popover shadow-popover animate-slide-up">
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vendors, assessments, templates, pages…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <kbd className="hidden sm:inline rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>}
          {results.map((r, i) => (
            <button key={i} onClick={() => { navigate(r.to); setSearchOpen(false); setQ(""); }}
              className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left hover:bg-muted")}>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground"><r.icon className="h-4 w-4" /></span>
              <span className="flex-1 min-w-0">
                <span className="block truncate text-sm font-medium">{r.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{r.sub}</span>
              </span>
              <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
