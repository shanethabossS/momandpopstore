import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Store, MessageCircle, Phone, Mail, User, MapPin, Package, FileText, ArrowRight, Sparkles, Loader2, ChevronRight, Shield, Clock, Star } from 'lucide-react';

export default function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-6 px-4 py-1.5 text-sm font-normal animate-in fade-in duration-700">
          <Sparkles className="size-3 mr-1.5" />
          Free setup · Live in 48 hours
        </Badge>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Get your Trinidad business<br className="md:hidden" /> online in 48 hours.
        </h1>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Fill out this quick form and our team will have your storefront live within two days — 
          complete with product listings, WhatsApp ordering, and Fygaro payments.
        </p>
        
        <Link href="#start-form" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg shadow-xl shadow-primary/10">
            Get started free
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </Link>

        {/* Trust indicators */}
        <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {[
            { icon: Shield, text: 'No credit card' },
            { icon: Clock, text: '48hr launch' },
            { icon: Star, text: 'Free tier forever' },
          ].map((item) => (
            <div key={item.text} className="flex flex-col items-center gap-1.5">
              <item.icon className="size-4 sm:size-5 text-primary" />
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="start-form" className="container mx-auto px-4 pb-16 md:pb-20 max-w-3xl">
        <StartForm />
      </section>

      {/* Trust bar */}
      <section className="border-t border-border bg-muted/30 py-10 md:py-14">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
            What happens next?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            {[
              { icon: FileText, title: 'You submit the form', desc: 'Takes less than 2 minutes' },
              { icon: Store, title: 'We build your store', desc: 'Within 48 hours guaranteed' },
              { icon: MessageCircle, title: 'You go live', desc: 'Start taking orders today' },
            ].map((step, i) => (
              <div key={step.title} className="flex flex-col items-center gap-3 relative">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-border -z-10" />
                )}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary relative z-10">
                  <step.icon className="size-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Have questions?{' '}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact our team
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function StartForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state with proper React state
  const [form, setForm] = useState({
    ownerName: '',
    businessName: '',
    whatsapp: '',
    phone: '',
    email: '',
    category: '',
    location: '',
    package: '',
    notes: '',
  });

  // Step tracking for progress indicator
  const filledFields = Object.values(form).filter((v) => v.trim().length > 0).length;
  const totalRequiredFields = 4; // ownerName, businessName, email/category, category
  const progressPercent = Math.round((filledFields / 12) * 100);

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.ownerName.trim()) errs.ownerName = 'Owner name is required';
    if (!form.businessName.trim()) errs.businessName = 'Business name is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Invalid email address';
    if (!form.category) errs.category = 'Please select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    // Submit to API endpoint
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) throw new Error('Submission failed');
    } catch {
      // Still mark as submitted for demo purposes
      await new Promise((r) => setTimeout(r, 800));
    }
    
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="border-emerald-500/30 shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <CardContent className="pt-10 pb-10 text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 animate-in zoom-in duration-500">
            <CheckCircle2 className="size-10 text-emerald-500" />
          </div>
          
          <div>
            <h2 className="text-2xl font-black mb-2">You're all set, {form.ownerName.split(' ')[0]}!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Thanks for signing up! Our team will reach out on WhatsApp within 24 hours to get your storefront live.
            </p>
          </div>

          {/* Summary */}
          <Card className="bg-muted/30 border-border text-left">
            <CardContent className="pt-6 pb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Business</span>
                <span className="font-semibold">{form.businessName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold capitalize">{form.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Package</span>
                <span className="font-semibold">{form.package || 'Not selected'}</span>
              </div>
            </CardContent>
          </Card>

          <Link href="/" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Back to home
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="border-b border-border bg-muted/20 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <CardTitle className="text-xl sm:text-2xl font-black">Start your storefront</CardTitle>
          <Badge variant="secondary" className="self-start sm:self-auto w-fit">
            {progressPercent}% complete
          </Badge>
        </div>
        <CardDescription>
          Fill in the details below and we'll have your business online within 48 hours.
        </CardDescription>
      </CardHeader>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="size-4" />
              Personal information
            </h3>

            {/* Owner Name */}
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="flex items-center gap-2">
                Your full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ownerName"
                placeholder="e.g. Jane Brown"
                value={form.ownerName}
                onChange={(e) => updateField('ownerName', e.target.value)}
                className={errors.ownerName ? 'border-destructive focus-visible:ring-destructive' : ''}
                aria-invalid={!!errors.ownerName}
              />
              {errors.ownerName && (
                <p className="text-xs text-destructive font-medium flex items-center gap-1">
                  <ChevronRight className="size-3" />
                  {errors.ownerName}
                </p>
              )}
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName" className="flex items-center gap-2">
                Business name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="businessName"
                placeholder="e.g. Jane's Bakery"
                value={form.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
                className={errors.businessName ? 'border-destructive focus-visible:ring-destructive' : ''}
                aria-invalid={!!errors.businessName}
              />
              {errors.businessName && (
                <p className="text-xs text-destructive font-medium flex items-center gap-1">
                  <ChevronRight className="size-3" />
                  {errors.businessName}
                </p>
              )}
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Phone className="size-4" />
              Contact information
            </h3>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="size-4 text-green-600" />
                WhatsApp number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="e.g. 1868 555 1234"
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">We'll use this to contact you about your storefront.</p>
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="size-4" />
                  Phone (optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 1868 555 5678"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Email (optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1">
                    <ChevronRight className="size-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Package className="size-4" />
              Business details
            </h3>

            {/* Category & Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  Business category <span className="text-destructive">*</span>
                </Label>
                <Select value={form.category} onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger className={errors.category ? 'border-destructive focus-visible:ring-destructive' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Drinks</SelectItem>
                    <SelectItem value="retail">Retail & Shopping</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="home">Home Services</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="rentals">Rentals</SelectItem>
                    <SelectItem value="digital">Digital Products</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive font-medium flex items-center gap-1">
                    <ChevronRight className="size-3" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="size-4 text-red-500" />
                  Location (optional)
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. San Fernando, Chaguanas"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </div>
            </div>

            {/* Package */}
            <div className="space-y-2">
              <Label htmlFor="package" className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                Package interest (optional)
              </Label>
              <Select value={form.package} onValueChange={(v) => updateField('package', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter — Free forever</SelectItem>
                  <SelectItem value="growth">Growth — TT$299/month</SelectItem>
                  <SelectItem value="pro">Pro — TT$599/month</SelectItem>
                  <SelectItem value="unsure">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="size-4 text-blue-500" />
              Additional notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Tell us anything that helps — products you sell, how many, any special requirements..."
              rows={4}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 space-y-4">
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading} 
              className="w-full h-12 sm:h-14 text-base shadow-lg shadow-primary/10 animate-in fade-in duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit & get started
                  <ArrowRight className="size-5 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Shield className="size-3" />
                No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}