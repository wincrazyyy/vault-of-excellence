"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Suspense fallback={<CallbackSkeleton />}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";

      if (!code) {
        setStatus("error");
        setMessage("Invalid verification link. Please try logging in.");
        return;
      }

      const supabase = createClient();

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw error;
        }

        setStatus("success");
        setMessage("Email verified successfully! Redirecting...");

        setTimeout(() => {
          router.push(next);
          router.refresh();
        }, 2000);

      } catch (err: any) {
        console.error("Auth error:", err);
        setStatus("error");
        setMessage(err.message || "Failed to verify email. Link may have expired.");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <Card className={cn(
      "w-full max-w-md border shadow-lg transition-all duration-500",
      status === "success" ? "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10" :
      status === "error" ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10" :
      "border-violet-200 dark:border-violet-800/50"
    )}>
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm border">
          {status === "loading" && (
            <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          )}
          {status === "error" && (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
        </div>
        <CardTitle className="text-xl">
          {status === "loading" && "Verifying account"}
          {status === "success" && "Welcome aboard!"}
          {status === "error" && "Verification failed"}
        </CardTitle>
        <CardDescription className="text-base">
          {message}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4 pt-4">
        {status === "loading" && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/2 animate-[shimmer_1.5s_infinite] bg-violet-600 rounded-full" />
            </div>
        )}

        {status === "success" && (
             <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => router.push("/dashboard")}>
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
        )}

        {status === "error" && (
          <div className="flex flex-col gap-2">
            <Button variant="default" className="w-full" onClick={() => router.push("/auth/login")}>
              Back to Login
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CallbackSkeleton() {
    return (
        <Card className="w-full max-w-md border-violet-200 dark:border-violet-800/50">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="mx-auto h-6 w-32 bg-muted animate-pulse rounded mb-2" />
                <div className="mx-auto h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
                 <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </CardContent>
        </Card>
    )
}
