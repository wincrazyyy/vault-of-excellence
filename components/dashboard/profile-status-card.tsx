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

export interface DashboardTutor {
  id: string;
  name: string;
  title: string | null;
  price: number;
  sections: any[] | null;
  rating: number;
  return_rate: number;
  verified: boolean;
  image_src: string | null;
}

interface ProfileStatusCardProps {
  tutor: DashboardTutor;
}

export function ProfileStatusCard({ tutor }: ProfileStatusCardProps) {
  const milestones = [
    { 
      label: "Set profile title", 
      isMet: !!tutor.title && tutor.title.length > 3 
    },
    { 
      label: "Set hourly price", 
      isMet: (tutor.price || 0) > 0 
    },
    { 
      label: "Add content sections", 
      isMet: (tutor.sections?.length || 0) > 0 
    },
    { 
      label: "Upload profile photo", 
      isMet: !!tutor.image_src 
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
                    ? "bg-green-500 hover:bg-green-600" 
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
              {tutor.image_src ? (
                <Image 
                  src={tutor.image_src} 
                  alt={tutor.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <span>{tutor.name?.[0] || "T"}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{tutor.name}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                {tutor.title || "No title set"}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Completion Strength
                    </span>
                    <span className={cn(
                        "text-sm font-bold",
                        progress === 100 ? "text-green-600 dark:text-green-400" : "text-violet-600 dark:text-violet-400"
                    )}>
                        {progress}%
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out",
                            progress === 100 ? "bg-green-500" : "bg-violet-600"
                        )}
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
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
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
                <div className="flex items-start gap-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-2 text-xs text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-900/50">
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