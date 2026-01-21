import { IconThumbUp, IconThumbDown } from "@tabler/icons-react";

import { PopcornIcon } from "lucide-react";

export const REACTION_TYPES = {
  negative: {
    id: "negative",
    icon: IconThumbDown,
    label: "Disagree",
    hoverColor: "hover:text-red-600",
    activeColor: "text-red-600",
    activeBg: "bg-red-600/20",
  },
  positive: {
    id: "positive",
    icon: IconThumbUp,
    label: "Agree",
    hoverColor: "hover:text-sky-600",
    activeColor: "text-sky-600",
    activeBg: "bg-sky-600/20",
  },
  popcorn: {
    id: "popcorn",
    icon: PopcornIcon,
    label: "Spicy take",
    hoverColor: "hover:text-lime-400",
    activeColor: "text-lime-400",
    activeBg: "bg-lime-400/20",
  },
} as const;

export type ReactionType = keyof typeof REACTION_TYPES;

export const getReactionConfig = (type: ReactionType) => REACTION_TYPES[type];

export const isValidReactionType = (type: string): type is ReactionType => {
  return type in REACTION_TYPES;
};

// Helper to get all reaction type keys
export const getReactionTypeKeys = (): ReactionType[] => {
  return Object.keys(REACTION_TYPES) as ReactionType[];
};
