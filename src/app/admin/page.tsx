import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storefronts } from "@/lib/shop868-data";
import { AlertTriangle, BadgeCheck, Megaphone, ShieldCheck, Store, Users } from "lucide-react";

export default function AdminDashboard() {
  const tierTwo = storefronts.filter((store) => store.verifiedTier === "Tier 2").length;
  const featured = storefronts.filter((store) => store.boosted).length;
  const stats = [
    { title: "Total storefronts", value: String(storefronts.length), subtext: "Phase 1 seed catalog", Icon: Store },
    { title: "Verified merchants", value: String(tierTwo), subtext: "Tier 2 KYC complete", Icon: BadgeCheck },
    { title: "Featured listings", value: String(featured), subtext: "Boosted visibility", Icon: Megaphone },
    { title: "Open reports", value: "3", subtext: "Trust and safety review", Icon: AlertTriangle },
  ];

  return (
    <div className="container mx-auto w-full px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight">Shop868 admin</h1>
        <p className="mt-2 text-muted-foreground">
          Moderate stores, manage verification, featured listings, reports, categories, subscriptions, and support queues.
        </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.45fr)]">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Merchant verification queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storefronts.slice(1, 5).map((store, index) => (
              <div key={store.slug} className="grid grid-cols-1 gap-4 rounded-lg border border-border p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold">{store.name}</h2>
                    <Badge variant={store.verifiedTier === "Tier 2" ? "default" : "outline"}>{store.verifiedTier}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {store.category} / {store.location} / {index % 2 === 0 ? "KYC documents pending" : "WhatsApp verified"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Review</Button>
                  <Button>Approve</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Support inboxes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Shop868 Support", "12 open"],
                ["Merchant Verification", "5 open"],
                ["Trust & Safety", "3 open"],
                ["Payments Support", "2 open"],
              ].map(([name, count]) => (
                <div key={name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span>{name}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Shared SOV systems</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Shared login and roles
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Shared KYC and trust badges
              </div>
              <div className="flex items-center gap-2">
                <Megaphone className="size-4 text-primary" />
                Featured listing controls
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
