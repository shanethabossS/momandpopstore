import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storefronts } from "@/lib/shop868-data";
import {
  BadgeCheck,
  BarChart3,
  CreditCard,
  MessageCircle,
  Package,
  Plus,
  Settings,
  Store,
} from "lucide-react";

const merchantStore = storefronts[0];

export default function BusinessDashboard() {
  const activeProducts = merchantStore.products.length;
  const stats = [
    { title: "Store views", value: "1,248", subtext: "+12% this month", Icon: BarChart3 },
    { title: "WhatsApp inquiries", value: "86", subtext: "18 awaiting reply", Icon: MessageCircle },
    { title: "Active products", value: String(activeProducts), subtext: "2 featured items", Icon: Package },
    { title: "Payment status", value: "Fygaro ready", subtext: "Links enabled", Icon: CreditCard },
  ];

  return (
    <div className="container mx-auto w-full px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge className="mb-3 bg-emerald-100 text-emerald-800">
            <BadgeCheck className="size-3" />
            Tier 2 merchant verified
          </Badge>
          <h1 className="text-4xl font-black tracking-tight">Merchant dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage storefront, catalog, WhatsApp orders, promotions, and Fygaro payment links.
          </p>
        </div>
        <Link href={`/store/${merchantStore.slug}`}>
          <Button className="h-11">
            View public storefront
          </Button>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, subtext, Icon }) => (
          <Card key={title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
              <Icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)]">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Catalog manager</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Phase 1 product setup for WhatsApp ordering.</p>
            </div>
            <Button variant="outline">
              <Plus className="size-4" />
              Add product
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {merchantStore.products.map((product) => (
              <div key={product.id} className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div>
                  <div className="font-bold">{product.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{product.description}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{product.price}</Badge>
                    <Badge variant="secondary">{product.payment}</Badge>
                  </div>
                </div>
                <Button variant="outline">Edit</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Launch checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Email verified",
                "WhatsApp verified",
                "Business profile complete",
                "Fygaro payment link connected",
                "First promotion ready",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className={`size-2 rounded-full ${index < 4 ? "bg-emerald-600" : "bg-amber-500"}`} />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              {[
                { label: "Edit store profile", Icon: Store },
                { label: "Manage catalog", Icon: Package },
                { label: "Payment settings", Icon: CreditCard },
                { label: "Trust and verification", Icon: Settings },
              ].map(({ label, Icon }) => (
                <Button key={label} variant="outline" className="h-10 justify-start">
                  <Icon className="size-4" />
                  {label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
