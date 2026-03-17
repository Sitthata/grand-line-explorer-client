"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { fetchIslands, createCharacter, type Island } from "@/lib/api";

interface AddCharacterFormProps {
  onCharacterAdded: () => void;
}

export function AddCharacterForm({ onCharacterAdded }: AddCharacterFormProps) {
  const [open, setOpen] = useState(false);
  const [islands, setIslands] = useState<Island[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [bounty, setBounty] = useState("");
  const [role, setRole] = useState("");
  const [islandId, setIslandId] = useState("");
  const [devilFruit, setDevilFruit] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (open) {
      fetchIslands()
        .then(setIslands)
        .catch(() => setIslands([]));
    }
  }, [open]);

  const resetForm = () => {
    setName("");
    setBounty("");
    setRole("");
    setIslandId("");
    setDevilFruit("");
    setDescription("");
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const finalImageUrl =
        imageUrl ||
        `https://placehold.co/400x600?text=${encodeURIComponent(name)}`;

      await createCharacter({
        name,
        bounty: bounty || "None",
        role: role || "Unknown",
        image_url: finalImageUrl,
        island_id: parseInt(islandId),
        devil_fruit: devilFruit || "None",
        description,
      });

      resetForm();
      setOpen(false);
      onCharacterAdded();
    } catch (error) {
      console.error("Failed to create character:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-op-azure px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-op-azure/80">
        + Add Character
      </DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-op-yellow">
            Add New Character
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monkey D. Luffy"
              required
              className="border-border bg-background"
            />
          </div>

          <div>
            <Label htmlFor="bounty">Bounty</Label>
            <Input
              id="bounty"
              value={bounty}
              onChange={(e) => setBounty(e.target.value)}
              placeholder="e.g. 3,000,000,000"
              className="border-border bg-background"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Captain"
              className="border-border bg-background"
            />
          </div>

          <div>
            <Label htmlFor="island">Island</Label>
            <Select value={islandId} onValueChange={(v) => setIslandId(v ?? "")}>
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
            <Label htmlFor="devil_fruit">Devil Fruit</Label>
            <Input
              id="devil_fruit"
              value={devilFruit}
              onChange={(e) => setDevilFruit(e.target.value)}
              placeholder="e.g. Gomu Gomu no Mi"
              className="border-border bg-background"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the character..."
              className="border-border bg-background"
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <Input
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Leave empty for placeholder"
              className="border-border bg-background"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !name}
            className="w-full bg-op-azure hover:bg-op-azure/80 text-white"
          >
            {loading ? "Adding..." : "Add Character"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
