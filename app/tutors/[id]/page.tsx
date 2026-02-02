import { ProfileHeader } from "@/components/tutors/profile-header";
import { About } from "@/components/tutors/about";
import { AcademicBackground } from "@/components/tutors/academic-background";
import { Teaching } from "@/components/tutors/teaching";
import { Stats } from "@/components/tutors/stats";
import { Reviews } from "@/components/tutors/reviews";
import { BookingCard } from "@/components/tutors/booking-card";
import { Tips } from "@/components/tutors/tips";
import type { Tutor, Review } from "@/components/tutors/types";

import { aboutSection, backgroundSection, tutor } from "./tutor-template";
import { SectionView } from "@/components/sections/section";

export default function TutorProfilePage() {
  const reviews: Review[] = [
    { name: "John Smith", text: "Explains concepts clearly and gives great practice questions." },
    { name: "Jane Doe", text: "Very patient and organised. Helped me improve my confidence." },
    { name: "Bob Builder", text: "Super nice and friendly, and guided me through my exams flawlessly."},
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <ProfileHeader tutor={tutor} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <SectionView section={aboutSection} />
            <SectionView section={backgroundSection} />
            {/* <About tutor={tutor} /> */}
            <AcademicBackground tutor={tutor} />
            <Teaching tutor={tutor} />
            <Stats tutor={tutor} />
            <Reviews tutor={tutor} reviews={reviews} />
          </div>

          <aside className="space-y-6">
            <BookingCard tutor={tutor} />
            <Tips />
          </aside>
        </div>
      </section>
    </main>
  );
}
