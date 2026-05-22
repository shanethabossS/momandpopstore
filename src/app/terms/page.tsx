export const metadata = { title: 'Terms of Service | Mom & Pop Marketplace' };

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: May 2026</p>
      <div className="mt-6 space-y-4 text-muted-foreground leading-7">
        <p>
          By using Mom &amp; Pop Marketplace, you agree to these terms. This platform is operated by
          Sovereign Digital Group Limited, registered in Trinidad and Tobago.
        </p>
        <h2 className="text-lg font-bold text-foreground">Merchant accounts</h2>
        <p>
          Merchants are responsible for the accuracy of their storefront information, product listings,
          pricing, and availability. Misleading listings may be removed.
        </p>
        <h2 className="text-lg font-bold text-foreground">Payments</h2>
        <p>
          Payments are processed through Fygaro payment links and WhatsApp-based arrangements between
          buyers and merchants. Mom &amp; Pop Marketplace does not process payments directly.
        </p>
        <h2 className="text-lg font-bold text-foreground">Content</h2>
        <p>
          You retain ownership of content you upload. By posting, you grant us a license to display it
          on the platform. We may remove content that violates our policies.
        </p>
      </div>
    </div>
  );
}
