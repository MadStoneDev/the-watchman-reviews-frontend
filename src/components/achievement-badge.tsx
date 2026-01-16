"use client";

import React from "react";
import {
  IconMovie,
  IconDeviceTv,
  IconPlayerPlay,
  IconUserPlus,
  IconUsers,
  IconUserCheck,
  IconHeart,
  IconMessageCircle,
  IconBolt,
  IconThumbUp,
  IconFolder,
  IconShare,
  IconStar,
  IconMoon,
  IconCalendar,
  IconTrophy,
} from "@tabler/icons-react";
import type { AchievementDefinition, AchievementTier } from "@/src/app/actions/achievements";

interface AchievementBadgeProps {
  achievement: AchievementDefinition;
  unlocked?: boolean;
  unlockedAt?: string;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
}

const tierColors: Record<AchievementTier, { bg: string; border: string; text: string }> = {
  bronze: {
    bg: "bg-amber-900/30",
    border: "border-amber-700",
    text: "text-amber-500",
  },
  silver: {
    bg: "bg-neutral-400/20",
    border: "border-neutral-400",
    text: "text-neutral-300",
  },
  gold: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500",
    text: "text-yellow-400",
  },
  platinum: {
    bg: "bg-cyan-400/20",
    border: "border-cyan-400",
    text: "text-cyan-300",
  },
};

// TODO: Check if size was needed here because it had generated lots of errors
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  film: IconMovie,
  tv: IconDeviceTv,
  play: IconPlayerPlay,
  "user-plus": IconUserPlus,
  users: IconUsers,
  "user-check": IconUserCheck,
  heart: IconHeart,
  "message-circle": IconMessageCircle,
  zap: IconBolt,
  "thumbs-up": IconThumbUp,
  folder: IconFolder,
  share: IconShare,
  star: IconStar,
  moon: IconMoon,
  calendar: IconCalendar,
};

export default function AchievementBadge({
  achievement,
  unlocked = false,
  unlockedAt,
  size = "md",
  showDescription = true,
}: AchievementBadgeProps) {
  const colors = tierColors[achievement.tier];
  const IconComponent = achievement.icon ? iconMap[achievement.icon] : IconTrophy;

  const sizeClasses = {
    sm: {
      container: "p-2",
      icon: 20,
      title: "text-xs",
      desc: "text-xs",
    },
    md: {
      container: "p-3",
      icon: 28,
      title: "text-sm",
      desc: "text-xs",
    },
    lg: {
      container: "p-4",
      icon: 36,
      title: "text-base",
      desc: "text-sm",
    },
  };

  const s = sizeClasses[size];

  return (
    <div
      className={`${s.container} rounded-lg border ${colors.border} ${colors.bg} ${
        unlocked ? "opacity-100" : "opacity-40 grayscale"
      } transition-all hover:scale-105`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 rounded-full p-2 ${colors.bg} border ${colors.border}`}
        >
          <IconComponent size={24} className={colors.text} />
        </div>
        <div className="min-w-0">
          <h3 className={`font-semibold ${s.title} ${colors.text} truncate`}>
            {achievement.name}
          </h3>
          {showDescription && (
            <p className={`${s.desc} text-neutral-400 line-clamp-2`}>
              {achievement.description}
            </p>
          )}
          {unlocked && unlockedAt && (
            <p className={`${s.desc} text-neutral-500 mt-1`}>
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Grid component for displaying multiple achievements
export function AchievementGrid({
  achievements,
  userAchievements,
  showLocked = true,
}: {
  achievements: AchievementDefinition[];
  userAchievements: Map<string, { unlocked_at: string }>;
  showLocked?: boolean;
}) {
  const filteredAchievements = showLocked
    ? achievements
    : achievements.filter((a) => userAchievements.has(a.id));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filteredAchievements.map((achievement) => {
        const userAchievement = userAchievements.get(achievement.id);
        return (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            unlocked={!!userAchievement}
            unlockedAt={userAchievement?.unlocked_at}
          />
        );
      })}
    </div>
  );
}

// Summary component for profile headers
export function AchievementSummary({
  unlockedCount,
  totalCount,
  recentAchievements,
}: {
  unlockedCount: number;
  totalCount: number;
  recentAchievements: Array<{
    achievement: AchievementDefinition;
    unlocked_at: string;
  }>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconTrophy size={20} className="text-amber-400" />
        <span className="font-semibold">
          {unlockedCount} / {totalCount} Achievements
        </span>
      </div>
      {recentAchievements.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recentAchievements.slice(0, 3).map(({ achievement, unlocked_at }) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked
              unlockedAt={unlocked_at}
              size="sm"
              showDescription={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
