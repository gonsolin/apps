import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sun, Moon, Plus, Search, Bell, LogOut, Globe, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "@/i18n/index";
import { LOCALES } from "@/i18n/index";
import { useAuth } from "./AuthProvider";
import { apiRequest } from "@/lib/queryClient";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const { t, locale, setLocale } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();

  const { data: notifData } = useQuery<{ notifications: unknown[]; unreadCount: number }>({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications");
      return res.json();
    },
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const unreadCount = notifData?.unreadCount ?? 0;
  const currentLocale = LOCALES.find((l) => l.value === locale);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="Wantd logo">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="hsl(var(--primary))" strokeWidth="2.5" />
              <path d="M9 12l3.5 10L16 14l3.5 8L23 12" stroke="hsl(var(--primary))" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-base font-semibold tracking-tight">Wantd</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/browse">
            <Button
              variant={location === "/browse" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5"
              data-testid="link-browse"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("nav.browse")}</span>
            </Button>
          </Link>
          <Link href="/post">
            <Button
              size="sm"
              className="gap-1.5"
              data-testid="link-post"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("nav.post")}</span>
            </Button>
          </Link>

          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 px-2"
                data-testid="button-language-selector"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="text-xs hidden sm:inline">{currentLocale?.flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {LOCALES.map((l) => (
                <DropdownMenuItem
                  key={l.value}
                  onClick={() => setLocale(l.value)}
                  className={locale === l.value ? "bg-accent" : ""}
                  data-testid={`menu-locale-${l.value}`}
                >
                  <span className="mr-2">{l.flag}</span>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth section */}
          {isAuthenticated ? (
            <>
              {/* Notifications bell */}
              <Link href="/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 relative"
                  data-testid="link-notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center"
                      data-testid="badge-unread-count"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 px-2"
                    data-testid="button-user-menu"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs max-w-[80px] truncate hidden sm:inline">{user?.displayName}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/export" className="cursor-pointer" data-testid="menu-export">
                      {t("export.title")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-destructive focus:text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-xs" data-testid="link-login">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" size="sm" className="text-xs" data-testid="link-register">
                  {t("nav.register")}
                </Button>
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-1"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}
