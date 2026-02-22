"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DBQuest } from "./milestones-card";

interface QuestRowProps {
  quest: DBQuest & { isMet: boolean };
  isClaimed: boolean;
  claimingId: string | null;
  handleClaimXP: (id: string, xp: number) => void;
}

export function QuestRow({ 
  quest, 
  isClaimed, 
  claimingId, 
  handleClaimXP 
}: QuestRowProps) {
  const canClaim = quest.isMet && !isClaimed;

  return (
    <div className={cn(
      "group flex items-center justify-between p-3 rounded-xl border transition-all",
      quest.isMet 
        ? "bg-violet-50/50 border-violet-200 dark:bg-violet-900/10 dark:border-violet-800" 
        : "bg-background border-border"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-1 rounded-full p-1 shrink-0",
          quest.isMet ? "text-violet-600 bg-violet-100 dark:bg-violet-900/30" : "text-muted-foreground bg-muted"
        )}>
          {isClaimed ? (
            <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          ) : quest.isMet ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4 opacity-20" />
          )}
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className={cn(
            "text-sm font-bold leading-tight truncate",
            quest.isMet ? "text-foreground" : "text-muted-foreground"
          )}>
            {quest.label}
          </p>
          <p className="text-xs text-muted-foreground leading-tight line-clamp-2 pr-2">
            {quest.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
        {isClaimed ? (
          <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-none text-[10px] font-bold">
            CLAIMED
          </Badge>
        ) : canClaim ? (
          <Button 
            size="sm" 
            className="h-7 px-3 bg-orange-500 hover:bg-orange-600 text-[10px] font-bold uppercase tracking-tighter shadow-sm animate-pulse hover:animate-none"
            disabled={claimingId === quest.id}
            onClick={() => handleClaimXP(quest.id, quest.xp_reward)}
          >
            {claimingId === quest.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              `Claim +${quest.xp_reward} XP`
            )}
          </Button>
        ) : (
          <Badge variant="outline" className="text-[10px] font-mono opacity-50">
            +{quest.xp_reward} XP
          </Badge>
        )}
      </div>
    </div>
  );
}
