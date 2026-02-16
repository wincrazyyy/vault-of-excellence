import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, TrendingUp, ShieldCheck } from "lucide-react";
import { TutorProfile } from "@/lib/types";

interface PerformanceCardProps {
  tutor: TutorProfile;
}

export function PerformanceCard({ tutor }: PerformanceCardProps) {
  const { stats, header } = tutor;

  return (
    <Card className="border-violet-200 dark:border-violet-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Performance</CardTitle>
        <CardDescription>How students see you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-md text-yellow-600">
              <Star className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
                <span className="text-sm font-medium block leading-none">Rating</span>
                <span className="text-xs text-muted-foreground">Average student score</span>
            </div>
          </div>
          <span className="font-bold text-lg">
            {stats.rating_avg > 0 ? Number(stats.rating_avg).toFixed(1) : "-"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
                <span className="text-sm font-medium block leading-none">Return Rate</span>
                <span className="text-xs text-muted-foreground">Student retention</span>
            </div>
          </div>
          <span className="font-bold text-lg">
            {stats.return_rate > 0 ? `${stats.return_rate}%` : "-"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
                <span className="text-sm font-medium block leading-none">Verification</span>
                <span className="text-xs text-muted-foreground">Identity check</span>
            </div>
          </div>
          <span className={header.is_verified ? "font-bold text-green-600 dark:text-green-400" : "text-muted-foreground font-medium"}>
            {header.is_verified ? "Verified" : "Pending"}
          </span>
        </div>

      </CardContent>
    </Card>
  );
}
