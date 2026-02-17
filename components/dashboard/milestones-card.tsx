"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle2, Circle, Star, Target, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorProfile } from "@/lib/types";
import { claimQuestAction } from "@/lib/actions/quest";
import { toast } from "sonner";

interface MilestonesCardProps {
  tutor: TutorProfile;
}

export function MilestonesCard({ tutor }: MilestonesCardProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const claimedIds = new Set(tutor.claimed_quests || []);

  const quests = [
    {
      id: "profile_completion",
      label: "Profile Architect",
      isMet: !!tutor.header.title && (tutor.header.hourly_rate || 0) > 0 && !!tutor.header.image_url,
      description: "Fill in all basic details",
      xpReward: 100,
    },
    {
      id: "first_review",
      label: "First Impression",
      isMet: (tutor.stats.rating_count || 0) > 0,
      description: "Receive your first student review",
      xpReward: 250,
    },
    {
      id: "star_tutor",
      label: "Elite Educator",
      isMet: (tutor.stats.rating_avg || 0) >= 4.5 && (tutor.stats.rating_count || 0) >= 3,
      description: "Maintain 4.5+ rating (min 3 reviews)",
      xpReward: 500,
    },
    {
      id: "verification",
      label: "Trusted Mentor",
      isMet: tutor.header.is_verified,
      description: "Identity verification complete",
      xpReward: 300,
    }
  ];

  const { level, current_xp, next_level_xp } = tutor.progression;

  const targetXP = next_level_xp || 100; 
  const xpProgress = Math.min(Math.round((current_xp / targetXP) * 100), 100);

  const handleClaimXP = async (questId: string, xpAmount: number) => {
    setClaimingId(questId);
    
    try {
      const result = await claimQuestAction(questId, xpAmount);
      
      if (result.success) {
        toast.success(`Quest Complete! +${xpAmount} XP added.`);
      } else {
        toast.error(result.message || "Failed to claim XP. Try again.");
      }
    } catch (error) {
      toast.error("A technical error occurred.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <Card className="col-span-full lg:col-span-1 border-violet-200 dark:border-violet-800/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Trophy className="w-24 h-24 text-violet-500" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Tutor Quests
              <Sparkles className="h-4 w-4 text-orange-500 fill-orange-500" />
            </CardTitle>
            <CardDescription>Complete tasks to level up</CardDescription>
          </div>

          <Badge className={cn(
            "px-3 py-1 gap-1.5 transition-colors",
            level === 0 
              ? "bg-muted text-muted-foreground hover:bg-muted" 
              : "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
          )}>
            <Target className="h-3 w-3" />
            {level === 0 ? "Unranked" : `Lvl ${level}`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>To Level {level + 1}</span>
            <span>{current_xp} / {targetXP} XP</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted border border-border">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out bg-linear-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3">
          {quests.map((quest) => {
            const isClaimed = claimedIds.has(quest.id);
            const canClaim = quest.isMet && !isClaimed;

            return (
              <div 
                key={quest.id} 
                className={cn(
                  "group flex items-center justify-between p-3 rounded-xl border transition-all",
                  quest.isMet 
                    ? "bg-violet-50/50 border-violet-200 dark:bg-violet-900/10 dark:border-violet-800" 
                    : "bg-background border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-1 rounded-full p-1",
                    quest.isMet ? "text-violet-600 bg-violet-100 dark:bg-violet-900/30" : "text-muted-foreground bg-muted"
                  )}>
                    {isClaimed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : quest.isMet ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4 opacity-20" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-sm font-bold leading-tight",
                      quest.isMet ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {quest.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {isClaimed ? (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none text-[10px] font-bold">
                      CLAIMED
                    </Badge>
                  ) : canClaim ? (
                    <Button 
                      size="sm" 
                      className="h-7 px-3 bg-orange-500 hover:bg-orange-600 text-[10px] font-bold uppercase tracking-tighter shadow-sm animate-pulse hover:animate-none"
                      disabled={claimingId === quest.id}
                      onClick={() => handleClaimXP(quest.id, quest.xpReward)}
                    >
                      {claimingId === quest.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        `Claim +${quest.xpReward} XP`
                      )}
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-mono opacity-50">
                      +{quest.xpReward} XP
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-muted/30 border border-border p-3 flex justify-around">
            <div className="text-center">
                <p className="text-[9px] text-muted-foreground font-bold uppercase">Avg Rating</p>
                <p className="text-sm font-bold flex items-center justify-center gap-1">
                    {tutor.stats.rating_avg > 0 ? Number(tutor.stats.rating_avg).toFixed(1) : "-"}
                    <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                </p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
                <p className="text-[9px] text-muted-foreground font-bold uppercase">Reviews</p>
                <p className="text-sm font-bold">{tutor.stats.rating_count || 0}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
