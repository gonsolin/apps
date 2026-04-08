import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertWantSchema, CATEGORIES, CURRENCIES, type InsertWant } from "@shared/schema";
import { useI18n } from "@/i18n/index";
import { useAuth } from "@/components/AuthProvider";

export default function PostWant() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const { user } = useAuth();

  const form = useForm<InsertWant>({
    resolver: zodResolver(insertWantSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      maxPrice: 0,
      currency: "USD",
      location: "",
      authorName: user?.displayName ?? "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertWant) => {
      const res = await apiRequest("POST", "/api/wants", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: t("post.success"), description: t("post.successDesc") });
      navigate(`/wants/${data.id}`);
    },
    onError: () => {
      toast({ title: t("common.error"), description: "Failed to post your want. Try again.", variant: "destructive" });
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-1 mb-4 -ml-2" data-testid="link-back-home">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("common.back")}
        </Button>
      </Link>

      <Card className="border border-border/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">{t("post.title")}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {t("post.subtitle")}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-5">

              <FormField control={form.control} name="authorName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t("post.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="John D." {...field} data-testid="input-author-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t("post.what")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("post.whatPlaceholder")} {...field} data-testid="input-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t("post.details")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("post.detailsPlaceholder")}
                      className="resize-none h-20"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t("post.category")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder={t("post.categoryPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {t(`cat.${c.value}` as any)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="maxPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t("post.maxPrice")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="500"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        data-testid="input-max-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="currency" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t("post.currency")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue placeholder={t("post.currency")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t("post.location")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("post.locationPlaceholder")} {...field} data-testid="input-location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="button-submit-want"
              >
                {mutation.isPending ? t("post.submitting") : t("post.submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
