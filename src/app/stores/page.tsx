import { SearchExperience } from "@/components/shop868/SearchExperience";
import { StoreCard } from "@/components/shop868/StoreCard";
import { storefronts } from "@/lib/shop868-data";

export const metadata = {
  title: "Browse Trinidad Storefronts | Shop868",
  description: "Search verified Trinidad and Tobago small business storefronts, products, categories, and deals.",
};

export default function StoresDirectory() {
  return (
    <div className="container mx-auto w-full px-4 py-10">
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Storefront directory</h1>
          <p className="mt-3 text-muted-foreground">
            Search business names, products, categories, locations, tags, and deals across Trinidad and Tobago.
          </p>
        </div>
        <SearchExperience mode="directory" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {storefronts.map((store) => (
          <StoreCard key={store.slug} store={store} />
        ))}
      </div>
    </div>
  );
}
