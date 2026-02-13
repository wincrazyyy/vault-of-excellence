import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import Image from "next/image";

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
  const isProfileComplete = 
    !!tutor.title && 
    (tutor.price || 0) > 0 && 
    (tutor.sections?.length || 0) > 0;

  return (
    <Card className="md:col-span-2 border-violet-200 dark:border-violet-800/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <User className="w-32 h-32 text-violet-500" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Profile Status</CardTitle>
        <CardDescription>Your visibility on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
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
            <p className="text-sm text-muted-foreground">
              {tutor.title || "No title set"}
            </p>
          </div>
          <div className="ml-auto">
            {isProfileComplete ? (
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            ) : (
              <Badge variant="secondary">Incomplete</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
              Price
            </div>
            <div className="text-lg font-semibold">
              {tutor.price > 0 ? `$${tutor.price}/hr` : "Not set"}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
              Sections
            </div>
            <div className="text-lg font-semibold">
              {tutor.sections?.length || 0} Modules
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}