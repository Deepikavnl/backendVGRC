import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Sun, Moon, Bell, LogOut, User, Settings, Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/store/theme";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { notifications } from "@/data/mock";

export function Header({ vendor = false }: { vendor?: boolean }) {
  const { theme, toggle } = useThemeStore();
  const { setMobileNav, setSearchOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur-md lg:px-6">
      <button className="lg:hidden text-muted-foreground" onClick={() => setMobileNav(true)}><Menu className="h-5 w-5" /></button>

      <button onClick={() => setSearchOpen(true)}
        className="hidden md:flex h-9 min-w-[240px] items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground hover:border-primary/40 transition-colors">
        <Search className="h-4 w-4" />
        <span>Search…</span>
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
      <button onClick={() => setSearchOpen(true)} className="md:hidden text-muted-foreground"><Search className="h-5 w-5" /></button>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </Button>
        <Link to={vendor ? "/vendor/messages" : "/notifications"} className="relative">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">{unread}</span>}
          </Button>
        </Link>

        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted transition-colors">
              <Avatar name={user?.name ?? "User"} className="h-8 w-8" />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight">{user?.name}</span>
                <span className="block text-[11px] text-muted-foreground leading-tight">{user?.role}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>
          }
        >
          <DropdownLabel>{user?.email}</DropdownLabel>
          <DropdownSeparator />
          {!vendor && <>
            <DropdownItem onClick={() => navigate("/profile")}><User /> Profile</DropdownItem>
            <DropdownItem onClick={() => navigate("/settings")}><Settings /> Settings</DropdownItem>
            <DropdownItem onClick={() => navigate("/about")}><Info /> About</DropdownItem>
            <DropdownSeparator />
          </>}
          <DropdownItem destructive onClick={() => { logout(); navigate("/login"); }}><LogOut /> Sign out</DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
