"use client";

import { useState } from "react";
import { updateEngagementStatus } from "@/lib/actions/engagements";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";

// 1. ADD isExpired TO PROPS
export function EngagementActions({ 
  engagementId, 
  isExpired 
}: { 
  engagementId: string;
  isExpired?: boolean;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdate(status: 'active' | 'cancelled') {
    setIsUpdating(true);
    try {
      await updateEngagementStatus(engagementId, status);
      toast.success(status === 'active' ? "Request accepted!" : "Request declined.");
    } catch (error: any) {
      toast.error("Failed to update status", { description: error.message });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleUpdate('cancelled')}
        disabled={isUpdating}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 border-red-200 dark:border-red-900/50"
      >
        <X className="mr-1 h-4 w-4" />
        Decline
      </Button>

      {/* 2. DISABLE ACCEPT BUTTON IF EXPIRED */}
      <Button 
        size="sm" 
        onClick={() => handleUpdate('active')}
        disabled={isUpdating || isExpired}
        className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20 disabled:opacity-50 disabled:shadow-none"
        title={isExpired ? "This request's scheduled time has already passed." : ""}
      >
        {isUpdating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />}
        Accept
      </Button>
    </div>
  );
}