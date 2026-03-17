"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User2, Check, Star, Trophy, Info } from "lucide-react";
import type { TutorProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookingCard } from "@/components/tutors/booking-card";
import { cn } from "@/lib/utils";

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;

  return (
    <div className="pointer-events-none absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 z-10 scale-90 sm:scale-100 origin-bottom-right">
      <Badge
        className={cn(
          "rounded-full px-2.5 py-1 sm:px-3 shadow-sm",
          "border border-violet-200 bg-white/90 text-foreground",
          "dark:border-violet-500/30 dark:bg-neutral-950/60",
          "backdrop-blur"
        )}
      >
        <span className="mr-1 inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-violet-600 text-white dark:bg-violet-500">
          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={3} />
        </span>
        <span className="text-xs sm:text-sm">Verified</span>
      </Badge>
    </div>
  );
}

function Avatar({
  src,
  name,
  verified,
}: {
  src?: string | null;
  name: string;
  verified: boolean;
}) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div className="relative isolate h-28 w-28 shrink-0 overflow-visible sm:h-36 sm:w-36 lg:h-44 lg:w-44">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-violet-200/70 dark:bg-violet-500/20 ring-1 ring-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <User2 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/60" strokeWidth={1.5} />
        </div>

        {src && src.trim() !== "" && !error ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 176px"
            className="object-cover"
            priority={false}
            onError={() => setError(true)}
            unoptimized
          />
        ) : null}
      </div>

      <VerifiedBadge verified={verified} />
    </div>
  );
}

function ReturnRateBar({ value }: { value: number }) {
  const pct = value <= 1 ? Math.round(value * 100) : Math.round(value);

  return (
    <div className="mt-4 w-full max-w-55 sm:max-w-xs mx-auto sm:mx-0">
      <div className="flex items-baseline justify-between gap-3">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="group flex items-center gap-1.5 cursor-help">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  Return rate
                </div>
                <Info className="h-3 w-3 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-50 sm:max-w-50 text-xs text-center sm:text-left">
              Students who book again after a completed lesson.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="text-sm font-semibold text-foreground">
          {pct}
          <span className="text-muted-foreground">%</span>
        </div>
      </div>
      
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-violet-600/80 dark:bg-violet-500/40 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function ProfileHeader({ tutor }: { tutor: TutorProfile }) {
  const { header, stats, progression } = tutor;
  const fullName = `${header.firstname} ${header.lastname}`;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        header.is_verified && "ring-1 ring-violet-200/60 dark:ring-violet-500/20"
      )}
    >
      {header.is_verified && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-200/40 dark:bg-violet-500/15 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-100/60 dark:bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(124,58,237,0.10),transparent_60%)] dark:bg-[linear-gradient(to_bottom,rgba(124,58,237,0.08),transparent_60%)]" />
        </div>
      )}

      <CardContent className="relative p-5 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-8 flex-1 min-w-0 w-full">
            
            <Avatar
              src={header.image_url}
              name={fullName}
              verified={header.is_verified}
            />

            <div className="min-w-0 flex-1 w-full">
              {header.subtitle && (
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {header.subtitle}
                </div>
              )}

              <h1 className="mt-1 sm:mt-2 truncate text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                {fullName}
              </h1>

              {header.title && (
                <div className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none">
                  {header.title}
                </div>
              )}

              {stats.show_return_rate && (
                <ReturnRateBar value={stats.return_rate} />
              )}

              <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-2">
                <Badge 
                  className="rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-900"
                >
                  <Trophy className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Level {progression.level}
                </Badge>

                {stats.show_rating && (
                  <Badge
                    className="rounded-full border border-violet-200 bg-violet-50 text-foreground dark:border-violet-500/30 dark:bg-violet-500/15"
                    variant="outline"
                  >
                    <Star className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5 fill-orange-400 text-orange-400" />
                    {stats.rating_avg > 0 ? Number(stats.rating_avg).toFixed(1) : "New"}
                  </Badge>
                )}

                {header.badge_text && (
                  <Badge 
                    variant="outline" 
                    className="rounded-full bg-white/50 dark:bg-neutral-900/50"
                  >
                    {header.badge_text}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 shrink-0 border-t border-border/50 pt-6 lg:border-t-0 lg:pt-0">
            <BookingCard tutor={tutor} />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
