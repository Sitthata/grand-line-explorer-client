"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchIslands,
  updateCharacter,
  type Character,
  type Island,
} from "@/lib/api";

interface CharacterCardProps {
  character: Character;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  showIsland?: boolean;
}

export function CharacterCard({
  character,
  onDelete,
  onUpdate,
  showIsland = false,
}: CharacterCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [islands, setIslands] = useState<Island[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(character.name);
  const [bounty, setBounty] = useState(character.bounty);
  const [role, setRole] = useState(character.role);
  const [islandId, setIslandId] = useState(String(character.island_id));
  const [devilFruit, setDevilFruit] = useState(character.devil_fruit);
  const [description, setDescription] = useState(character.description);
  const [imageUrl, setImageUrl] = useState(character.image_url);

  useEffect(() => {
    if (editOpen) {
      fetchIslands()
        .then(setIslands)
        .catch(() => setIslands([]));

      setName(character.name);
      setBounty(character.bounty);
      setRole(character.role);
      setIslandId(String(character.island_id));
      setDevilFruit(character.devil_fruit);
      setDescription(character.description);
      setImageUrl(character.image_url);
    }
  }, [editOpen, character]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${character.name}?`)) {
      onDelete(character.id);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      await updateCharacter(character.id, {
        name,
        bounty: bounty || "None",
        role: role || "Unknown",
        image_url: imageUrl,
        island_id: parseInt(islandId),
        devil_fruit: devilFruit || "None",
        description,
      });
      setEditOpen(false);
      onUpdate(character.id);
    } catch (error) {
      console.error("Failed to update character:", error);
    } finally {
      setLoading(false);
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
          className="object-top"
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
      <CardFooter className="gap-2 p-4 pt-0 border-t-0 bg-transparent">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-op-azure text-op-waterfall hover:bg-op-azure/10"
            >
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-op-yellow">
                Edit Character
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label htmlFor={`edit-name-${character.id}`}>Name *</Label>
                <Input
                  id={`edit-name-${character.id}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-border bg-background"
                />
              </div>

              <div>
                <Label htmlFor={`edit-bounty-${character.id}`}>Bounty</Label>
                <Input
                  id={`edit-bounty-${character.id}`}
                  value={bounty}
                  onChange={(e) => setBounty(e.target.value)}
                  placeholder="e.g. 3,000,000,000"
                  className="border-border bg-background"
                />
              </div>

              <div>
                <Label htmlFor={`edit-role-${character.id}`}>Role</Label>
                <Input
                  id={`edit-role-${character.id}`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Captain"
                  className="border-border bg-background"
                />
              </div>

              <div>
                <Label htmlFor={`edit-island-${character.id}`}>Island</Label>
                <Select
                  value={islandId}
                  onValueChange={(v) => setIslandId(v ?? "")}
                >
                  <SelectTrigger className="border-border bg-background">
                    <SelectValue placeholder="Select an island" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card">
                    {islands.map((island) => (
                      <SelectItem key={island.id} value={String(island.id)}>
                        {island.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`edit-devil-fruit-${character.id}`}>
                  Devil Fruit
                </Label>
                <Input
                  id={`edit-devil-fruit-${character.id}`}
                  value={devilFruit}
                  onChange={(e) => setDevilFruit(e.target.value)}
                  placeholder="e.g. Gomu Gomu no Mi"
                  className="border-border bg-background"
                />
              </div>

              <div>
                <Label htmlFor={`edit-description-${character.id}`}>
                  Description
                </Label>
                <Textarea
                  id={`edit-description-${character.id}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-border bg-background"
                />
              </div>

              <div>
                <Label htmlFor={`edit-image-${character.id}`}>Image URL</Label>
                <Input
                  id={`edit-image-${character.id}`}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border-border bg-background"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !name}
                className="w-full bg-op-azure hover:bg-op-azure/80 text-white"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          size="sm"
          className="flex-1 bg-op-red hover:bg-op-red/80"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
