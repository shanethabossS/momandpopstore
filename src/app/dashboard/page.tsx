'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import {
  BadgeCheck,
  BarChart3,
  CreditCard,
  Eye,
  MessageCircle,
  Package,
  Plus,
  Store,
  Trash2,
  X,
  Edit,
  Image as ImageIcon,
  Globe,
  GlobeOff,
} from 'lucide-react';

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  image_url?: string;
  is_available?: boolean;
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
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: 'general', subcategory: 'general', image_url: '' });
  const [addingProduct, setAddingProduct] = useState(false);

  // Edit product state
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', image_url: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete confirmation state
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingItem, setDeletingItem] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
        image_url: newProduct.image_url || undefined,
      }),
    });
    if (data?.listing) {
      setListings((prev) => [data.listing, ...prev]);
      setNewProduct({ name: '', price: '', description: '', category: 'general', subcategory: 'general', image_url: '' });
      setShowAddForm(false);
      setToast({ message: 'Product added successfully!', type: 'success' });
    } else {
      setToast({ message: 'Failed to add product. Please try again.', type: 'error' });
    }
    setAddingProduct(false);
  }

  async function handleEditListing() {
    if (!editingListing) return;
    setSavingEdit(true);
    const { data, error } = await apiFetch<{ listing: Listing }>(`/api/listings/${editingListing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: editForm.name,
        price: parseFloat(editForm.price) || 0,
        description: editForm.description,
        image_url: editForm.image_url || undefined,
      }),
    });
    if (data?.listing) {
      setListings((prev) => prev.map((l) => l.id === editingListing.id ? data.listing : l));
      setEditingListing(null);
      setToast({ message: 'Product updated successfully!', type: 'success' });
    } else {
      setToast({ message: 'Failed to update product.', type: 'error' });
    }
    setSavingEdit(false);
  }

  async function handleDeleteListing() {
    if (!deletingListing) return;
    setDeletingItem(true);
    const { error } = await apiFetch(`/api/listings/${deletingListing.id}`, {
      method: 'DELETE',
    });
    if (!error) {
      setListings((prev) => prev.filter((l) => l.id !== deletingListing.id));
      setDeletingListing(null);
      setConfirmDelete(false);
      setToast({ message: 'Product removed.', type: 'info' });
    } else {
      setToast({ message: 'Failed to delete product.', type: 'error' });
    }
    setDeletingItem(false);
  }

  async function handleToggleAvailability(listingId: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    const updatedListing = { ...listings.find(l => l.id === listingId)!, is_available: newStatus };
    setListings((prev) => prev.map((l) => l.id === listingId ? updatedListing : l));
    
    await apiFetch(`/api/listings/${listingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus ? 'active' : 'inactive' }),
    });
    
    setToast({ 
      message: newStatus ? 'Product is now visible in your store.' : 'Product hidden from your store.', 
      type: 'info' 
    });
  }

  const filteredListings = listings.filter(l => 
    searchQuery === '' || l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loadingData) {
    return (
      <div className="container mx-auto w-full px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-28 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
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

  // Active listings count for filter badge
  const activeCount = listings.filter(l => l.is_available !== false && l.status === 'active').length;

  return (
    <div className="container mx-auto w-full px-4 py-6 sm:py-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' :
          toast.type === 'error' ? 'border-red-200 bg-red-50 text-red-800' :
          'border-blue-200 bg-blue-50 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <BadgeCheck className="size-4" />}
            {toast.type === 'error' && <X className="size-4" />}
            {toast.type === 'info' && <Eye className="size-4" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge className="mb-3 bg-amber-100 text-amber-800">
            <BadgeCheck className="size-3" />
            Merchant dashboard
          </Badge>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
            {user.name ? `${user.name.split(' ')[0]}'s Dashboard` : 'Merchant Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
            Manage your storefront, catalog, and orders.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/onboarding">
            <Button variant="outline" size="sm">
              <Store className="size-4" />
              <span className="hidden sm:inline">New storefront</span>
              <span className="sm:hidden">Store</span>
            </Button>
          </Link>
          {shop && (
            <Link href={`/store/${shop.shop_slug}`}>
              <Button size="sm">View store</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, subtext, Icon }) => (
          <Card key={title} className="border-border transition-shadow hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground sm:text-sm">{title}</CardTitle>
              <Icon className="size-3 text-primary sm:size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-black sm:text-2xl">{value}</div>
              <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)]">
        {/* Catalog Section */}
        <Card className="border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Catalog</CardTitle>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {listings.length} product{listings.length !== 1 ? 's' : ''} · {activeCount} active
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                <Plus className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Add product</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Add Product Form */}
            {showAddForm && (
              <form onSubmit={handleAddProduct} className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">New product</span>
                  <button type="button" onClick={() => setShowAddForm(false)} className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
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
                <div className="space-y-1">
                  <Label htmlFor="prod-image" className="text-xs flex items-center gap-1">
                    <ImageIcon className="size-3" />
                    Image URL (optional)
                  </Label>
                  <Input id="prod-image" placeholder="https://example.com/image.jpg" value={newProduct.image_url} onChange={(e) => setNewProduct(p => ({ ...p, image_url: e.target.value }))} />
                </div>
                <Button type="submit" size="sm" disabled={addingProduct} className="w-full sm:w-auto">
                  {addingProduct ? (
                    <>
                      <span className="mr-2 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></span>
                      Adding...
                    </>
                  ) : 'Add product'}
                </Button>
              </form>
            )}

            {/* Search Bar */}
            {listings.length > 0 && !showAddForm && (
              <div className="relative">
                <Input 
                  placeholder="Search products..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
            )}

            {/* Empty State */}
            {listings.length === 0 && !showAddForm && (
              <div className="py-10 text-center">
                <Package className="mx-auto size-12 text-muted-foreground/40" />
                <h3 className="mt-3 text-sm font-semibold">No products yet</h3>
                <p className="mt-1 text-xs text-muted-foreground">Add your first product to start selling.</p>
                <Button size="sm" onClick={() => setShowAddForm(true)} className="mt-4">
                  <Plus className="size-4 mr-2" />
                  Add product
                </Button>
              </div>
            )}

            {/* No Search Results */}
            {listings.length > 0 && searchQuery && filteredListings.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No products match "{searchQuery}"</p>
              </div>
            )}

            {/* Product List */}
            {filteredListings.map((listing) => (
              <div key={listing.id} className="group rounded-lg border border-border bg-card p-3 sm:p-4 transition-all hover:border-primary/20 hover:shadow-sm">
                <div className="flex items-start gap-3">
                  {/* Product Image Thumbnail */}
                  {listing.image_url ? (
                    <div className="hidden size-16 shrink-0 overflow-hidden rounded-md bg-muted sm:block">
                      <img src={listing.image_url} alt={listing.title} className="size-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ) : (
                    <div className="hidden size-16 shrink-0 overflow-hidden rounded-md bg-muted sm:flex items-center justify-center">
                      <ImageIcon className="size-5 text-muted-foreground/40" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{listing.title}</div>
                        {listing.description && (
                          <div className="mt-0.5 line-clamp-1 text-xs sm:text-sm text-muted-foreground">{listing.description}</div>
                        )}
                      </div>
                      <span className="shrink-0 font-bold text-primary whitespace-nowrap">TT${Number(listing.price).toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={listing.is_available !== false ? 'outline' : 'secondary'} className="text-xs">
                        {listing.is_available !== false ? (
                          <>
                            <Globe className="size-3" />
                            Visible
                          </>
                        ) : (
                          <>
                            <GlobeOff className="size-3" />
                            Hidden
                          </>
                        )}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{listing.status}</Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-1 sm:flex-row sm:items-center">
                    {/* Availability Toggle (Mobile: top, Desktop: right) */}
                    <button
                      onClick={() => handleToggleAvailability(listing.id, listing.is_available !== false)}
                      className={`sm:hidden w-full flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        listing.is_available !== false 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}
                    >
                      <Switch checked={listing.is_available !== false} className="h-4 w-4" />
                      {listing.is_available !== false ? 'Visible' : 'Hidden'}
                    </button>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex items-center gap-1">
                      <button
                        onClick={() => handleToggleAvailability(listing.id, listing.is_available !== false)}
                        className={`rounded-md p-1.5 transition-colors ${
                          listing.is_available !== false 
                            ? 'text-emerald-600 hover:bg-emerald-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={listing.is_available !== false ? 'Hide from store' : 'Show in store'}
                      >
                        {listing.is_available !== false ? <Globe className="size-4" /> : <GlobeOff className="size-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingListing(listing);
                          setEditForm({ name: listing.title, price: String(listing.price), description: listing.description || '', image_url: listing.image_url || '' });
                        }}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-muted hover:text-foreground transition-colors"
                        title="Edit product"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => { setDeletingListing(listing); setConfirmDelete(false); }}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Edit/Delete Buttons */}
                <div className="mt-3 flex gap-2 sm:hidden">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setEditingListing(listing);
                      setEditForm({ name: listing.title, price: String(listing.price), description: listing.description || '', image_url: listing.image_url || '' });
                    }}
                  >
                    <Edit className="size-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => { setDeletingListing(listing); setConfirmDelete(false); }}
                  >
                    <Trash2 className="size-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Launch Checklist */}
          <Card className="border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base">Launch checklist</CardTitle>
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
                  <span className={`size-2.5 shrink-0 rounded-full ${item.done ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  <span className={!item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Link href="/onboarding">
                <Button variant="outline" size="sm" className="w-full justify-start h-9">
                  <Store className="size-4" />
                  Set up storefront
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full justify-start h-9" onClick={() => setShowAddForm(true)}>
                <Package className="size-4" />
                Add product
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-9" disabled>
                <CreditCard className="size-4" />
                Payment settings
              </Button>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-border bg-gradient-to-br from-primary/5 to-amber-50/50">
            <CardContent className="p-4 sm:p-5 text-center space-y-3">
              <div className="mx-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Need help?</h3>
                <p className="mt-1 text-xs text-muted-foreground">Contact our support team for assistance with your storefront.</p>
              </div>
              <Button size="sm" variant="outline" className="w-full h-8 text-xs">Get support</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold">Edit product</h2>
              <button 
                onClick={() => setEditingListing(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleEditListing(); }} className="p-5 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="edit-name" className="text-xs">Product name</Label>
                <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-price" className="text-xs">Price (TT$)</Label>
                <Input id="edit-price" type="number" min="0" step="0.01" value={editForm.price} onChange={(e) => setEditForm(p => ({ ...p, price: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-desc" className="text-xs">Description</Label>
                <Input id="edit-desc" value={editForm.description} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-image" className="text-xs flex items-center gap-1">
                  <ImageIcon className="size-3" />
                  Image URL (optional)
                </Label>
                <Input id="edit-image" placeholder="https://example.com/image.jpg" value={editForm.image_url} onChange={(e) => setEditForm(p => ({ ...p, image_url: e.target.value }))} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={savingEdit} className="flex-1">
                  {savingEdit ? 'Saving...' : 'Save changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingListing(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-5 text-center space-y-4">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Delete product?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  "{deletingListing.title}" will be permanently removed. This cannot be undone.
                </p>
              </div>
              
              {!confirmDelete ? (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="delete-confirm" className="text-xs text-center block">Type "DELETE" to confirm</Label>
                  <Input 
                    id="delete-confirm" 
                    placeholder="DELETE" 
                    value={deletingListing._confirmText || ''}
                    onChange={(e) => setDeletingListing({ ...deletingListing, _confirmText: e.target.value } as any)}
                    className="text-center"
                  />
                </div>
              ) : null}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => { setDeletingListing(null); setConfirmDelete(false); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  disabled={!confirmDelete || deletingItem}
                  onClick={handleDeleteListing}
                  className="flex-1"
                >
                  {deletingItem ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
