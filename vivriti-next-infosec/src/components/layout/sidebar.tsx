import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ShieldCheck, PanelLeftClose, PanelLeft } from "lucide-react";
import {
    internalNav,
    reviewerNav,
    vendorNav,
    type NavGroup
} from "./nav-config";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { cn, LOGO_URL } from "@/lib/utils";

function NavItems({ groups, collapsed }: { groups: NavGroup[]; collapsed: boolean }) {
  const location = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    groups.forEach((g) => g.items.forEach((it) => {
      if (it.children?.some((c) => location.pathname.startsWith(c.to))) init[it.label] = true;
    }));
    return init;
  });

  const linkCls = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active ? "bg-sidebar-accent/15 text-white" : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white"
    );

  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      {groups.map((group) => (
        <div key={group.title}>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">{group.title}</p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              if (item.children) {
                const isOpen = open[item.label];
                const childActive = item.children.some((c) => location.pathname.startsWith(c.to));
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setOpen((o) => ({ ...o, [item.label]: !o[item.label] }))}
                      className={cn(linkCls(childActive && !isOpen), "w-full justify-between")}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="flex items-center gap-3"><item.icon className="h-[18px] w-[18px] shrink-0" />{!collapsed && item.label}</span>
                      {!collapsed && <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />}
                    </button>
                    {isOpen && !collapsed && (
                      <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                        {item.children.map((c) => (
                          <NavLink key={c.to} to={c.to} end className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-sm">{c.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavLink key={item.to} to={item.to!} className={({ isActive }) => linkCls(isActive)} title={collapsed ? item.label : undefined}>
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar({ vendor = false }: { vendor?: boolean }) {
  const { sidebarCollapsed, toggleSidebar, mobileNavOpen, setMobileNav } = useUIStore();
  const { user } = useAuthStore();
    let groups: NavGroup[];

    if (vendor) {
        groups = vendorNav;
    } else if (user?.role === "REVIEWER") {
        groups = reviewerNav;
    } else {
        groups = internalNav;
    }

  const content = (collapsed: boolean) => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4", collapsed && "justify-center px-2")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white p-1">
          <img src={LOGO_URL} alt="Vivriti NEXT" className="h-full w-full object-contain" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white leading-tight">Vivriti NEXT InfoSec</p>
            <p className="truncate text-[10px] text-sidebar-muted">GRC Platform{vendor ? " · Vendor" : ""}</p>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <NavItems groups={groups} collapsed={collapsed} />
      </div>
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2 rounded-md bg-white/5 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">{user?.role}</p>
              <p className="truncate text-[10px] text-sidebar-muted">{vendor ? user?.company : "Vivriti NEXT"}</p>
            </div>
          </div>
        )}
        {!vendor && (
          <button onClick={toggleSidebar} className="hidden lg:flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-white/5 hover:text-white">
            {collapsed ? <PanelLeft className="h-[18px] w-[18px]" /> : <><PanelLeftClose className="h-[18px] w-[18px]" /> Collapse</>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn("hidden lg:block shrink-0 transition-all duration-200", sidebarCollapsed ? "w-[68px]" : "w-64")}>
        {content(sidebarCollapsed)}
      </aside>
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMobileNav(false)} />
          <div className="absolute left-0 top-0 h-full w-64 animate-slide-in-right">{content(false)}</div>
        </div>
      )}
    </>
  );
}
