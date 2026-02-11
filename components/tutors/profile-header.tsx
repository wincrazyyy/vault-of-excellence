"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User2, Check, Star } from "lucide-react";
import type { Tutor } from "@/lib/tutors/types";
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
  name,
  verified,
}: {
  src?: string;
  name: string;
  verified: boolean;
}) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div className="relative isolate h-40 w-40 shrink-0 overflow-visible sm:h-44 sm:w-44">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-violet-200/70 dark:bg-violet-500/20 ring-1 ring-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <User2 className="h-12 w-12 text-muted-foreground/60" strokeWidth={1.5} />
        </div>

        {src && src.trim() !== "" && !error ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes="176px"
            className="object-cover"
            priority={false}
            onError={() => setError(true)}
          />
        ) : null}
      </div>

      <VerifiedBadge verified={verified} />
    </div>
  );
}

function ReturnRateBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value));
  const pct = Math.round(clamped * 100);

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Return rate
        </div>
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
      <div className="mt-2 text-xs text-muted-foreground">
        Students who book again after a completed lesson.
      </div>
    </div>
  );
}

export function ProfileHeader({ tutor }: { tutor: Tutor }) {
  const { profile } = tutor;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        profile.verified && "ring-1 ring-violet-200/60 dark:ring-violet-500/20"
      )}
    >
      {profile.verified && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-200/40 dark:bg-violet-500/15 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-100/60 dark:bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(124,58,237,0.10),transparent_60%)] dark:bg-[linear-gradient(to_bottom,rgba(124,58,237,0.08),transparent_60%)]" />
        </div>
      )}

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <Avatar
            src={profile.imageSrc}
            name={profile.name}
            verified={profile.verified}
          />

          <div className="min-w-0 flex-1">
            {profile.subtitle && profile.subtitle.trim() !== "" && (
              <div className="text-sm font-medium text-muted-foreground">
                {profile.subtitle}
              </div>
            )}

            <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {profile.name}
            </h1>

            {profile.title && profile.title.trim() !== "" && (
              <div className="mt-2 text-base text-muted-foreground">
                {profile.title}
              </div>
            )}

            {profile.showReturnRate && (
              <ReturnRateBar value={profile.returnRate} />
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {profile.showRating && profile.rating !== undefined && (
                <Badge
                  className="rounded-full border border-violet-200 bg-violet-50 text-foreground dark:border-violet-500/30 dark:bg-violet-500/15"
                  variant="outline"
                >
                  <Star className="mr-1 h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  {Number(profile.rating).toFixed(1)}
                </Badge>
              )}

              {profile.badgeText && profile.badgeText.trim() !== "" && (
                <Badge 
                  variant="outline" 
                  className="rounded-full bg-white/50 dark:bg-neutral-900/50"
                >
                  {profile.badgeText}
                </Badge>
              )}
            </div>
          </div>

          <div className="lg:w-72">
            <BookingCard tutor={tutor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
