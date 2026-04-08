import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft, MapPin, DollarSign, Clock, User, MessageSquare, Send, Tag,
  CheckCircle2, Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertOfferSchema, CURRENCIES } from "@shared/schema";
import type { Want, Offer, InsertOffer, Transaction } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";
import { useI18n } from "@/i18n/index";
import { useAuth } from "@/components/AuthProvider";

type WantWithDetails = Want & { offers: Offer[]; transactions: Transaction[] };

export default function WantDetail() {
  const [match, params] = useRoute("/wants/:id");
  const { toast } = useToast();
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const wantId = params?.id ? parseInt(params.id) : 0;

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState("");

  const { data: want, isLoading } = useQuery<WantWithDetails>({
    queryKey: ["/api/wants", wantId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/wants/${wantId}`);
      return res.json();
    },
    enabled: !!wantId,
  });

  const form = useForm<Omit<InsertOffer, "wantId">>({
    resolver: zodResolver(insertOfferSchema.omit({ wantId: true })),
    defaultValues: {
      message: "",
      price: 0,
      currency: "USD",
      location: "",
      offererName: user?.displayName ?? "",
    },
  });

  const offerMutation = useMutation({
    mutationFn: async (data: Omit<InsertOffer, "wantId">) => {
      const res = await apiRequest("POST", `/api/wants/${wantId}/offers`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wants", wantId] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      form.reset();
      toast({ title: t("detail.offerSuccess"), description: t("detail.offerSuccessDesc") });
    },
    onError: () => {
      toast({ title: t("common.error"), description: "Failed to send offer.", variant: "destructive" });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async ({ offerId, price }: { offerId: number; price: number }) => {
      const res = await apiRequest("POST", `/api/wants/${wantId}/complete`, {
        offerId,
        finalPrice: price,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wants", wantId] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setSelectedOfferId(null);
      setFinalPrice("");
      toast({ title: t("detail.dealCompleted"), description: t("detail.dealCompletedDesc") });
    },
    onError: () => {
      toast({ title: t("common.error"), description: "Failed to complete deal.", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!want) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Want not found.</p>
        <Link href="/browse">
          <Button size="sm" variant="outline">{t("nav.browse")}</Button>
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(want.createdAt), { addSuffix: true });
  const dateStr = format(new Date(want.createdAt), "MMM d, yyyy 'at' h:mm a");
  const isOwner = isAuthenticated && user && want.userId === user.id;
  const hasOffers = want.offers.length > 0;
  const canComplete = want.status === "open" && hasOffers;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/browse">
        <Button variant="ghost" size="sm" className="gap-1 mb-4 -ml-2" data-testid="link-back-browse">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("detail.back")}
        </Button>
      </Link>

      {/* Want details */}
      <Card className="border border-border/80 mb-6">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold leading-snug" data-testid="text-want-title">{want.title}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{want.authorName}</span>
                <span className="text-muted-foreground/40">·</span>
                <Clock className="h-3 w-3" />
                <span title={dateStr}>{timeAgo}</span>
              </div>
            </div>
            <Badge
              variant={want.status === "open" ? "default" : "secondary"}
              className="shrink-0"
            >
              {want.status === "open" ? t("common.open") : want.status === "fulfilled" ? t("common.fulfilled") : t("common.expired")}
            </Badge>
          </div>

          {want.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{want.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-semibold">{want.maxPrice.toLocaleString()} {want.currency}</span>
              <span className="text-xs text-muted-foreground">{t("detail.max")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{want.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span>{t(`cat.${want.category}` as any)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      {want.transactions && want.transactions.length > 0 && (
        <Card className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 mb-6">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h2 className="text-sm font-semibold text-green-700 dark:text-green-400">
                {t("detail.transaction")}
              </h2>
            </div>
            {want.transactions.map((tx) => (
              <div key={tx.id} className="text-sm space-y-1" data-testid={`transaction-${tx.id}`}>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  <span className="font-semibold">{tx.finalPrice.toLocaleString()} {tx.currency}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {tx.buyerName} ← {tx.sellerName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("detail.completedAt")}: {format(new Date(tx.completedAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Offers section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {t("detail.offers", { count: String(want.offers.length) })}
        </h2>

        {want.offers.length > 0 ? (
          <div className="space-y-3">
            {want.offers.map((offer) => (
              <Card
                key={offer.id}
                className={`border ${selectedOfferId === offer.id ? "border-primary ring-1 ring-primary/20" : "border-border/60"}`}
                data-testid={`card-offer-${offer.id}`}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="font-medium text-foreground">{offer.offererName}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}</span>
                      {offer.status !== "pending" && (
                        <Badge variant={offer.status === "accepted" ? "default" : "secondary"} className="text-xs ml-1">
                          {offer.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                        <DollarSign className="h-3.5 w-3.5" />
                        {offer.price.toLocaleString()} {offer.currency}
                      </div>
                      {canComplete && offer.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => {
                            setSelectedOfferId(offer.id);
                            setFinalPrice(String(offer.price));
                          }}
                          data-testid={`button-select-offer-${offer.id}`}
                        >
                          <Handshake className="h-3 w-3" />
                          {t("detail.completeDeal")}
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{offer.message}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {offer.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-dashed border-border">
            <CardContent className="py-8 text-center">
              <p className="text-xs text-muted-foreground">{t("detail.noOffers")}</p>
            </CardContent>
          </Card>
        )}

        {/* Complete deal form */}
        {selectedOfferId && canComplete && (
          <>
            <Separator className="my-4" />
            <Card className="border border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-primary" />
                  {t("detail.completeDeal")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block">{t("detail.finalPrice")}</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    placeholder="Final agreed price"
                    data-testid="input-final-price"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const price = parseFloat(finalPrice);
                      if (price > 0 && selectedOfferId) {
                        completeMutation.mutate({ offerId: selectedOfferId, price });
                      }
                    }}
                    disabled={completeMutation.isPending || !finalPrice || parseFloat(finalPrice) <= 0}
                    className="gap-1"
                    data-testid="button-confirm-deal"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {completeMutation.isPending ? t("common.loading") : t("detail.confirmDeal")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setSelectedOfferId(null); setFinalPrice(""); }}
                    data-testid="button-cancel-deal"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Make an offer form */}
        {want.status === "open" && (
          <>
            <Separator className="my-6" />
            <Card className="border border-border/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t("detail.makeOffer")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((d) => offerMutation.mutate(d))} className="space-y-4">

                    <FormField control={form.control} name="offererName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t("detail.offerName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane S." {...field} data-testid="input-offerer-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t("detail.offerMessage")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("detail.offerMessagePlaceholder")}
                            className="resize-none h-20"
                            {...field}
                            data-testid="input-offer-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">{t("detail.offerPrice")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="400"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-offer-price"
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
                              <SelectTrigger data-testid="select-offer-currency">
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
                        <FormLabel className="text-xs font-medium">{t("detail.offerLocation")}</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Oakland, CA" {...field} data-testid="input-offer-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={offerMutation.isPending}
                      data-testid="button-submit-offer"
                    >
                      {offerMutation.isPending ? t("detail.offerSubmitting") : t("detail.offerSubmit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
