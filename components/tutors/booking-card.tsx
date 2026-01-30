import type { Tutor } from "@/components/tutors/types";
import { InfoCard } from "./info-card";

function availabilityToMarkdown(availability: string[]) {
  return availability.map((a) => `- **${a}**`).join("\n");
}

export function BookingCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
      <div className="text-xs text-neutral-500">From</div>
      <div className="mt-1 text-2xl font-semibold text-[#050B1E]">
        HKD ${tutor.booking.price} <span className="text-sm font-medium">/ hour</span>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          className="h-12 rounded-2xl bg-[#050B1E] text-sm font-medium text-white hover:bg-[#07102D]"
        >
          Request a lesson
        </button>
        <button
          type="button"
          className="h-12 rounded-2xl border border-violet-200 bg-violet-50 text-sm font-medium text-[#050B1E] hover:bg-violet-100"
        >
          Send a message
        </button>
      </div>

      <div className="mt-6">
        <InfoCard
          title="Availability"
          description={availabilityToMarkdown(tutor.booking.availability)}
          markdown
          className="p-4"
        />
      </div>
    </div>
  );
}
