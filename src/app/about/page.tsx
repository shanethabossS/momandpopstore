export const metadata = { title: 'About | Mom & Pop Marketplace' };

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-black tracking-tight">About Mom &amp; Pop Marketplace</h1>
      <div className="mt-6 space-y-4 text-muted-foreground leading-7">
        <p>
          Mom &amp; Pop Marketplace is a local-first storefront ecosystem built for Trinidad and Tobago
          small businesses. We help neighbourhood shops, home bakers, mechanics, salons, and service
          providers get online with a verified storefront, product catalog, WhatsApp ordering, and
          Fygaro payment links.
        </p>
        <p>
          Powered by Sovereign Digital Group Limited, we share a trust layer, KYC verification, and
          support infrastructure across the SOV Network of T&amp;T digital products.
        </p>
        <p>
          Have questions? WhatsApp us or email support@sovdigitalgroup.com.
        </p>
      </div>
    </div>
  );
}
