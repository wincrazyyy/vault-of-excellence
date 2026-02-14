import { Suspense } from "react";

import { Hero } from "@/components/main/hero";
import { Search } from "@/components/main/search";
import { FeaturedTutors } from "@/components/main/featured-tutors";
import { FeaturedTutorsSkeleton } from "@/components/main/featured-tutors-skeleton";
import { Stats } from "@/components/main/stats";
import { Schools } from "@/components/main/schools";
import { TeacherCTA } from "@/components/main/teacher-cta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="relative mx-auto w-full max-w-5xl px-6 py-10 sm:py-12">
          <Hero />
          <div className="mt-7">
            <Search />
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="border-t border-neutral-200 pt-10">
          <Suspense fallback={<FeaturedTutorsSkeleton />}>
            <FeaturedTutors />
          </Suspense>
        </div>

        <Stats />

        <Schools />

        <div className="mt-10">
          <TeacherCTA />
        </div>
      </section>
    </main>
  );
}
