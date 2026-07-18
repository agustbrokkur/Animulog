import { Disc, Film, Shapes, Star, Tv, type LucideIcon } from "lucide-react";

export type MediaType = 'movie' | "tv" | "ova" | "special" | "other";
export const MEDIA_TYPES: MediaType[] = [ 'movie', "tv", "ova", "special", "other"] as const;

export const MEDIA_ICONS: Record<MediaType, LucideIcon> = {
  movie: Film,
  tv: Tv,
  ova: Disc,
  special: Star,
  other: Shapes
};