import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Bell, BellRing, Check, CheckCheck, MessageSquare, Handshake, XCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/components/AuthProvider";
import { useI18n } from "@/i18n/index";
import type { Notification } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";

const typeIcons: Record<string, typeof Bell> = {
  new_offer: MessageSquare,
  offer_accepted: Check,
  offer_declined: XCircle,
  deal_completed: Handshake,
};

export default function Notifications() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const { data, isLoading } = useQuery<{ notifications: Notification[]; unreadCount: number }>({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  if (!isAuthenticated) return null;

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-lg font-semibold" data-testid="text-notifications-title">
            {t("notif.title")}
          </h1>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">({unreadCount})</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            data-testid="button-mark-all-read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            {t("notif.markAllRead")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-border/60">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="border border-dashed border-border">
          <CardContent className="py-16 text-center space-y-3">
            <BellRing className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("notif.empty")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Package;
            const isUnread = !notif.read;

            return (
              <Card
                key={notif.id}
                className={`border cursor-pointer transition-colors ${
                  isUnread
                    ? "border-primary/20 bg-primary/5 hover:bg-primary/10"
                    : "border-border/60 hover:bg-muted/50"
                }`}
                onClick={() => {
                  if (isUnread) markReadMutation.mutate(notif.id);
                }}
                data-testid={`notification-${notif.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      isUnread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-sm ${isUnread ? "font-semibold" : "font-medium"}`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                    {isUnread && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
