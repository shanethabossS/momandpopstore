import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/92 backdrop-blur">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
            868
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xl font-black tracking-tight">Shop868</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              Powered by Sovereign Digital Group Limited
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/stores" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            Browse stores
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            Merchant
          </Link>
          <Link href="/admin" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 lg:flex">
            <ShieldCheck className="size-3.5" />
            Trust ready
          </div>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
