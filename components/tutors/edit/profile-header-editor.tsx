"use client";

import { TutorProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Star, BarChart3, DollarSign, BadgeCheck } from "lucide-react";

import { ImageUploadEditor } from "@/components/tutors/edit/image-upload-editor";
import { cn } from "@/lib/utils";

interface ProfileHeaderEditorProps {
  tutor: TutorProfile;
  updateTutor: (tutor: TutorProfile) => void;
}

export function ProfileHeaderEditor({ tutor, updateTutor }: ProfileHeaderEditorProps) {
  const handleNestedChange = (
    group: "header" | "stats",
    field: string,
    value: any
  ) => {
    updateTutor({
      ...tutor,
      [group]: {
        ...tutor[group],
        [field]: value,
      },
    });
  };

  const returnRatePercent = Math.round(tutor.stats.return_rate || 0);
  const formattedRating = Number(tutor.stats.rating_avg || 0).toFixed(1);

  return (
    <Card className="border-violet-200 dark:border-violet-500/30">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <UserCircle className="h-4 w-4 text-violet-500" />
          Core Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  value={tutor.header.firstname}
                  onChange={(e) => handleNestedChange("header", "firstname", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  value={tutor.header.lastname}
                  onChange={(e) => handleNestedChange("header", "lastname", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Math Tutor"
                value={tutor.header.title || ""}
                onChange={(e) => handleNestedChange("header", "title", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hourly_rate">Hourly Rate (HKD)</Label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                </div>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  className="pl-9" 
                  placeholder="0"
                  value={tutor.header.hourly_rate || ""}
                  onChange={(e) => handleNestedChange("header", "hourly_rate", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle / Catchphrase</Label>
              <Input
                id="subtitle"
                placeholder="e.g. Specialized in Calculus & Algebra"
                value={tutor.header.subtitle || ""}
                onChange={(e) => handleNestedChange("header", "subtitle", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="badge_text">Featured Badge Text</Label>
              <Input
                id="badge_text"
                placeholder="e.g. 1,240 hours taught"
                value={tutor.header.badge_text || ""}
                onChange={(e) => handleNestedChange("header", "badge_text", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <ImageUploadEditor 
                currentImage={tutor.header.image_url}
                aspectRatio={1}
                lockAspectRatio={true}
                onImageUploaded={(url) => handleNestedChange("header", "image_url", url)}
              />
            </div>

            <hr className="my-4 border-dashed border-border" />

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Visibility Settings
              </Label>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                    <Label className="cursor-pointer text-sm">Public Rating</Label>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 ml-1">
                      ({formattedRating})
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-muted-foreground leading-tight">
                    Show your average star rating to students.
                  </p>
                </div>
                <Switch
                  checked={tutor.stats.show_rating}
                  onCheckedChange={(checked) => handleNestedChange("stats", "show_rating", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-violet-500" />
                    <Label className="cursor-pointer text-sm">Return Rate</Label>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 ml-1">
                      ({returnRatePercent}%)
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-muted-foreground leading-tight">
                    Display student retention percentage.
                  </p>
                </div>
                <Switch
                  checked={tutor.stats.show_return_rate}
                  onCheckedChange={(checked) => handleNestedChange("stats", "show_return_rate", checked)}
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-violet-200 dark:border-violet-800 bg-violet-50/20">
                <BadgeCheck className={cn(
                  "h-5 w-5",
                  tutor.header.is_verified ? "text-violet-600" : "text-muted-foreground/40"
                )} />
                <div className="text-xs">
                  <p className="font-bold text-foreground">
                    {tutor.header.is_verified ? "Account Verified" : "Not Verified"}
                  </p>
                  <p className="text-muted-foreground">
                    Verification is managed by administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
