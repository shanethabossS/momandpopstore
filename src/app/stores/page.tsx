"use client";

import { useState, useMemo } from "react";
import { SearchExperience } from "@/components/marketplace/SearchExperience";
import { StoreCard } from "@/components/marketplace/StoreCard";
import { storefronts } from "@/lib/marketplace-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Filter,
  Grid3x3,
  List,
  Star,
  TrendingUp,
  Sparkles,
  Store,
} from "lucide-react";

type ViewMode = "grid" | "list";
type SortMode = "featured" | "name" | "location";

const categories = [
  "All",
  ...Array.from(new Set(storefronts.flatMap((s) => s.categories || []))),
];

export default function StoresDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filteredStores = useMemo(() => {
    let result = [...storefronts];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(q) ||
          store.description?.toLowerCase().includes(q) ||
          store.categories?.some((c: string) => c.toLowerCase().includes(q)) ||
          store.location?.toLowerCase().includes(q) ||
          store.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((store) =>
        store.categories?.includes(selectedCategory)
      );
    }

    // Sort
    switch (sortMode) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "location":
        result.sort((a, b) =>
          (a.location || "").localeCompare(b.location || "")
        );
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* ===== HEADER ===== */}
      <section className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                <Store className="size-7 text-primary" />
                Browse Stores
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {storefronts.length} verified Trinidad & Tobago businesses
              </p>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-md md:max-w-lg lg:max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores, products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-background border-border/60 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTERS BAR ===== */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 px-3 py-1 text-xs ${
                    selectedCategory === cat
                      ? "shadow-md shadow-primary/20"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>

            {/* Filter toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-9"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="size-4" />
              Filters
            </Button>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${viewMode === "grid" ? "" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${viewMode === "list" ? "" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="size-4" />
              </Button>
            </div>

            {/* Sort */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="h-9 px-3 text-sm border border-border rounded-lg bg-background focus:border-primary outline-none cursor-pointer"
            >
              <option value="featured">Featured first</option>
              <option value="name">Name A-Z</option>
              <option value="location">Location</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredStores.length}
              </span>{" "}
              of {storefronts.length} stores
              {selectedCategory !== "All" && (
                <span className="ml-2">
                  in <Badge variant="outline" className="text-xs ml-1">{selectedCategory}</Badge>
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ===== STORES GRID ===== */}
      <section className="container mx-auto px-4 py-8">
        {filteredStores.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 rounded-full bg-muted p-8">
              <Search className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No stores found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStores.map((store, index) => (
              <div
                key={store.slug}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <StoreCard store={store} />
              </div>
            ))}
          </div>
        ) : (
          /* List view */
          <div className="space-y-4">
            {filteredStores.map((store, index) => (
              <div
                key={store.slug}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <StoreCard store={store} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="border-t border-border bg-gradient-to-r from-primary/5 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4 px-3 py-1 text-xs font-normal uppercase tracking-wider">
            Own a Business?
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl mb-4">
            Get listed and grow your reach
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
            Join hundreds of Trinidad & Tobago businesses already finding customers through Mom & Pop Store.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center items-center">
            <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 group">
              Create your storefront
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}