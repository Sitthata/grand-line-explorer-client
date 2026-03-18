const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Island {
  id: number;
  name: string;
  description: string;
  image_url: string;
  sea: string;
}

export interface Character {
  id: number;
  name: string;
  bounty: string;
  role: string;
  image_url: string;
  island_id: number;
  devil_fruit: string;
  description: string;
  island_name?: string;
}

export interface IslandWithCharacters {
  island: Island;
  characters: Character[];
}

export async function fetchIslands(): Promise<Island[]> {
  const res = await fetch(`${API_URL}/api/islands`);
  if (!res.ok) throw new Error("Failed to fetch islands");
  const json = await res.json();
  return json.data;
}

export async function fetchIslandWithCharacters(
  id: number
): Promise<IslandWithCharacters> {
  const res = await fetch(`${API_URL}/api/islands/${id}/characters`);
  if (!res.ok) throw new Error("Failed to fetch island characters");
  const json = await res.json();
  return json.data;
}

export async function fetchCharacters(): Promise<Character[]> {
  const res = await fetch(`${API_URL}/api/characters`);
  if (!res.ok) throw new Error("Failed to fetch characters");
  const json = await res.json();
  return json.data;
}

export async function createCharacter(
  character: Omit<Character, "id" | "island_name">
): Promise<Character> {
  const res = await fetch(`${API_URL}/api/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character),
  });
  if (!res.ok) throw new Error("Failed to create character");
  const json = await res.json();
  return json.data;
}

export async function updateCharacter(
  id: number,
  character: Partial<Omit<Character, "id" | "island_name">>
): Promise<Character> {
  const res = await fetch(`${API_URL}/api/characters/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character),
  });
  if (!res.ok) throw new Error("Failed to update character");
  const json = await res.json();
  return json.data;
}

export async function deleteCharacter(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/characters/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete character");
}
