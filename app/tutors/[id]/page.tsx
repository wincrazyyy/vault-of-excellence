import { Suspense } from "react";
import { ProfileHeader } from "@/components/tutors/profile-header";
import { Reviews } from "@/components/tutors/reviews";

import { tutor } from "./tutor-template";
import { SectionView } from "@/components/sections/section";

export default function TutorProfilePage() {
  return (
    <Suspense fallback={<div>Loading Tutor Page...</div>}>
      <TutorProfileContent />
    </Suspense>
  );
}

function TutorProfileContent() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <ProfileHeader tutor={tutor} />

        <div className="mt-6">
          <div className="space-y-6">
            {tutor.sections.map((section) => (
              <SectionView key={section.id} section={section} />
            ))}
            <Reviews tutor={tutor} reviews={tutor.reviews.items} />
          </div>
        </div>
      </section>
    </main>
  );
}
