import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Search, Package, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WantCard from "@/components/WantCard";
import type { Want } from "@shared/schema";
import { useI18n } from "@/i18n/index";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { t } = useI18n();

  const { data, isLoading } = useQuery<{ wants: Want[]; total: number }>({
    queryKey: ["/api/wants"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/wants");
      return res.json();
    },
  });

  const { data: stats } = useQuery<{
    totalWants: number;
    totalOffers: number;
    totalFulfilled: number;
    avgPrice: number;
    totalTransactions: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const recentWants = data?.wants?.slice(0, 6) ?? [];

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 dark:from-primary/10 dark:to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl space-y-5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight" data-testid="text-hero-title">
              {t("hero.title1")}
              <br />
              <span className="text-primary">{t("hero.title2")}</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/post">
                <Button size="default" className="gap-2" data-testid="button-hero-post">
                  {t("hero.cta.post")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="default" className="gap-2" data-testid="button-hero-browse">
                  <Search className="h-4 w-4" />
                  {t("hero.cta.browse")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-base font-semibold mb-6">{t("how.title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Package,
              title: t("how.step1.title"),
              desc: t("how.step1.desc"),
            },
            {
              icon: Users,
              title: t("how.step2.title"),
              desc: t("how.step2.desc"),
            },
            {
              icon: TrendingUp,
              title: t("how.step3.title"),
              desc: t("how.step3.desc"),
            },
          ].map((step, i) => (
            <Card key={i} className="border border-border/60">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      {stats && stats.totalWants > 0 && (
        <section className="border-y border-border/40 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: t("stats.wants"), value: stats.totalWants, icon: Package },
                { label: t("stats.offers"), value: stats.totalOffers, icon: Users },
                { label: t("stats.deals"), value: stats.totalFulfilled, icon: TrendingUp },
                { label: t("stats.avg"), value: `$${stats.avgPrice.toLocaleString()}`, icon: BarChart3 },
              ].map((stat, i) => (
                <div key={i} className="text-center space-y-1">
                  <stat.icon className="h-4 w-4 mx-auto text-muted-foreground" />
                  <div className="text-lg font-bold" data-testid={`text-stat-${i}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent wants */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">{t("common.recentWants")}</h2>
          <Link href="/browse">
            <Button variant="ghost" size="sm" className="gap-1 text-xs" data-testid="link-view-all">
              {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-border/60">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentWants.length === 0 ? (
          <Card className="border border-dashed border-border">
            <CardContent className="py-12 text-center space-y-3">
              <Package className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">{t("browse.empty")}</p>
              <Link href="/post">
                <Button size="sm" className="gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                  {t("hero.cta.post")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentWants.map((want) => (
              <WantCard key={want.id} want={want} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
