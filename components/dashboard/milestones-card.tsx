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
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, CheckCircle2, Circle, Star, Target, Sparkles, Loader2, Search, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorProfile } from "@/lib/types";
import { claimQuestAction } from "@/lib/actions/quest";
import { toast } from "sonner";
import { evaluateQuestRules } from "@/lib/quests/engine";

export interface DBQuest {
  id: string;
  label: string;
  description: string;
  xp_reward: number;
  requirements: any;
}

interface MilestonesCardProps {
  tutor: TutorProfile;
  dbQuests: DBQuest[];
}

export function MilestonesCard({ tutor, dbQuests }: MilestonesCardProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  
  const claimedIds = new Set(tutor.claimed_quests || []);

  const flatTutor: Record<string, any> = {
    title: tutor.header.title,
    hourly_rate: tutor.header.hourly_rate,
    tags: tutor.tags,
    image_url: tutor.header.image_url,
    subtitle: tutor.header.subtitle,
    badge_text: tutor.header.badge_text,
    sections: tutor.sections,
    is_verified: tutor.header.is_verified,
    rating_count: tutor.stats.rating_count,
    rating_avg: tutor.stats.rating_avg,
  };

  const evaluatedQuests = dbQuests.map((quest) => ({
    ...quest,
    isMet: evaluateQuestRules(quest.requirements?.rules || [], flatTutor)
  }));

  const claimedQuests = evaluatedQuests.filter(q => claimedIds.has(q.id));
  const availableQuests = evaluatedQuests.filter(q => !claimedIds.has(q.id));

  const previewQuests = availableQuests.length > 0 
    ? availableQuests.slice(0, 4) 
    : claimedQuests.slice(0, 4);

  const modalQuests = evaluatedQuests.filter(q => {
    const matchesSearch = 
      q.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;

    if (activeTab === "available") return !claimedIds.has(q.id);
    if (activeTab === "completed") return claimedIds.has(q.id);
    return true; // "all"
  });

  const { level, current_xp, next_level_xp } = tutor.progression;
  const targetXP = next_level_xp || 100; 
  const xpProgress = Math.min(Math.round((current_xp / targetXP) * 100), 100);

  const handleClaimXP = async (questId: string, xpAmount: number) => {
    setClaimingId(questId);
    try {
      const result = await claimQuestAction(questId);
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
    <Card className="col-span-full lg:col-span-1 border-violet-200 dark:border-violet-800/50 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Trophy className="w-24 h-24 text-violet-500" />
      </div>

      <CardHeader className="pb-2 shrink-0">
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

      <CardContent className="space-y-6 pt-4 flex-1 flex flex-col">
        <div className="space-y-2 shrink-0">
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

        <div className="grid gap-3 shrink-0">
          {previewQuests.map((quest) => (
            <QuestRow 
              key={quest.id}
              quest={quest}
              isClaimed={claimedIds.has(quest.id)}
              claimingId={claimingId}
              handleClaimXP={handleClaimXP}
            />
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full border-dashed border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 shrink-0">
              <ListTodo className="mr-2 h-4 w-4" />
              Open Quest Log ({availableQuests.length} Available)
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-violet-200 dark:border-violet-800">
            <DialogHeader className="p-6 pb-4 border-b shrink-0">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-5 w-5 text-violet-500" />
                Master Quest Log
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 pt-4 space-y-4 shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search quests..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="available">Available ({availableQuests.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({claimedQuests.length})</TabsTrigger>
                  <TabsTrigger value="all">All Quests ({evaluatedQuests.length})</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <TabsContent value={activeTab} className="m-0 space-y-3">
                  {modalQuests.length > 0 ? (
                    modalQuests.map(quest => (
                      <QuestRow 
                        key={quest.id}
                        quest={quest}
                        isClaimed={claimedIds.has(quest.id)}
                        claimingId={claimingId}
                        handleClaimXP={handleClaimXP}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <ListTodo className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p>No quests found.</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>

        <div className="mt-auto pt-6 shrink-0">
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
        </div>
      </CardContent>
    </Card>
  );
}

function QuestRow({ 
  quest, 
  isClaimed, 
  claimingId, 
  handleClaimXP 
}: { 
  quest: DBQuest & { isMet: boolean };
  isClaimed: boolean;
  claimingId: string | null;
  handleClaimXP: (id: string, xp: number) => void;
}) {
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
