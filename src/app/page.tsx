import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchExperience } from "@/components/marketplace/SearchExperience";
import { StoreCard } from "@/components/marketplace/StoreCard";
import { storefronts, allProducts } from "@/lib/marketplace-data";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  Heart,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Store,
  TrendingUp,
  Users,
  Zap,
  MapPin,
  Package,
  Sparkles,
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

const testimonials = [
  {
    name: "Karen M.",
    location: "Chaguanas",
    text: "I found fresh doubles every morning without leaving my office. The WhatsApp ordering is so smooth!",
    rating: 5,
    business: "Savannah Doubles Co.",
  },
  {
    name: "Raj P.",
    location: "San Fernando",
    text: "My hardware store got 30% more walk-in customers after listing here. Best investment I've made.",
    rating: 5,
    business: "Dave's Hardware Supplies",
  },
  {
    name: "Aisha B.",
    location: "Arima",
    text: "Booking appointments through WhatsApp changed my beauty business. Clients love the ease.",
    rating: 5,
    business: "Pure Glow Beauty Bar",
  },
  {
    name: "Michael T.",
    location: "Port of Spain",
    text: "We switched to online orders during lunch rush and doubled our revenue in two months. Incredible platform.",
    rating: 5,
    business: "Lunch Box Express",
  },
  {
    name: "Priya S.",
    location: "Diego Martin",
    text: "My craft business finally has a proper online presence without the complexity of other platforms.",
    rating: 5,
    business: "T&T Handmade Crafts",
  },
  {
    name: "David W.",
    location: "Pointe-à-Pierre",
    text: "Setup took less than an hour. My customers can find me easily and order directly via WhatsApp.",
    rating: 5,
    business: "Auto Parts Plus",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "TT$0",
    period: "/forever",
    description: "Get your Trinidad business online in 48 hours.",
    features: [
      "Single-page storefront",
      "Product catalog (up to 20 items)",
      "WhatsApp ordering",
      "Fygaro payment links",
      "Basic search listing",
      "Mobile-optimized design",
    ],
    cta: "Start free",
    ctaLink: "/signup?plan=free",
    highlighted: false,
  },
  {
    name: "Tier 2 Verified",
    price: "TT$120",
    period: "/year",
    description: "Stand out with verification badge and boosted visibility.",
    features: [
      "Everything in Free",
      "Verified badge (Tier 2)",
      "Boosted search ranking",
      "Unlimited products",
      "Featured store placement",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Upgrade to Verified",
    ctaLink: "/signup?plan=verified",
    highlighted: true,
  },
];

const benefits = [
  {
    icon: Globe,
    title: "Get online in 48 hours",
    description: "No tech skills needed. We handle the complexity — you provide your products and passion.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-first ordering",
    description: "Your customers order the way they already communicate. Natural, fast, personal.",
  },
  {
    icon: CreditCard,
    title: "Get paid instantly",
    description: "Fygaro payment links and deposit support. Money hits your account, not escrow.",
  },
  {
    icon: TrendingUp,
    title: "Grow your reach",
    description: "Appear in local search, category browsing, and the featured storefronts section.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & verification",
    description: "KYC-verified badges build customer confidence. Tier 1 free, Tier 2 for TT$120/year.",
  },
  {
    icon: Users,
    title: "Community focused",
    description: "Built for Trinidad & Tobago. Every feature designed with local culture in mind.",
  },
];

const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 6);

