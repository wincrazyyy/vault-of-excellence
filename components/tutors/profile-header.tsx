"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Star, Trophy } from "lucide-react";
import type { TutorProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCard } from "./booking-card";
import { cn } from "@/lib/utils";

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;

  return (
    <div className="pointer-events-none absolute -bottom-3 -right-3 z-10">
      <Badge
        className={cn(
          "rounded-full px-3 py-1 shadow-sm",
          "border border-violet-200 bg-white/90 text-foreground",
          "dark:border-violet-500/30 dark:bg-neutral-950/60",
          "backdrop-blur"
        )}
      >
        <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white dark:bg-violet-500">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        Verified
      </Badge>
    </div>
  );
}

function Avatar({
  src,
  firstname,
  lastname,
  verified,
}: {
  src?: string | null;
  firstname: string;
  lastname: string;
  verified: boolean;
}) {
  const [error, setError] = useState(false);
  const initials = `${firstname[0]}${lastname[0]}`;

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div className="relative isolate h-40 w-40 shrink-0 overflow-visible sm:h-44 sm:w-44">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-violet-200/70 dark:bg-violet-500/20 ring-1 ring-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-violet-700/40 dark:text-violet-300/30 select-none">
            {initials}
          </span>
        </div>

        {src && src.trim() !== "" && !error ? (
          <Image
            src={src}
            alt={`${firstname} ${lastname}`}
            fill
            sizes="176px"
            className="object-cover"
            priority
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
  const pct = Math.round(value);

  return (
    <div className="mt-4 max-w-xs">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Return rate
        </div>
        <div className="text-sm font-bold text-foreground">
          {pct}
          <span className="text-muted-foreground ml-0.5">%</span>
        </div>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full bg-violet-600 dark:bg-violet-500 transition-[width] duration-500 ease-in-out"
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
        "relative overflow-hidden border-none shadow-none bg-transparent",
        header.is_verified && "ring-0" 
      )}
    >
      {header.is_verified && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-200/30 dark:bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-100/40 dark:bg-violet-500/5 blur-3xl" />
        </div>
      )}

      <CardContent className="relative p-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          
          <Avatar
            src={header.image_url}
            firstname={header.firstname}
            lastname={header.lastname}
            verified={header.is_verified}
          />

          <div className="min-w-0 flex-1 pt-2">
            <div className="flex flex-wrap items-center gap-3">
               {/* Level Badge */}
               <Badge className="bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-900 gap-1.5 px-3 py-1">
                 <Trophy className="h-3 w-3" />
                 Level {progression.level}
               </Badge>

               {header.subtitle && (
                <span className="text-sm font-medium text-muted-foreground/80">
                  {header.subtitle}
                </span>
               )}
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {fullName}
            </h1>

            {header.title && (
              <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                {header.title}
              </p>
            )}

            {stats.show_return_rate && (
              <ReturnRateBar value={stats.return_rate} />
            )}

            <div className="mt-6 flex flex-wrap gap-2.5">
              {stats.show_rating && (
                <Badge
                  className="rounded-full border border-violet-200 bg-violet-50/50 px-4 py-1.5 text-sm font-semibold text-foreground dark:border-violet-500/30 dark:bg-violet-500/10"
                  variant="outline"
                >
                  <Star className="mr-1.5 h-4 w-4 fill-orange-400 text-orange-400" />
                  {stats.rating_avg > 0 ? Number(stats.rating_avg).toFixed(1) : "New"}
                  {stats.rating_count > 0 && (
                    <span className="ml-1.5 text-muted-foreground font-normal">
                      ({stats.rating_count} reviews)
                    </span>
                  )}
                </Badge>
              )}

              {header.badge_text && (
                <Badge 
                  variant="outline" 
                  className="rounded-full px-4 py-1.5 bg-white/50 dark:bg-neutral-900/50 border-dashed"
                >
                  {header.badge_text}
                </Badge>
              )}
            </div>
          </div>

          <div className="lg:w-80 lg:shrink-0">
            <BookingCard tutor={tutor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
