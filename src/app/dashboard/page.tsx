'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import {
  BadgeCheck,
  BarChart3,
  CreditCard,
  MessageCircle,
  Package,
  Plus,
  Store,
  X,
} from 'lucide-react';

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
};

type Shop = {
  id: string;
  shop_name: string;
  shop_slug: string;
  description: string;
  is_verified: boolean;
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: 'general', subcategory: 'general' });
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const { data: listingsData } = await apiFetch<{ listings: Listing[] }>('/api/listings');
      if (listingsData?.listings) setListings(listingsData.listings);
      setLoadingData(false);
    })();
  }, [authLoading]);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setAddingProduct(true);
    const { data, error } = await apiFetch<{ listing: Listing }>('/api/listings', {
      method: 'POST',
      body: JSON.stringify({
        title: newProduct.name,
        price: parseFloat(newProduct.price) || 0,
        description: newProduct.description,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
      }),
    });
    if (data?.listing) {
      setListings((prev) => [data.listing, ...prev]);
      setNewProduct({ name: '', price: '', description: '', category: 'general', subcategory: 'general' });
      setShowAddForm(false);
    }
    setAddingProduct(false);
  }

  if (authLoading || loadingData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { title: 'Store views', value: '--', subtext: 'Analytics coming soon', Icon: BarChart3 },
    { title: 'WhatsApp inquiries', value: '--', subtext: 'Connect WhatsApp', Icon: MessageCircle },
    { title: 'Active products', value: String(listings.length), subtext: `${listings.filter(l => l.status === 'active').length} active`, Icon: Package },
    { title: 'Payment status', value: 'Fygaro ready', subtext: 'Links enabled', Icon: CreditCard },
  ];

  return (
    <div className="container mx-auto w-full px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge className="mb-3 bg-amber-100 text-amber-800">
            <BadgeCheck className="size-3" />
            Merchant dashboard
          </Badge>
          <h1 className="text-4xl font-black tracking-tight">
            {user.full_name ? `${user.full_name.split(' ')[0]}'s Dashboard` : 'Merchant Dashboard'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your storefront, catalog, and orders.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/onboarding">
            <Button variant="outline">
              <Store className="size-4" />
              New storefront
            </Button>
          </Link>
          {shop && (
            <Link href={`/store/${shop.shop_slug}`}>
              <Button>View public store</Button>
            </Link>
          )}
        </div>
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
              <CardTitle>Catalog</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Your products and services.</p>
            </div>
            <Button variant="outline" onClick={() => setShowAddForm(true)}>
              <Plus className="size-4" />
              Add product
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {showAddForm && (
              <form onSubmit={handleAddProduct} className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">New product</span>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="prod-name" className="text-xs">Name</Label>
                    <Input id="prod-name" placeholder="Product name" value={newProduct.name} onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prod-price" className="text-xs">Price (TT$)</Label>
                    <Input id="prod-price" type="number" min="0" step="0.01" placeholder="0.00" value={newProduct.price} onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))} required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prod-desc" className="text-xs">Description</Label>
                  <Input id="prod-desc" placeholder="Short description" value={newProduct.description} onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))} />
                </div>
                <Button type="submit" size="sm" disabled={addingProduct}>
                  {addingProduct ? 'Adding...' : 'Add product'}
                </Button>
              </form>
            )}

            {listings.length === 0 && !showAddForm && (
              <div className="py-8 text-center text-muted-foreground">
                No products yet. Click &quot;Add product&quot; to get started.
              </div>
            )}

            {listings.map((listing) => (
              <div key={listing.id} className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div>
                  <div className="font-bold">{listing.title}</div>
                  {listing.description && (
                    <div className="mt-1 text-sm text-muted-foreground">{listing.description}</div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">TT${Number(listing.price).toFixed(2)}</Badge>
                    <Badge variant="secondary">{listing.status}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
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
                { label: 'Account created', done: true },
                { label: 'Business profile set up', done: !!shop },
                { label: 'First product added', done: listings.length > 0 },
                { label: 'WhatsApp connected', done: false },
                { label: 'Payment link set up', done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <span className={`size-2 rounded-full ${item.done ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  {item.label}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Link href="/onboarding">
                <Button variant="outline" className="h-10 w-full justify-start">
                  <Store className="size-4" />
                  Set up storefront
                </Button>
              </Link>
              <Button variant="outline" className="h-10 justify-start" onClick={() => setShowAddForm(true)}>
                <Package className="size-4" />
                Add product
              </Button>
              <Button variant="outline" className="h-10 justify-start" disabled>
                <CreditCard className="size-4" />
                Payment settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
