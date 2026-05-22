import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/35 py-8">
      <div className="container mx-auto flex flex-col justify-between gap-6 px-4 text-sm text-muted-foreground md:flex-row md:items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-[10px] font-black text-primary-foreground">
              M&P
            </span>
            <span className="font-bold text-foreground">Mom &amp; Pop Store</span>
          </div>
          <p className="max-w-xs text-xs leading-5">
            Verified Trinidad and Tobago local storefronts. Powered by Sovereign Digital Group Limited.
          </p>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Sovereign Digital Group Limited. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Marketplace</h4>
            <div className="flex flex-col gap-1.5">
              <Link href="/stores" className="hover:text-foreground">Browse stores</Link>
              <Link href="/dashboard" className="hover:text-foreground">Merchant dashboard</Link>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Company</h4>
            <div className="flex flex-col gap-1.5">
              <Link href="/about" className="hover:text-foreground">About</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
