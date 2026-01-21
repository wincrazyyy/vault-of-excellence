// app/page.tsx
import { Hero } from "@/components/hero";
import { Search } from "@/components/search";
import { FeaturedTutors } from "@/components/featured-tutors";
import { Stats } from "@/components/stats";
import { Schools } from "@/components/schools";
import { TeacherCTA } from "@/components/teacher-cta";

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
          <FeaturedTutors />
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
