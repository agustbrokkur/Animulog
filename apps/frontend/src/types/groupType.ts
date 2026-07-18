import { PlayCircle, CheckCircle2, Layers, type LucideIcon, Diamond } from "lucide-react";

export type GroupType = 'watching' | 'watched' | 'backlog' | 'other';
export const GROUP_TYPES: GroupType[] = ['watching', 'backlog', 'watched', 'other'] as const;
export const GROUP_TYPE_MAPPINGS = {
    'watching': 'In Progress',
    'backlog': 'Backlog',
    'watched': 'Watched',
    'other': 'Other'
} as const;

export const GROUP_ICONS: Record<GroupType, LucideIcon> = {
  watching: PlayCircle,
  backlog: Layers,
  watched: CheckCircle2,
  other: Diamond,
};