import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { buildWhatsAppUrl, getStoreBySlug, storefronts } from "@/lib/marketplace-data";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Star,
  Timer,
  Twitter,
  Wallet,
  WhatsApp,
} from "lucide-react";

type StoreProfileProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return storefronts.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: StoreProfileProps) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  return {
    title: store ? `${store.name} | Mom & Pop Marketplace` : "Storefront | Mom & Pop Marketplace",
    description: store?.description,
  };
}

export default async function StoreProfile({ params }: StoreProfileProps) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const storeMessage = buildWhatsAppUrl(
    store.whatsapp,
    `Hi ${store.name}, I found your Mom & Pop Marketplace storefront and want to order.`,
  );

  return (
    <div className="pb-12">
      {/* ===== HERO HEADER ===== */}
      <section className="border-b border-border bg-[linear-gradient(135deg,rgba(20,97,84,0.14),rgba(226,181,80,0.22)),linear-gradient(180deg,#ffffff,#f7fbf8)]">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Back button */}
          <Link
            href="/stores"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to storefronts
          </Link>

          {/* Store header grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            {/* Logo */}
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white p-4 text-3xl font-black text-primary shadow-md ring-2 ring-primary/10 sm:p-5 sm:text-4xl">
              {store.initials}
            </div>

            {/* Info */}
            <div className="min-w-0">
              {/* Badges row */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 py-1 text-xs">
                  <BadgeCheck className="size-3 mr-1" />
                  {store.verifiedTier} verified
                </Badge>
                {store.boosted && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 px-2.5 py-1 text-xs">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge variant="outline" className="px-2.5 py-1 text-xs">{store.category}</Badge>
              </div>

              {/* Store name */}
              <h1 className="text-balance text-3xl font-black tracking-tight sm:text-4xl md:text-5xl truncate">
                {store.name}
              </h1>

              {/* Description */}
              <p className="mt-2 max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
                {store.description}
              </p>

              {/* Location & Rating */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0" />
                  {store.address}
                </span>
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <Star className="size-4 fill-current" />
                  {store.rating.toFixed(1)} ({store.reviews} reviews)
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <a href={storeMessage} target="_blank" rel="noreferrer" className="flex-1">
                <Button className="w-full bg-[#1f9d55] hover:bg-[#188348] h-11 px-5 shadow-md shadow-green-500/20 group">
                  <WhatsApp className="size-4" />
                  <span className="ml-2">Order via WhatsApp</span>
                </Button>
              </a>
              <div className="flex gap-2 xl:flex-col">
                <Button variant="outline" size="sm" className="h-10 flex-1 sm:flex-none xl:flex-none group">
                  <Share2 className="size-4 mr-1 group-hover:scale-110 transition-transform" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Quick contact strip */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-border/50">
            {store.whatsapp && (
              <a href={storeMessage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                <WhatsApp className="size-3.5" />
                {store.whatsapp}
              </a>
            )}
            {store.phone && (
              <a href={`tel:${store.phone}`} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                <Phone className="size-3.5" />
                {store.phone}
              </a>
            )}
            {store.email && (
              <a href={`mailto:${store.email}`} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="size-3.5" />
                {store.email}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ===== TABS CONTENT ===== */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Tabs defaultValue="products" className="w-full">
          {/* Tab navigation - sticky on scroll */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80 pb-4">
            <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-xl bg-muted/60 p-1 gap-1">
              <TabsTrigger value="products" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                Products
              </TabsTrigger>
              <TabsTrigger value="deals" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                Deals
              </TabsTrigger>
              <TabsTrigger value="about" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                About
              </TabsTrigger>
              <TabsTrigger value="reviews" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                Reviews
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== PRODUCTS TAB ===== */}
          <TabsContent value="products" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {store.products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <Globe className="size-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-1">No products yet</h3>
                <p className="text-sm text-muted-foreground">This store hasn't added any products yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {store.products.map((product, idx) => {
                  const productMessage = buildWhatsAppUrl(
                    store.whatsapp,
                    `Hi ${store.name}, I want to order ${product.name} (${product.price}) from your Mom & Pop Marketplace storefront.`,
                  );

                  return (
                    <Card
                      key={product.id}
                      className="group overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: `${idx * 75}ms` }}
                    >
                      {/* Product image placeholder */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-4xl font-black text-primary/20 group-hover:scale-110 transition-transform duration-500">
                          {store.initials}
                        </span>
                        {/* Availability badge */}
                        {product.availability !== undefined && !product.availability && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="destructive" className="text-xs shadow-md">Sold Out</Badge>
                          </div>
                        )}
                      </div>

                      {/* Product info */}
                      <CardContent className="flex min-h-[12rem] flex-col p-4 sm:p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h2>
                          <span className="shrink-0 text-lg font-black text-primary whitespace-nowrap">
                            {product.price}
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 flex-1 mb-4">
                          {product.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <Badge variant="outline" className="text-xs gap-1">
                            <CreditCard className="size-3" />
                            {product.payment}
                          </Badge>
                          {product.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Order button */}
                        <a href={productMessage} target="_blank" rel="noreferrer" className="mt-auto">
                          <Button
                            variant="outline"
                            className="w-full h-10 border-primary/30 text-primary hover:bg-primary hover:text-white group-hover:border-primary transition-all"
                          >
                            <MessageCircle className="size-4 mr-2" />
                            Order Now
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ===== DEALS TAB ===== */}
          <TabsContent value="deals" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {store.deals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
                <Timer className="size-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold mb-1">No active deals</h3>
                <p className="text-sm text-muted-foreground">Check back soon for special offers!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {store.deals.map((deal, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Deal badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-amber-500 text-white shadow-sm">Promotion</Badge>
                    </div>

                    <h2 className="text-xl font-bold pr-16 mb-2">{deal}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Message the merchant directly via WhatsApp to confirm availability and current pricing.
                    </p>

                    {/* CTA */}
                    <a href={storeMessage} target="_blank" rel="noreferrer" className="mt-4 inline-block">
                      <Button size="sm" className="bg-[#1f9d55] hover:bg-[#188348] text-white h-9">
                        <WhatsApp className="size-3.5 mr-1.5" />
                        Ask about this deal
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== ABOUT TAB ===== */}
          <TabsContent value="about" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              {/* Business profile */}
              <Card className="border-border/60 shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Globe className="size-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">About the Business</h2>
                  </div>

                  <Separator className="mb-4" />

                  <p className="leading-relaxed text-muted-foreground">{store.description}</p>

                  {/* Tags */}
                  {store.tags.length > 0 && (
                    <>
                      <h3 className="text-sm font-bold mt-6 mb-3">Categories & Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {store.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="px-3 py-1 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Social links placeholder */}
                  <div className="mt-6 pt-5 border-t border-border/50">
                    <h3 className="text-sm font-bold mb-3">Connect</h3>
                    <div className="flex items-center gap-2">
                      {[
                        { icon: WhatsApp, label: "WhatsApp" },
                        { icon: Instagram, label: "Instagram" },
                        { icon: Facebook, label: "Facebook" },
                        { icon: Twitter, label: "Twitter" },
                      ].map(({ icon: Icon, label }) => (
                        <Button
                          key={label}
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                          title={`Follow us on ${label}`}
                        >
                          <Icon className="size-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info cards */}
              <div className="space-y-5">
                {/* Hours */}
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Clock className="size-4 text-primary" />
                      </div>
                      <h3 className="font-bold">Opening Hours</h3>
                    </div>

                    {store.hours.length > 0 ? (
                      <div className="space-y-2.5 text-sm">
                        {store.hours.map((hour) => (
                          <div key={hour} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                            <span className="text-muted-foreground">{hour.split(" ")[0]}</span>
                            <span className="font-medium">{hour.split(" - ")[1] || hour}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Hours not available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <MapPin className="size-4 text-primary" />
                      </div>
                      <h3 className="font-bold">Location</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{store.address}</p>

                    {/* Map placeholder */}
                    <div className="mt-4 h-32 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border border-border/30">
                      <span className="text-sm text-muted-foreground">Map view coming soon</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment methods */}
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Wallet className="size-4 text-primary" />
                      </div>
                      <h3 className="font-bold">Payment Methods</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Cash", "Transfer", "WhatsApp Pay"].map((method) => (
                        <Badge key={method} variant="outline" className="px-3 py-1 text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ===== REVIEWS TAB ===== */}
          <TabsContent value="reviews" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
              {/* Rating summary */}
              <Card className="border-border/60 shadow-sm h-fit">
                <CardContent className="p-5 sm:p-6 text-center">
                  <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

                  {/* Big rating number */}
                  <div className="mb-4">
                    <span className="text-6xl font-black text-primary">{store.rating.toFixed(1)}</span>
                    <p className="text-sm text-muted-foreground mt-1">out of 5</p>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center mb-3 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-6 ${
                          star <= Math.round(store.rating) ? "fill-current" : "stroke-current fill-none"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">Based on {store.reviews} reviews</p>

                  {/* Write review CTA */}
                  <Button className="w-full mt-6 h-11" size="lg">
                    Write a Review
                  </Button>
                </CardContent>
              </Card>

              {/* Reviews list */}
              <div className="space-y-4">
                {["Fast response on WhatsApp!", "Payment link worked smoothly.", "Friendly local service, will order again."].map((review, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Stars */}
                    <div className="flex text-amber-500 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="size-4 fill-current" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-sm leading-relaxed text-foreground mb-3">{review}</p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">Verified Customer</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        2 weeks ago
                      </span>
                    </div>
                  </div>
                ))}

                {/* Load more */}
                <Button variant="outline" className="w-full mt-2">
                  Load more reviews
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
