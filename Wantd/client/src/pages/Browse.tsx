import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Filter, Package, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import WantCard from "@/components/WantCard";
import { apiRequest } from "@/lib/queryClient";
import type { Want } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";
import { Link } from "wouter";
import { useI18n } from "@/i18n/index";

const LIMIT = 12;

export default function Browse() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{ wants: Want[]; total: number }>({
    queryKey: ["/api/wants", { search, category, location, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category && category !== "all") params.set("category", category);
      if (location) params.set("location", location);
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      const res = await apiRequest("GET", `/api/wants?${params.toString()}`);
      return res.json();
    },
  });

  const wants = data?.wants ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // Reset to page 1 when filters change
  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleCategoryChange = (v: string) => { setCategory(v); setPage(1); };
  const handleLocationChange = (v: string) => { setLocation(v); setPage(1); };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-lg font-semibold" data-testid="text-browse-title">{t("browse.title")}</h1>
        <p className="text-xs text-muted-foreground">
          {t("browse.subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("browse.search")}
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <div className="relative flex-1 sm:max-w-[200px]">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground z-10 pointer-events-none" />
          <Input
            type="text"
            placeholder={t("browse.location")}
            className="pl-9 h-9 text-sm"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            data-testid="input-location-filter"
          />
        </div>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-9 text-sm sm:w-[180px]" data-testid="select-category-filter">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("browse.allCategories")}</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {t(`cat.${c.value}` as any)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="border border-border/60">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : wants.length === 0 ? (
        <Card className="border border-dashed border-border">
          <CardContent className="py-16 text-center space-y-3">
            <Package className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {search || location || category !== "all"
                ? t("browse.noResults")
                : t("browse.empty")}
            </p>
            <Link href="/post">
              <Button size="sm" className="gap-1.5">
                <ArrowRight className="h-3.5 w-3.5" />
                {t("hero.cta.post")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-4" data-testid="text-results-count">
            {total} {total === 1 ? "want" : "wants"} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wants.map((want) => (
              <WantCard key={want.id} want={want} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground" data-testid="text-page-info">
                {t("browse.page", { page: String(page), total: String(totalPages) })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
