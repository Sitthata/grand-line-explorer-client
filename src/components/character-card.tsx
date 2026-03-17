"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Character } from "@/lib/api";

interface CharacterCardProps {
  character: Character;
  onDelete: (id: number) => void;
  showIsland?: boolean;
}

export function CharacterCard({
  character,
  onDelete,
  showIsland = false,
}: CharacterCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${character.name}?`)) {
      onDelete(character.id);
    }
  };

  return (
    <Card className="group flex flex-col border-border bg-card p-0 transition-all hover:border-op-bronze/50">
      {/* Image bleeds into the rounded top corners */}
      <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
        <Image
          src={character.image_url}
          alt={character.name}
          fill
          className="object-cover object-top"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content area grows to push footer down */}
      <CardContent className="flex-1 p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-bold text-foreground">
            {character.name}
          </h3>
          <Badge
            variant="outline"
            className="shrink-0 border-op-azure text-op-waterfall"
          >
            {character.role}
          </Badge>
        </div>

        {character.bounty && character.bounty !== "None" && (
          <p className="mb-1 text-sm font-semibold text-op-yellow">
            {character.bounty}
          </p>
        )}

        {character.devil_fruit && character.devil_fruit !== "None" && (
          <Badge className="mb-2 bg-op-bronze/20 text-op-bronze">
            {character.devil_fruit}
          </Badge>
        )}

        {character.devil_fruit === "None" && (
          <p className="mb-2 text-xs text-muted-foreground italic">
            No Devil Fruit
          </p>
        )}

        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {character.description}
        </p>

        {showIsland && character.island_name && (
          <p className="text-xs text-op-waterfall">{character.island_name}</p>
        )}
      </CardContent>

      {/* Footer always pinned to bottom */}
      <CardFooter className="p-4 pt-0 border-t-0 bg-transparent">
        <Button
          variant="destructive"
          size="sm"
          className="w-full bg-op-red hover:bg-op-red/80"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
