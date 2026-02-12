"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Copy, Check } from "lucide-react";
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
    <Card className="md:col-span-3 bg-muted/50 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="bg-background p-3 rounded-full mb-4 shadow-sm">
          <ExternalLink className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <h3 className="font-semibold text-lg mb-2">Share your profile</h3>
        
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Your public profile is ready to share. Copy the link below to send to students or post on social media.
        </p>
        
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="flex-1 block p-2 rounded bg-background border text-xs text-muted-foreground truncate text-left">
            {origin ? shareUrl : "Loading..."}
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCopy}
            disabled={!origin}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href={`/tutors/${tutorId}`} target="_blank">
               <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}