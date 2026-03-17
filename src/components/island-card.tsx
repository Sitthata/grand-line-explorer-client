"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Island } from "@/lib/api";

interface IslandCardProps {
  island: Island;
}

export function IslandCard({ island }: IslandCardProps) {
  const seaColor =
    island.sea === "New World"
      ? "bg-op-red text-white"
      : "bg-op-azure text-white";

  return (
    <Link href={`/islands/${island.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:border-op-bronze hover:shadow-lg hover:shadow-op-bronze/10">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={island.image_url}
            alt={island.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className={`absolute top-3 right-3 ${seaColor}`}>
            {island.sea}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1 text-lg font-bold text-op-yellow">
            {island.name}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {island.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
