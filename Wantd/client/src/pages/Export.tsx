import { useState } from "react";
import {
  Download, FileJson, FileSpreadsheet, Package, ArrowLeftRight,
  BarChart3, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/index";
import { apiRequest } from "@/lib/queryClient";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type ExportType = "wants" | "transactions" | "pricing";
type ExportFormat = "json" | "csv";

export default function Export() {
  const { t } = useI18n();
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: ExportType, format: ExportFormat) => {
    const key = `${type}-${format}`;
    setLoading(key);
    try {
      const url = `/api/export/${type}?format=${format}`;
      const res = await apiRequest("GET", url);
      const contentType = res.headers.get("Content-Type") || "";

      if (format === "csv" || contentType.includes("text/csv")) {
        const blob = await res.blob();
        downloadBlob(blob, `wantd-${type}.csv`);
      } else {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        downloadBlob(blob, `wantd-${type}.json`);
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const sections: {
    type: ExportType;
    title: string;
    icon: typeof Package;
    description: string;
    supportsCsv: boolean;
  }[] = [
    {
      type: "wants",
      title: t("export.wants"),
      icon: Package,
      description: "All posted wants with categories, prices, and locations.",
      supportsCsv: true,
    },
    {
      type: "transactions",
      title: t("export.transactions"),
      icon: ArrowLeftRight,
      description: "Completed transactions with buyer/seller details and final prices.",
      supportsCsv: true,
    },
    {
      type: "pricing",
      title: t("export.pricing"),
      icon: BarChart3,
      description: "Aggregated pricing intelligence by category with demand signals.",
      supportsCsv: false,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 space-y-1">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          <h1 className="text-lg font-semibold" data-testid="text-export-title">
            {t("export.title")}
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">{t("export.subtitle")}</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.type} className="border border-border/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {section.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => handleExport(section.type, "json")}
                    disabled={loading === `${section.type}-json`}
                    data-testid={`button-export-${section.type}-json`}
                  >
                    {loading === `${section.type}-json` ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileJson className="h-3.5 w-3.5" />
                    )}
                    JSON
                  </Button>
                  {section.supportsCsv && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => handleExport(section.type, "csv")}
                      disabled={loading === `${section.type}-csv`}
                      data-testid={`button-export-${section.type}-csv`}
                    >
                      {loading === `${section.type}-csv` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                      )}
                      CSV
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