const stats = [
  { value: "500+", label: "Local businesses" },
  { value: "10K+", label: "Monthly orders" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "48hrs", label: "Setup time" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative border-b border-border bg-[linear-gradient(135deg,#fffbf0_0%,#fff7e6_25%,#ffffff_50%,#f0fdf4_75%,#ffffff_100%)] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-12 px-4 py-16 lg:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
            {/* Left content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="size-3.5" />
                Trinidad & Tobago's Local Marketplace
              </div>

              {/* Headline */}
              <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-balance text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                Get your Trinidad business online in{" "}
                <span className="text-primary relative">
                  48 hours.
                  <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-primary/20 rounded-full" />
                </span>
              </h1>

              {/* Subheadline */}
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                Discover verified storefronts, browse product catalogs, order via WhatsApp, and support your
                neighbourhood businesses — powered by Sovereign Digital Group Limited.
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-6 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group">
                    Get started free
                    <ArrowRight className="size-4 ml-2 group-translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/stores">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-base border-2 hover:bg-primary/5 transition-all duration-300">
                    Browse stores
                    <Globe className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-green-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-4 text-blue-500" />
                  <span>Setup in 10 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="size-4 text-amber-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="text-2xl font-black text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Search box */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <div className="rounded-2xl border border-border/60 bg-white/90 backdrop-blur-sm p-6 shadow-xl shadow-primary/5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">Search local storefronts</h2>
                    <p className="text-sm text-muted-foreground">Find products, deals, places, and categories.</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">
                    <Zap className="size-3 mr-1" />
                    Live
                  </Badge>
                </div>
                <SearchExperience />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED STORES ===== */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mb-3 px-3 py-1 text-xs font-normal uppercase tracking-wider">
              Featured
            </Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Featured verified storefronts</h2>
            <p className="mt-2 text-muted-foreground max-w-lg">
              Boosted local businesses with searchable products and WhatsApp-first ordering.
            </p>
          </div>
          <Link href="/stores" className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0">
            View all storefronts
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredStores.map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="border-y border-border bg-gradient-to-b from-muted/40 to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-3 px-3 py-1 text-xs font-normal uppercase tracking-wider">
                Trending
              </Badge>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Popular products nearby</h2>
              <p className="mt-2 text-muted-foreground max-w-lg">
                Browse what's trending across Trinidad & Tobago.
              </p>
            </div>
            <Link href="/stores" className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0">
              Browse all products
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link key={`${product.storeSlug}-${product.id}`} href={`/stores/${product.storeSlug}`}>
                <div className="group rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold group-hover:text-primary transition-colors leading-tight flex-1">{product.name}</h3>
                    <span className="shrink-0 font-black text-lg text-primary whitespace-nowrap">{product.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <Badge variant="outline" className="text-xs font-medium">{product.storeName}</Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      <MessageCircle className="size-3.5" />
                      <span>Order via WhatsApp</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-3 px-3 py-1 text-xs font-normal uppercase tracking-wider">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Why Trinidad businesses choose us</h2>
          <p className="mt-3 text-muted-foreground">
            Every feature is designed for how T&T actually buys and sells. No fluff, no complexity.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => (
            <div
              key={item.title}
              className={`group rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 ${index === 0 ? 'ring-2 ring-primary/10' : ''}`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all">
                <item.icon className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-y border-border bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4 px-3 py-1 text-xs font-normal uppercase tracking-wider">
              How it works
            </Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Built for how T&T actually buys.</h2>
            <p className="mt-4 text-muted-foreground max-w-lg leading-relaxed">
              Phase 1 focuses on the workflows merchants need immediately: storefront creation,
              catalog management, WhatsApp ordering, Fygaro payments, search, and mobile speed.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {merchantSteps.map((step, index) => (
              <div key={step.title} className="relative rounded-xl border border-border/60 bg-background p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="absolute -top-4 left-5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-black text-white shadow-lg">
                  {index + 1}
                </div>
                <step.icon className="mb-4 mt-2 size-6 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-3 px-3 py-1 text-xs font-normal uppercase tracking-wider">
            Pricing
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you're ready. No hidden fees, no surprises.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto items-start">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border-2 p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                tier.highlighted
                  ? "border-primary bg-gradient-to-b from-primary/5 to-background scale-[1.02] md:scale-105"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white shadow-lg shadow-primary/25 px-6 py-2 text-sm font-medium">
                    <Star className="size-3.5 mr-1.5 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-primary">{tier.price.split('$')[0]}$</span>
                  <span className="text-muted-foreground text-sm ml-1">{tier.price.includes('/') ? tier.period : ''}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-green-500 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={tier.ctaLink} className="block w-full">
                <Button
                  size="lg"
                  className={`w-full h-12 text-base font-medium transition-all duration-300 ${
                    tier.highlighted
                      ? "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                      : "border-2 hover:bg-primary/5"
                  }`}
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  {tier.cta}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="border-y border-border bg-gradient-to-b from-muted/40 to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-3 px-3 py-1 text-xs font-normal uppercase tracking-wider">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Loved by Trinidad businesses</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Real feedback from real merchants across T&T.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="group rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                {/* Stars */}
                <div className="flex text-amber-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm leading-relaxed text-muted-foreground mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-white shadow-md group-hover:scale-105 transition-transform">
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{t.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" />
                      {t.location} · {t.business}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-10 md:p-16 text-center shadow-2xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white mb-6">
              <Sparkles className="size-3.5" />
              Join hundreds of growing businesses
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
              Ready to get your business online?
            </h2>
            <p className="max-w-xl mx-auto text-white/80 mb-8 text-lg leading-relaxed">
              Join hundreds of Trinidad & Tobago businesses already growing with Mom & Pop Store.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center items-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Create your storefront
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/stores">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                  Browse stores first
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER TRUST BAR ===== */}
      <footer className="border-t border-border bg-muted/50 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <ShieldCheck className="size-5 text-green-500" />
              <span>Secure & verified</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageCircle className="size-5 text-blue-500" />
              <span>WhatsApp-first support</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <CreditCard className="size-5 text-purple-500" />
              <span>Fygaro payments</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Powered by Sovereign Digital Group Limited · Trinidad & Tobago © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}