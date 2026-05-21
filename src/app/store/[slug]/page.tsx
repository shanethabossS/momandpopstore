import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildWhatsAppUrl, getStoreBySlug, storefronts } from "@/lib/shop868-data";
import {
  BadgeCheck,
  Clock,
  CreditCard,
  MapPin,
  MessageCircle,
  Share2,
  Star,
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
    title: store ? `${store.name} | Shop868` : "Storefront | Shop868",
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
    `Hi ${store.name}, I found your Shop868 storefront and want to order.`,
  );

  return (
    <div className="pb-12">
      <section className="border-b border-border bg-[linear-gradient(135deg,rgba(20,97,84,0.14),rgba(226,181,80,0.22)),linear-gradient(180deg,#ffffff,#f7fbf8)]">
        <div className="container mx-auto px-4 py-8">
          <Link href="/stores" className="mb-5 inline-flex text-sm font-semibold text-primary">
            Back to storefronts
          </Link>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-end">
            <div className="flex size-28 items-center justify-center rounded-lg bg-white text-4xl font-black text-primary shadow-sm ring-1 ring-border sm:size-36 sm:text-5xl">
              {store.initials}
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge className="bg-emerald-100 text-emerald-800">
                  <BadgeCheck className="size-3" />
                  {store.verifiedTier} verified
                </Badge>
                {store.boosted ? <Badge className="bg-amber-100 text-amber-800">Featured listing</Badge> : null}
                <Badge variant="outline">{store.category}</Badge>
              </div>
              <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">{store.name}</h1>
              <p className="mt-3 max-w-3xl text-muted-foreground">{store.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {store.address}
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <Star className="size-4 fill-current" />
                  {store.rating.toFixed(1)} from {store.reviews} reviews
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <a href={storeMessage} target="_blank" rel="noreferrer">
                <Button className="h-11 w-full bg-[#1f9d55] px-5 text-white hover:bg-[#188348] sm:w-auto lg:w-full">
                  <MessageCircle className="size-4" />
                  WhatsApp order
                </Button>
              </a>
              <Button variant="outline" className="h-11 w-full sm:w-auto lg:w-full">
                <Share2 className="size-4" />
                Share store
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6 h-auto w-full justify-start overflow-x-auto rounded-lg bg-muted p-1">
            <TabsTrigger value="products" className="h-10 px-4">Catalog</TabsTrigger>
            <TabsTrigger value="deals" className="h-10 px-4">Deals</TabsTrigger>
            <TabsTrigger value="about" className="h-10 px-4">About</TabsTrigger>
            <TabsTrigger value="reviews" className="h-10 px-4">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {store.products.map((product) => {
                const productMessage = buildWhatsAppUrl(
                  store.whatsapp,
                  `Hi ${store.name}, I want to order ${product.name} (${product.price}) from your Shop868 storefront.`,
                );

                return (
                  <Card key={product.id} className="overflow-hidden border-border">
                    <div className="flex aspect-[16/9] items-center justify-center bg-muted text-3xl font-black text-primary/45">
                      {store.initials}
                    </div>
                    <CardContent className="flex min-h-56 flex-col p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h2 className="text-xl font-bold leading-tight">{product.name}</h2>
                        <span className="shrink-0 font-black text-primary">{product.price}</span>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline">
                          <CreditCard className="size-3" />
                          {product.payment}
                        </Badge>
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <a href={productMessage} target="_blank" rel="noreferrer" className="mt-auto pt-5">
                        <Button variant="outline" className="h-10 w-full border-primary/40 text-primary hover:bg-primary/10">
                          <MessageCircle className="size-4" />
                          Order via WhatsApp
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="deals">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {store.deals.map((deal) => (
                <div key={deal} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <Badge className="mb-3 bg-amber-100 text-amber-800">Promotion</Badge>
                  <h2 className="text-xl font-bold">{deal}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Message the merchant to confirm availability and current pricing.
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold">Business profile</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{store.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {store.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="space-y-5 p-6">
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 font-bold">
                      <Clock className="size-4 text-primary" />
                      Opening hours
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {store.hours.map((hour) => (
                        <div key={hour}>{hour}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 font-bold">
                      <MapPin className="size-4 text-primary" />
                      Location
                    </h3>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-bold">Customer trust</h2>
                    <p className="text-sm text-muted-foreground">
                      {store.rating.toFixed(1)} average rating from {store.reviews} reviews.
                    </p>
                  </div>
                  <Button>Write a review</Button>
                </div>
                <div className="space-y-4">
                  {["Fast response on WhatsApp.", "Payment link worked smoothly.", "Friendly local service."].map((review) => (
                    <div key={review} className="rounded-lg border border-border bg-background p-4">
                      <div className="mb-2 flex text-amber-600">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="size-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
