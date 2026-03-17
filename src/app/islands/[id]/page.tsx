"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  fetchIslandWithCharacters,
  deleteCharacter,
  type IslandWithCharacters,
} from "@/lib/api";
import { CharacterCard } from "@/components/character-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function IslandDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [data, setData] = useState<IslandWithCharacters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    fetchIslandWithCharacters(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (characterId: number) => {
    try {
      await deleteCharacter(characterId);
      loadData();
    } catch (err) {
      console.error("Failed to delete character:", err);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-op-red text-lg font-semibold">
          Failed to load island
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Make sure the API server is running on port 3001
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-64 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-56 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { island, characters } = data;
  const seaColor =
    island.sea === "New World"
      ? "bg-op-red text-white"
      : "bg-op-azure text-white";

  return (
    <div>
      <Link href="/">
        <Button variant="ghost" className="mb-4 text-op-waterfall hover:text-op-waterfall/80">
          &larr; Back to Islands
        </Button>
      </Link>

      {/* Island Hero */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border">
        <div className="relative h-64 w-full">
          <Image
            src={island.image_url}
            alt={island.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-6">
          <Badge className={`mb-2 ${seaColor}`}>{island.sea}</Badge>
          <h1 className="text-3xl font-bold text-white">{island.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            {island.description}
          </p>
        </div>
      </div>

      {/* Characters */}
      <h2 className="mb-4 text-xl font-bold text-op-yellow">
        Characters ({characters.length})
      </h2>

      {characters.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center">
          No characters found on this island.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
