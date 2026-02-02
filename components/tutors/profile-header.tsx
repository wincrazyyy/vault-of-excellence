import Image from "next/image";
import type { Tutor } from "@/components/tutors/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function DefaultAvatarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-12 w-12 text-muted-foreground"
      aria-hidden="true"
    >
      <path
        d="M12 12.25c2.5 0 4.5-2.06 4.5-4.6S14.5 3.05 12 3.05 7.5 5.1 7.5 7.65s2 4.6 4.5 4.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 20.95c1.5-3.5 4.2-5.2 7.5-5.2s6 1.7 7.5 5.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;

  return (
    <div
      className={[
        "pointer-events-none",
        "absolute -bottom-3 -right-3 z-10",
      ].join(" ")}
    >
      <Badge
        className={[
          "rounded-full px-3 py-1 shadow-sm",
          "border border-violet-200 bg-white/90 text-foreground",
          "dark:border-violet-500/30 dark:bg-neutral-950/60",
          "backdrop-blur",
          "opacity-100",
        ].join(" ")}
      >
        <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white dark:bg-violet-500">
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <path
              d="M16.667 5.833 8.333 14.167 3.333 9.167"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
  return (
    <div className="relative isolate h-40 w-40 shrink-0 overflow-visible sm:h-44 sm:w-44">
      <div
        className={[
          "relative h-full w-full overflow-hidden rounded-xl",
          "border border-border bg-violet-200/70 dark:bg-violet-500/20",
          "ring-1 ring-border",
        ].join(" ")}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <DefaultAvatarIcon />
        </div>

        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes="176px"
            className="object-cover"
            priority={false}
          />
        ) : null}
      </div>

      <VerifiedBadge verified={verified} />
    </div>
  );
}

function ReturnRateCard({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value));
  const pct = Math.round(clamped * 100);

  return (
    <Card>
      <CardContent className="p-5 text-center">
        <div className="text-xs font-medium text-muted-foreground">Return rate</div>

        <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {pct}%
        </div>
        <div className="mt-1 text-xs text-muted-foreground">students return</div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-violet-200 dark:bg-violet-500/30 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Based on completed lessons on the platform.
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileHeader({ tutor }: { tutor: Tutor }) {
  return (
    <Card
      className={[
        "relative overflow-hidden",
        tutor.verified ? "ring-1 ring-violet-200/60 dark:ring-violet-500/20" : "",
      ].join(" ")}
    >
      {tutor.verified ? (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-200/40 dark:bg-violet-500/15 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-100/60 dark:bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(124,58,237,0.10),transparent_60%)] dark:bg-[linear-gradient(to_bottom,rgba(124,58,237,0.08),transparent_60%)]" />
        </div>
      ) : null}

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <Avatar src={tutor.imageSrc} name={tutor.name} verified={tutor.verified} />

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-muted-foreground">{tutor.subtitle}</div>

            <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {tutor.name}
            </h1>

            <div className="mt-2 text-base text-muted-foreground">{tutor.title}</div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge
                className="rounded-full border border-violet-200 bg-violet-50 text-foreground dark:border-violet-500/30 dark:bg-violet-500/15"
                variant="outline"
              >
                <span aria-hidden="true" className="mr-1">
                  ★
                </span>
                {tutor.rating}
              </Badge>

              <Badge variant="outline" className="rounded-full">
                {tutor.hours}
              </Badge>
            </div>
          </div>

          <div className="lg:w-72">
            <ReturnRateCard value={tutor.returnRate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
