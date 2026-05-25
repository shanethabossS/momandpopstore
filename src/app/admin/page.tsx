import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdmin, getAdminStats, getPendingStorefronts, getAdminActions } from '@/lib/db/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Globe,
  Megaphone,
  Package,
  ShieldCheck,
  Star,
  Store,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import { ModerationQueue } from './moderation-queue'
import { AuditLog } from './audit-log'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?next=/admin')

  const admin = await isAdmin(session.user.id)
  if (!admin) redirect('/dashboard')

  const [stats, pending, recentActions] = await Promise.all([
    getAdminStats(),
    getPendingStorefronts({ pageSize: 10 }),
    getAdminActions({ pageSize: 10 }),
  ])

  const statCards = [
    { title: 'Total storefronts', value: stats.totalStorefronts, subtext: `${stats.approvedStorefronts} approved`, Icon: Store },
    { title: 'Pending review', value: stats.pendingStorefronts, subtext: 'Awaiting moderation', Icon: Clock, highlight: stats.pendingStorefronts > 0 },
    { title: 'Verified merchants', value: stats.verifiedMerchants, subtext: 'Tier 2 KYC complete', Icon: BadgeCheck },
    { title: 'Featured listings', value: stats.featuredStorefronts, subtext: 'Boosted visibility', Icon: Megaphone },
    { title: 'Total users', value: stats.totalUsers, subtext: 'Registered accounts', Icon: Users },
    { title: 'Products', value: stats.totalProducts, subtext: 'Across all stores', Icon: Package },
    { title: 'Reviews', value: stats.totalReviews, subtext: `${stats.pendingReviews} pending`, Icon: Star },
    { title: 'Disabled/Rejected', value: stats.disabledStorefronts + stats.rejectedStorefronts, subtext: 'Trust & safety', Icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="container mx-auto w-full px-4 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#1f9d55]/10 p-2.5">
                  <ShieldCheck className="size-6 text-[#1f9d55]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Moderate stores, manage leads, and monitor marketplace health.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1.5 text-xs font-medium">
                <CheckCircle2 className="size-3 mr-1 text-emerald-600" />
                System Operational
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto w-full px-4 py-8">
        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map(({ title, value, subtext, Icon, highlight }) => (
            <Card
              key={title}
              className={`border-border transition-all hover:shadow-md ${highlight ? 'ring-2 ring-amber-400/60 border-amber-300' : ''}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 gap-2">
                <CardTitle className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide text-left line-clamp-1">
                  {title}
                </CardTitle>
                <Icon className={`size-4 shrink-0 ${highlight ? 'text-amber-500 animate-pulse' : 'text-primary/70'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-black">{value}</div>
                <p className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground truncate">{subtext}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="moderation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="moderation" className="text-xs sm:text-sm gap-1.5">
              <Filter className="size-3.5" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="leads" className="text-xs sm:text-sm gap-1.5">
              <Users className="size-3.5" />
              Leads & Submissions
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm gap-1.5">
              <Eye className="size-3.5" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* ===== MODERATION TAB ===== */}
          <TabsContent value="moderation" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.4fr)]">
              <ModerationQueue
                storefronts={pending.storefronts.map((s) => ({
                  id: s.id,
                  name: s.name,
                  slug: s.slug,
                  status: s.status,
                  verifiedTier: s.verifiedTier,
                  isFeatured: s.isFeatured,
                  location: s.location,
                  categoryName: s.category?.name || null,
                  ownerName: s.user?.name || null,
                  ownerEmail: s.user?.email || null,
                  productCount: s._count.products,
                  createdAt: s.createdAt.toISOString(),
                }))}
                totalPending={pending.total}
              />
            </div>
          </TabsContent>

          {/* ===== LEADS & SUBMISSIONS TAB ===== */}
          <TabsContent value="leads" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="size-5 text-primary" />
                      Lead Submissions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Track and manage incoming business leads</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                      <Input placeholder="Search leads..." className="h-9 pl-8 w-full sm:w-56" />
                      <Filter className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Lead table */}
                <div className="rounded-xl border border-border overflow-hidden">
                  {/* Table header - desktop */}
                  <div className="hidden md:grid grid-cols-12 gap-4 bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <div className="col-span-3">Business Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Package</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Date</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {/* Lead rows - desktop */}
                  {[
                    { name: 'Sunrise Bakery', category: 'Food & Beverage', package: 'Growth', status: 'new', date: 'May 20' },
                    { name: 'TT Auto Parts', category: 'Automotive', package: 'Starter', status: 'contacted', date: 'May 18' },
                    { name: 'Beauty by Maria', category: 'Health & Beauty', package: 'Growth', status: 'converted', date: 'May 15' },
                  ].map((lead, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-3.5 border-t border-border items-center hover:bg-muted/20 transition-colors">
                      {/* Business name - desktop */}
                      <div className="col-span-3 font-medium text-sm hidden md:block truncate">{lead.name}</div>
                      {/* Mobile layout */}
                      <div className="md:hidden col-span-full">
                        <div className="font-semibold text-sm">{lead.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{lead.category}</div>
                      </div>

                      {/* Category - desktop */}
                      <div className="col-span-2 text-sm hidden md:block text-muted-foreground">{lead.category}</div>
                      {/* Package */}
                      <div className="col-span-2">
                        <Badge variant="outline" className="text-xs px-2 py-0.5 hidden md:inline-block">
                          {lead.package}
                        </Badge>
                        <span className="text-xs text-muted-foreground md:hidden">{lead.package}</span>
                      </div>
                      {/* Status */}
                      <div className="col-span-2 hidden md:block">
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 ${
                            lead.status === 'new'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : lead.status === 'contacted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </div>
                      {/* Date */}
                      <div className="col-span-1 text-xs text-muted-foreground hidden md:block">{lead.date}</div>
                      {/* Actions */}
                      <div className="col-span-2 flex justify-end gap-1.5">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          <Eye className="size-3.5 mr-1" /> View
                        </Button>
                        {lead.status === 'new' && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                            Contact
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Mobile card layout */}
                  {[
                    { name: 'Sunrise Bakery', category: 'Food & Beverage', package: 'Growth', status: 'new', date: 'May 20' },
                    { name: 'TT Auto Parts', category: 'Automotive', package: 'Starter', status: 'contacted', date: 'May 18' },
                  ].map((lead, idx) => (
                    <div key={`mobile-${idx}`} className="md:hidden border-t border-border p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">{lead.name}</h3>
                          <p className="text-xs text-muted-foreground">{lead.category}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            lead.status === 'new'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : lead.status === 'contacted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{lead.package} · {lead.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 flex-1 text-xs">
                          <Eye className="size-3.5 mr-1" /> View
                        </Button>
                        {lead.status === 'new' && (
                          <Button size="sm" className="h-7 flex-1 bg-[#1f9d55] hover:bg-[#188348] text-white text-xs">
                            Contact
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty state */}
                  <div className="md:hidden border-t border-border p-6 text-center text-sm text-muted-foreground">
                    No more leads to display
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== ACTIVITY LOG TAB ===== */}
          <TabsContent value="activity" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AuditLog
              actions={recentActions.actions.map((a) => ({
                id: a.id,
                action: a.action,
                reason: a.reason,
                adminName: a.admin?.name || a.admin?.email || 'Unknown',
                storefrontName: a.storefront?.name || null,
                createdAt: a.createdAt.toISOString(),
              }))}
            />
          </TabsContent>
        </Tabs>

        {/* SOV Systems Footer */}
        <Card className="border-border mt-6 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="size-5 text-primary" />
              Shared SOV Ecosystem Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Users, title: 'Authentication & Roles', desc: 'Shared login system with granular role management across all SOV properties' },
                { icon: BadgeCheck, title: 'KYC & Trust Badges', desc: 'Unified verification tiers that carry across the marketplace ecosystem' },
                { icon: Megaphone, title: 'Featured Listings Engine', desc: 'Centralized boost and promotion controls for marketplace visibility' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-lg border border-border/60 bg-card p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="size-4 text-primary" />
                    <h3 className="font-semibold text-sm">{title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}