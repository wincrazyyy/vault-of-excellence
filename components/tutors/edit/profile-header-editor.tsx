"use client";

import { Tutor } from "@/lib/tutors/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Star, BarChart3 } from "lucide-react";

interface ProfileHeaderEditorProps {
  tutor: Tutor;
  updateTutor: (tutor: Tutor) => void;
}

export function ProfileHeaderEditor({ tutor, updateTutor }: ProfileHeaderEditorProps) {
  const handleChange = (field: keyof Tutor["profile"], value: any) => {
    updateTutor({
      ...tutor,
      profile: {
        ...tutor.profile,
        [field]: value,
      },
    });
  };

  const returnRatePercent = Math.round((tutor.profile.returnRate || 0) * 100);
  const formattedRating = Number(tutor.profile.rating || 0).toFixed(1);

  return (
    <Card className="border-violet-200 dark:border-violet-500/30">
      <CardHeader>
        <CardTitle className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <UserCircle className="h-4 w-4 text-violet-500" />
          Core Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={tutor.profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={tutor.profile.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={tutor.profile.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="badgeText">Featured Badge Text</Label>
              <Input
                id="badgeText"
                placeholder="e.g. 1,240 hours or Super Tutor"
                value={tutor.profile.badgeText || ""}
                onChange={(e) => handleChange("badgeText", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="image">Profile Image URL</Label>
              <Input
                id="image"
                placeholder="/images/tutor.jpg"
                value={tutor.profile.imageSrc || ""}
                onChange={(e) => handleChange("imageSrc", e.target.value)}
              />
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Visibility Settings
              </Label>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                    <Label className="cursor-pointer">Public Rating</Label>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 ml-1">
                      ({formattedRating})
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-muted-foreground">
                    Show your average star rating.
                  </p>
                </div>
                <Switch
                  checked={tutor.profile.showRating}
                  onCheckedChange={(checked) => handleChange("showRating", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-violet-500" />
                    <Label className="cursor-pointer">Return Rate</Label>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 ml-1">
                      ({returnRatePercent}%)
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-muted-foreground">
                    Display student retention percentage.
                  </p>
                </div>
                <Switch
                  checked={tutor.profile.showReturnRate}
                  onCheckedChange={(checked) => handleChange("showReturnRate", checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}