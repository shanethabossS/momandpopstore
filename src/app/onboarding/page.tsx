'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Package,
  Store,
} from 'lucide-react';

const CATEGORIES = [
  'Food & Drinks',
  'Retail & Shopping',
  'Services',
  'Beauty & Wellness',
  'Automotive',
  'Home Services',
  'Health',
  'Events',
  'Rentals',
  'Digital',
] as const;

const STEPS = ['Business Details', 'Category & Location', 'Products', 'WhatsApp & Payment'];

type FormData = {
  shop_name: string;
  description: string;
  category: string;
  address: string;
  service_area: string;
  hours: string;
  delivery: boolean;
  pickup: boolean;
  whatsapp: string;
  products: { name: string; price: string; description: string }[];
};

const INITIAL: FormData = {
  shop_name: '',
  description: '',
  category: '',
  address: '',
  service_area: '',
  hours: '',
  delivery: false,
  pickup: true,
  whatsapp: '',
  products: [{ name: '', price: '', description: '' }],
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addProduct() {
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', price: '', description: '' }],
    }));
  }

  function updateProduct(index: number, field: string, value: string) {
    setForm((prev) => {
      const products = [...prev.products];
      products[index] = { ...products[index], [field]: value };
      return { ...prev, products };
    });
  }

  function removeProduct(index: number) {
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  }

  function canAdvance(): boolean {
    if (step === 0) return !!form.shop_name.trim();
    if (step === 1) return !!form.category && !!form.address.trim();
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');

    const slug = form.shop_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const { error: shopError } = await apiFetch('/api/shops', {
      method: 'POST',
      body: JSON.stringify({
        shop_name: form.shop_name,
        shop_slug: slug,
        description: form.description,
        category: form.category,
        address: form.address,
        service_area: form.service_area,
        hours: form.hours,
        delivery: form.delivery,
        pickup: form.pickup,
        whatsapp: form.whatsapp,
      }),
    });

    if (shopError) {
      setError(shopError);
      setLoading(false);
      return;
    }

    const validProducts = form.products.filter((p) => p.name.trim() && p.price.trim());
    for (const product of validProducts) {
      await apiFetch('/api/listings', {
        method: 'POST',
        body: JSON.stringify({
          title: product.name,
          price: parseFloat(product.price) || 0,
          description: product.description,
          category: form.category,
          subcategory: 'general',
          contact_whatsapp: form.whatsapp,
        }),
      });
    }

    router.replace('/dashboard');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Set up your storefront</h1>
        <p className="mt-2 text-muted-foreground">
          {user?.name ? `Hey ${user.name.split(' ')[0]}, let's` : "Let's"} get your business online.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-2 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-primary">
                <Store className="size-6" />
                <h2 className="text-xl font-bold">Business Details</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shop_name">Business name *</Label>
                  <Input
                    id="shop_name"
                    placeholder="e.g. Mama's Kitchen, Quick Fix Auto"
                    value={form.shop_name}
                    onChange={(e) => update('shop_name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short description</Label>
                  <textarea
                    id="description"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                    placeholder="Tell customers what you do in 1-2 sentences"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Opening hours</Label>
                  <Input
                    id="hours"
                    placeholder="e.g. Mon-Sat 8am-6pm"
                    value={form.hours}
                    onChange={(e) => update('hours', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-primary">
                <MapPin className="size-6" />
                <h2 className="text-xl font-bold">Category & Location</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business category *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => update('category', cat)}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                          form.category === cat
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business address *</Label>
                  <Input
                    id="address"
                    placeholder="Street, town/city"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_area">Service area</Label>
                  <Input
                    id="service_area"
                    placeholder="e.g. North Trinidad, Port of Spain area"
                    value={form.service_area}
                    onChange={(e) => update('service_area', e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.delivery}
                      onChange={(e) => update('delivery', e.target.checked)}
                      className="size-4 rounded border-border"
                    />
                    Delivery available
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.pickup}
                      onChange={(e) => update('pickup', e.target.checked)}
                      className="size-4 rounded border-border"
                    />
                    Pickup available
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-primary">
                  <Package className="size-6" />
                  <h2 className="text-xl font-bold">Products / Services</h2>
                </div>
                <Button variant="outline" size="sm" onClick={addProduct}>
                  + Add item
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add your products or services. You can add more later from the dashboard.
              </p>
              <div className="space-y-4">
                {form.products.map((product, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Item {i + 1}</span>
                      {form.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(i)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        placeholder="Product/service name"
                        value={product.name}
                        onChange={(e) => updateProduct(i, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Price (TT$)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct(i, 'price', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Short description (optional)"
                      value={product.description}
                      onChange={(e) => updateProduct(i, 'description', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-primary">
                <MessageCircle className="size-6" />
                <h2 className="text-xl font-bold">WhatsApp & Payment</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp number</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="1868XXXXXXX (with country code)"
                    value={form.whatsapp}
                    onChange={(e) => update('whatsapp', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Customers will message you here to place orders.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-bold">Payment setup</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fygaro payment links will be set up after your storefront goes live.
                    You can accept cash on delivery, bank transfer, or Fygaro online payments.
                  </p>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <h3 className="font-bold text-primary">Ready to launch!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your storefront will be live at <strong>momandpopstore.com/store/{form.shop_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-business'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()}>
                Next
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Launch storefront'}
                <Check className="size-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
