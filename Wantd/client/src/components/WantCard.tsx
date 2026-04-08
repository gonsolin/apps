import { Link } from "wouter";
import { MapPin, DollarSign, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Want } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useI18n } from "@/i18n/index";

const categoryColors: Record<string, string> = {
  electronics: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  furniture: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  vehicles: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "auto-parts": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  clothing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  services: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "real-estate": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  collectibles: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  sports: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
  books: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  tools: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  music: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  pets: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  health: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  education: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  crafts: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  garden: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
};

interface WantCardProps {
  want: Want;
  offerCount?: number;
}

export default function WantCard({ want, offerCount }: WantCardProps) {
  const { t } = useI18n();
  const timeAgo = formatDistanceToNow(new Date(want.createdAt), { addSuffix: true });

  return (
    <Link href={`/wants/${want.id}`}>
      <Card
        className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20 border border-border/80"
        data-testid={`card-want-${want.id}`}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {want.title}
            </h3>
            <Badge
              variant="secondary"
              className={`shrink-0 text-xs font-medium ${categoryColors[want.category] || categoryColors.other}`}
            >
              {t(`cat.${want.category}` as any)}
            </Badge>
          </div>

          {want.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {want.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium text-foreground">
                {want.maxPrice.toLocaleString()} {want.currency}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {want.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
            {offerCount !== undefined && offerCount > 0 && (
              <span className="flex items-center gap-1 text-primary font-medium">
                <MessageSquare className="h-3 w-3" />
                {offerCount} {offerCount === 1 ? "offer" : "offers"}
              </span>
            )}
          </div>

          {want.status !== "open" && (
            <Badge
              variant={want.status === "fulfilled" ? "default" : "secondary"}
              className="text-xs"
            >
              {want.status === "fulfilled" ? t("common.fulfilled") : t("common.expired")}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
