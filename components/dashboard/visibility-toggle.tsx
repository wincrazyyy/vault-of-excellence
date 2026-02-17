"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function VisibilityToggle({ tutorId, initialStatus }: { tutorId: string, initialStatus: boolean }) {
  const supabase = createClient();
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleVisibility = async (checked: boolean) => {
    setLoading(true);
    const { error } = await supabase
      .from("tutors")
      .update({ is_public: checked })
      .eq("id", tutorId);

    if (error) {
      toast.error("Failed to update visibility");
      setIsPublic(!checked);
    } else {
      setIsPublic(checked);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border">
      <Switch 
        id="public-toggle" 
        checked={isPublic} 
        onCheckedChange={toggleVisibility}
        disabled={loading}
      />
      <Label htmlFor="public-toggle" className="text-xs font-medium cursor-pointer">
        {isPublic ? "Public" : "Private"}
      </Label>
    </div>
  );
}