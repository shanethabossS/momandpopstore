export default function Loading() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-[1600px] px-4 pt-9 lg:px-8">
        <div className="mkt-skeleton h-4 w-24 rounded-full" />
        <div className="mkt-skeleton mt-3 h-9 w-80 max-w-full rounded-lg" />
        <div className="mkt-skeleton mt-6 h-11 w-full max-w-2xl rounded-full" />
      </section>
      <section className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="mkt-skeleton aspect-[1.42/1] w-full" />
              <div className="mkt-skeleton mt-3 h-4 w-4/5 rounded" />
              <div className="mkt-skeleton mt-2 h-3 w-3/5 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
