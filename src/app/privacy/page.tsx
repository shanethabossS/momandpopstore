export const metadata = { title: 'Privacy Policy | Mom & Pop Marketplace' };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: May 2026</p>
      <div className="mt-6 space-y-4 text-muted-foreground leading-7">
        <p>
          Sovereign Digital Group Limited operates Mom &amp; Pop Marketplace. This policy explains how
          we collect, use, and protect your information.
        </p>
        <h2 className="text-lg font-bold text-foreground">What we collect</h2>
        <p>
          Account information (name, email) via Google Sign-In. Storefront data you provide (business
          name, address, products, WhatsApp number). Usage data for analytics.
        </p>
        <h2 className="text-lg font-bold text-foreground">How we use it</h2>
        <p>
          To operate your storefront, display your business to customers, process verification, and
          improve the platform. We do not sell your data.
        </p>
        <h2 className="text-lg font-bold text-foreground">Contact</h2>
        <p>
          Questions about your data? Email privacy@sovdigitalgroup.com.
        </p>
      </div>
    </div>
  );
}
