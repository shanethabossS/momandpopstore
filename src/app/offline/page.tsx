export const metadata = {
  title: 'Offline | Mom & Pop Marketplace',
};

export default function OfflinePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-black text-primary">
        M&P
      </div>
      <h1 className="text-2xl font-black tracking-tight">You&apos;re Offline</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Check your internet connection and try again. Mom &amp; Pop Marketplace needs a network connection to browse stores and products.
      </p>
    </div>
  );
}
