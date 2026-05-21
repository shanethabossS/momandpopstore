import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchExperience } from "@/components/shop868/SearchExperience";
import { StoreCard } from "@/components/shop868/StoreCard";
import { storefronts } from "@/lib/shop868-data";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Store,
} from "lucide-react";

const featuredStores = storefronts.filter((store) => store.boosted).slice(0, 3);

const merchantSteps = [
  {
    title: "Create storefront",
    copy: "Business profile, logo, banner, location, opening hours, and contact details.",
    icon: Store,
  },
  {
    title: "Add catalog",
    copy: "Products, prices, featured items, promotions, and WhatsApp order text.",
    icon: BadgeCheck,
  },
  {
    title: "Take orders",
    copy: "WhatsApp-first ordering with Fygaro payment links and deposit support.",
    icon: MessageCircle,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-[linear-gradient(180deg,#f7fbf8_0%,#ffffff_70%)]">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:py-16">
          <div className="min-w-0 max-w-3xl space-y-7">
            <div className="space-y-5">
              <h1 className="text-balance text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Get your Trinidad business online in 48 hours.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Shop868 is a local-first storefront ecosystem for T&T businesses: searchable pages,
                product catalogs, WhatsApp orders, Fygaro payments, reviews, promotions, and trust
                verification powered by Sovereign Digital Group Limited.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 w-full px-5 text-base sm:w-auto">
                  Create storefront
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/stores">
                <Button size="lg" variant="outline" className="h-12 w-full px-5 text-base sm:w-auto">
                  Browse stores
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Tier 1", "Email + WhatsApp verified"],
                ["Tier 2", "Full KYC + TT$120/year"],
                ["Support", "Chatwoot-ready inboxes"],
              ].map(([label, copy]) => (
                <div key={label} className="rounded-lg border border-border bg-white p-4 shadow-sm">
                  <div className="text-sm font-bold text-primary">{label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{copy}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Search local storefronts</h2>
                <p className="text-sm text-muted-foreground">Find products, deals, places, and categories.</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">Live UX</Badge>
            </div>
            <SearchExperience />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Featured verified storefronts</h2>
            <p className="mt-2 text-muted-foreground">
              Boosted local businesses with searchable products and WhatsApp-first ordering.
            </p>
          </div>
          <Link href="/stores" className="inline-flex items-center gap-2 font-semibold text-primary">
            View all storefronts
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featuredStores.map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Built for how T&T actually buys.</h2>
            <p className="mt-3 text-muted-foreground">
              Phase 1 focuses on the workflows merchants need immediately: storefront creation,
              catalog management, WhatsApp ordering, Fygaro payments, search, and mobile speed.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {merchantSteps.map((step) => (
              <div key={step.title} className="rounded-lg border border-border bg-background p-5">
                <step.icon className="mb-4 size-6 text-primary" />
                <h3 className="font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid grid-cols-1 gap-5 px-4 py-12 md:grid-cols-3">
        {[
          {
            title: "Shared SOV trust",
            copy: "A shared login, KYC, mobile shell, notifications, admin, and moderation layer across SOV products.",
            icon: ShieldCheck,
          },
          {
            title: "Payments ready",
            copy: "Fygaro links, order deposits, WhatsApp payment support, and a future path for TTPay.",
            icon: CreditCard,
          },
          {
            title: "Notifications later",
            copy: "WhatsApp alerts first, with Evolution API, Chatwoot support, email, and SMS expansion.",
            icon: Bell,
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <item.icon className="mb-5 size-7 text-primary" />
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.copy}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
