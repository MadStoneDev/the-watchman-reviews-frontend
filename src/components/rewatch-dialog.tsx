"use client";

import React from "react";
import {
  IconX,
  IconRefresh,
  IconHistory,
  IconTrophy,
  IconPlayerPlay,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";

interface RewatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cycleNumber: number;
  seriesTitle?: string;
  isLoading?: boolean;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function getWatchDescription(cycleNumber: number): string {
  const nextCycle = cycleNumber + 1;
  if (nextCycle === 2) return "your first rewatch";
  if (nextCycle === 3) return "your second rewatch";
  if (nextCycle === 4) return "your third rewatch";
  if (nextCycle <= 5) return `your ${nextCycle - 1}${getOrdinalSuffix(nextCycle - 1)} rewatch`;
  return `rewatch #${nextCycle - 1}`;
}

export default function RewatchDialog({
  isOpen,
  onClose,
  onConfirm,
  cycleNumber,
  seriesTitle,
  isLoading = false,
}: RewatchDialogProps) {
  if (!isOpen) return null;

  const nextCycleNumber = cycleNumber + 1;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl max-w-md w-full overflow-hidden border border-neutral-800 shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
            <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <IconRefresh size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Start a Rewatch</h2>
                <p className="text-indigo-100 text-sm mt-0.5">
                  Cycle #{nextCycleNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div className="text-center">
            <p className="text-neutral-300 leading-relaxed">
              Ready to experience{" "}
              {seriesTitle ? (
                <span className="text-white font-medium">{seriesTitle}</span>
              ) : (
                "this series"
              )}{" "}
              all over again? This will be{" "}
              <span className="text-indigo-400 font-medium">
                {getWatchDescription(cycleNumber)}
              </span>
              .
            </p>
          </div>

          {/* What happens section */}
          <div className="bg-neutral-800/50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
              What happens next
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <div className="p-1 bg-green-500/20 rounded-md mt-0.5">
                  <IconCheck size={14} className="text-green-400" />
                </div>
                <span className="text-sm text-neutral-300">
                  Your current watch is marked as <span className="text-green-400">complete</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 bg-amber-500/20 rounded-md mt-0.5">
                  <IconTrash size={14} className="text-amber-400" />
                </div>
                <span className="text-sm text-neutral-300">
                  Episode progress resets to <span className="text-amber-400">zero</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 bg-indigo-500/20 rounded-md mt-0.5">
                  <IconPlayerPlay size={14} className="text-indigo-400" />
                </div>
                <span className="text-sm text-neutral-300">
                  A <span className="text-indigo-400">fresh cycle</span> begins from episode 1
                </span>
              </li>
            </ul>
          </div>

          {/* Achievement hint */}
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <IconTrophy size={18} className="text-amber-400" />
            </div>
            <p className="text-sm text-amber-200/90">
              Rewatches count toward achievements!
            </p>
          </div>

          {/* History note */}
          {cycleNumber > 1 && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <IconHistory size={14} />
              <span>
                You've watched this series {cycleNumber} time{cycleNumber > 1 ? "s" : ""} before
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-200 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <IconRefresh size={18} className="animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <IconRefresh size={18} />
                Start Rewatch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
