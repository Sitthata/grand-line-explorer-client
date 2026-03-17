"use client";

import { useEffect, useState } from "react";
import { fetchIslands, type Island } from "@/lib/api";
import { IslandCard } from "@/components/island-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [islands, setIslands] = useState<Island[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIslands()
      .then(setIslands)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-op-red text-lg font-semibold">
          Failed to load islands
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Make sure the API server is running on port 3001
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-op-yellow mb-2">
          The Grand Line
        </h1>
        <p className="text-muted-foreground">
          Explore the legendary islands and discover the characters who shaped
          their history
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : islands.map((island) => (
              <IslandCard key={island.id} island={island} />
            ))}
      </div>
    </div>
  );
}
