import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, TrendingUp, ShieldCheck } from "lucide-react";

interface PerformanceTutorData {
  rating: number;
  return_rate: number;
  verified: boolean;
}

interface PerformanceCardProps {
  tutor: PerformanceTutorData;
}

export function PerformanceCard({ tutor }: PerformanceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Performance</CardTitle>
        <CardDescription>How students see you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-md text-yellow-600">
              <Star className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Rating</span>
          </div>
          <span className="font-bold">{tutor.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Return Rate</span>
          </div>
          <span className="font-bold">{tutor.return_rate}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Verified</span>
          </div>
          <span className="font-bold">{tutor.verified ? "Yes" : "No"}</span>
        </div>
      </CardContent>
    </Card>
  );
}