import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle2, Circle, Star, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tutor } from "@/lib/tutors/types";

interface MilestonesCardProps {
  tutor: Tutor;
}

export function MilestonesCard({ tutor }: MilestonesCardProps) {
  const { profile } = tutor;

  const milestones = [
    {
      label: "Complete Profile",
      isMet: !!profile.title && (profile.price || 0) > 0 && !!profile.imageSrc,
      description: "Fill in all basic details"
    },
    {
      label: "First Review",
      isMet: (profile.ratingCount || 0) > 0,
      description: "Receive 1 student review"
    },
    {
      label: "Star Tutor",
      isMet: (profile.rating || 0) >= 4.5 && (profile.ratingCount || 0) >= 3,
      description: "Maintain 4.5+ rating (min 3 reviews)"
    },
    {
      label: "Verified Badge",
      isMet: profile.verified,
      description: "Identity verification complete"
    }
  ];

  const completedCount = milestones.filter((m) => m.isMet).length;
  const progress = Math.round((completedCount / milestones.length) * 100);

  return (
    <Card className="col-span-full lg:col-span-1 border-violet-200 dark:border-violet-800/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Trophy className="w-24 h-24 text-orange-500" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Track your growth</CardDescription>
            </div>
            <Badge variant="outline" className="font-normal gap-1">
                <Target className="h-3 w-3" />
                Level {Math.floor(completedCount / 2) + 1}
            </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>Milestones</span>
            <span>{completedCount}/{milestones.length}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-orange-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {milestones.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={cn(
                  "mt-0.5 rounded-full p-0.5",
                  step.isMet ? "text-orange-500 bg-orange-100 dark:bg-orange-900/20" : "text-muted-foreground"
              )}>
                {step.isMet ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </div>
              <div className="space-y-0.5">
                <p className={cn(
                    "text-sm font-medium leading-none",
                    step.isMet ? "text-foreground" : "text-muted-foreground"
                )}>
                    {step.label}
                </p>
                <p className="text-xs text-muted-foreground">
                    {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-muted/50 border border-dashed border-border p-3 grid grid-cols-2 gap-4">
            <div className="text-center space-y-1">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Rating
                </div>
                <div className="text-xl font-bold flex items-center justify-center gap-1">
                    {profile.rating > 0 ? Number(profile.rating).toFixed(1) : "-"}
                    <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
                </div>
            </div>
            <div className="text-center space-y-1 border-l border-border/50">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Reviews
                </div>
                <div className="text-xl font-bold">
                    {profile.ratingCount || 0}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}