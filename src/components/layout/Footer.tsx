import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/35 py-8">
      <div className="container mx-auto flex flex-col justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row md:items-center">
        <p>
          &copy; {new Date().getFullYear()} Shop868. Powered by Sovereign Digital Group Limited.
        </p>
        <div className="flex flex-wrap gap-4 font-medium">
          <Link href="/stores" className="hover:text-foreground">Stores</Link>
          <Link href="/dashboard" className="hover:text-foreground">Merchant dashboard</Link>
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
