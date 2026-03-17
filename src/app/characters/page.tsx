"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchCharacters,
  deleteCharacter,
  type Character,
} from "@/lib/api";
import { CharacterCard } from "@/components/character-card";
import { AddCharacterForm } from "@/components/add-character-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharacters = useCallback(() => {
    setLoading(true);
    fetchCharacters()
      .then(setCharacters)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const handleDelete = async (id: number) => {
    try {
      await deleteCharacter(id);
      loadCharacters();
    } catch (err) {
      console.error("Failed to delete character:", err);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-op-red text-lg font-semibold">
          Failed to load characters
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Make sure the API server is running on port 3001
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-op-yellow mb-2">
            All Characters
          </h1>
          <p className="text-muted-foreground">
            Browse all characters across the Grand Line
          </p>
        </div>
        <AddCharacterForm onCharacterAdded={loadCharacters} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-56 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDelete={handleDelete}
                showIsland
              />
            ))}
      </div>

      {!loading && characters.length === 0 && (
        <p className="text-muted-foreground py-10 text-center">
          No characters found. Add one to get started!
        </p>
      )}
    </div>
  );
}
