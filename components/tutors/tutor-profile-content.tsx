import { TutorProfile } from "@/lib/types";
import { ProfileHeader } from "@/components/tutors/profile-header";
import { TutorTags } from "@/components/tutors/tutor-tags";
import { Reviews } from "@/components/tutors/reviews";
import { SectionView } from "@/components/tutors/sections/section";

export function TutorProfileContent({ tutor }: { tutor: TutorProfile }) {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <ProfileHeader tutor={tutor} />

        <TutorTags tags={tutor.tags} />

        <div className="mt-10 flex flex-col gap-12">
          <div className="space-y-10">
            {tutor.sections.length > 0 ? (
              tutor.sections.map((section) => (
                <SectionView key={section.id} section={section} />
              ))
            ) : (
              <p className="text-muted-foreground italic text-center py-10 border rounded-xl border-dashed">
                This tutor hasn't added any profile sections yet.
              </p>
            )}
          </div>

          <hr className="border-border" />

          <Reviews tutor={tutor} reviews={tutor.reviews} />
        </div>
      </section>
    </main>
  );
}