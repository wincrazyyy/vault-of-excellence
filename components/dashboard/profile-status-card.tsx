import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tutor } from "@/lib/tutors/types";

interface ProfileStatusCardProps {
  tutor: Tutor;
}

export function ProfileStatusCard({ tutor }: ProfileStatusCardProps) {
  const { profile, sections } = tutor;

  const milestones = [
    { 
      label: "Set profile title", 
      isMet: !!profile.title && profile.title.length > 3 
    },
    { 
      label: "Set hourly price", 
      isMet: (profile.price || 0) > 0 
    },
    { 
      label: "Add content sections", 
      isMet: (sections?.length || 0) > 0 
    },
    { 
      label: "Upload profile photo", 
      isMet: !!profile.imageSrc 
    },
  ];

  const completedCount = milestones.filter((m) => m.isMet).length;
  const progress = Math.round((completedCount / milestones.length) * 100);
  const isComplete = progress === 100;

  return (
    <Card className="md:col-span-2 border-violet-200 dark:border-violet-800/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <User className="w-32 h-32 text-violet-500" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-lg">Profile Status</CardTitle>
                <CardDescription>Complete these steps to become visible</CardDescription>
            </div>
            <Badge 
                variant={isComplete ? "default" : "secondary"}
                className={cn(
                    isComplete 
                    ? "bg-violet-600 hover:bg-violet-700" 
                    : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
            >
                {isComplete ? "Active" : "Draft"}
            </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4 min-w-50">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300 font-bold text-2xl overflow-hidden border border-violet-200 dark:border-violet-800">
              {profile.imageSrc ? (
                <Image 
                  src={profile.imageSrc} 
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <span>{profile.name?.[0] || "T"}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-37.5">
                {profile.title || "No title set"}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Completion Strength
                    </span>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                        {progress}%
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full transition-all duration-500 ease-out bg-violet-600"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {milestones.map((step, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "flex items-center gap-2 text-sm",
                            step.isMet ? "text-muted-foreground" : "text-foreground font-medium"
                        )}
                    >
                        {step.isMet ? (
                            <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0" />
                        ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={step.isMet ? "line-through decoration-slate-300 dark:decoration-slate-700" : ""}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
            
            {!isComplete && (
                <div className="flex items-start gap-2 rounded-md bg-violet-50 dark:bg-violet-900/20 p-2 text-xs text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-800/50">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>Your profile will not be visible to students until all steps are completed.</p>
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
