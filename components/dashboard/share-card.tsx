"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Copy, Check, Share2 } from "lucide-react";
import Link from "next/link";

export function ShareCard({ tutorId }: { tutorId: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = `${origin}/tutors/${tutorId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Card className="bg-muted/30 border-dashed border-violet-200 dark:border-violet-800/50">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-background p-3 rounded-full mb-4 shadow-sm border border-violet-100 dark:border-violet-900">
          <Share2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        
        <h3 className="font-semibold text-base mb-1">Share your profile</h3>
        
        <p className="text-xs text-muted-foreground max-w-60 mb-6">
          Copy your public link to send to students or post on social media.
        </p>
        
        <div className="flex flex-col gap-2 w-full">
          <div className="w-full px-3 py-2 rounded-md bg-background border text-[10px] font-mono text-muted-foreground truncate text-left select-all">
            {origin ? shareUrl : "https://..."}
          </div>
          
          <div className="flex gap-2 w-full">
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1 h-9"
              onClick={handleCopy}
              disabled={!origin}
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-2 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Copy Link
                </>
              )}
            </Button>

            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" asChild>
              <Link href={`/tutors/${tutorId}`} target="_blank">
                 <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
