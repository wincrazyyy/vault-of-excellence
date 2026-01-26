import Image from "next/image";
import type { Tutor } from "../../app/tutors/[id]/page";

function DefaultAvatarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-12 w-12 text-[#050B1E]/70"
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

function VerifiedCornerBadge({ verified }: { verified: boolean }) {
  return (
    <div
      className={[
        "absolute -bottom-3.5 -right-3.5",
        "overflow-hidden rounded-full",
        "inline-flex h-11 items-center gap-2.5 px-4",
        "text-sm font-semibold tracking-tight",
        "border border-violet-200 bg-white/90 text-[#050B1E] shadow-sm backdrop-blur",
        "ring-1 ring-violet-200/90",
        verified ? "" : "invisible",
      ].join(" ")}
      aria-label={verified ? "Verified tutor" : undefined}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 top-0 h-full w-16 -skew-x-12 bg-white/70 blur-[0.5px] opacity-70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/85"
      />
      <span
        aria-hidden="true"
        className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#050B1E] text-white"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path
            d="M16.667 5.833 8.333 14.167 3.333 9.167"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="relative leading-none">Verified</span>
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
    <div className="relative h-52 w-52 shrink-0 overflow-visible">
      <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-violet-200 ring-1 ring-[#050B1E]/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <DefaultAvatarIcon />
        </div>

        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes="208px"
            className="object-cover"
            priority={false}
          />
        ) : null}
      </div>

      <VerifiedCornerBadge verified={verified} />
    </div>
  );
}

function ReturnRateCard({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value));
  const pct = Math.round(clamped * 100);

  return (
    <div
      className={[
        "rounded-3xl border border-neutral-200 bg-white/70 p-6 backdrop-blur",
        "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
        "ring-1 ring-neutral-200/60",
        "text-center",
      ].join(" ")}
    >
      <div className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
        Return rate
      </div>

      <div className="mt-3 flex flex-col items-center justify-center gap-1">
        <div className="text-3xl font-semibold tracking-tight text-[#050B1E]">
          {pct}%
        </div>
        <div className="text-xs text-neutral-500">students return</div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-violet-200 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 text-xs leading-relaxed text-neutral-500">
        Based on completed lessons on the platform.
      </div>
    </div>
  );
}


export function ProfileHeader({ tutor }: { tutor: Tutor }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[28px] bg-white p-10 shadow-sm",
        tutor.verified
          ? "border border-violet-200/70 ring-1 ring-violet-200/50"
          : "border border-neutral-200",
      ].join(" ")}
    >
      {tutor.verified && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-100/55 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(124,58,237,0.07),transparent_58%)]" />

          <div className="absolute inset-0 rounded-[28px] ring-1 ring-violet-200/45" />
          <div className="absolute -inset-1 rounded-[30px] bg-violet-200/10 blur-xl" />
        </div>
      )}

      <div className="relative flex items-center gap-10">
        <Avatar src={tutor.imageSrc} name={tutor.name} verified={tutor.verified} />

        <div className="min-w-0 min-h-52 flex flex-col justify-center">
          <div className="text-sm font-medium text-neutral-600">
            {tutor.subtitle}
          </div>

          <h1 className="mt-2 truncate text-4xl font-semibold tracking-tight text-[#050B1E]">
            {tutor.name}
          </h1>

          <div className="mt-2 text-base text-neutral-600">{tutor.title}</div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-[#050B1E]">
              <span aria-hidden="true">★</span> {tutor.rating}
            </span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700">
              {tutor.hours}
            </span>
          </div>
        </div>

        <div className="lg:w-72">
          <ReturnRateCard value={tutor.returnRate} />
        </div>
      </div>
    </div>
  );
}
