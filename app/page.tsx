import { AnnouncementBanner } from "@/components/main/announcement-banner";
import { Hero } from "@/components/main/hero";
import { Search } from "@/components/main/search";
import { PromoBanner } from "@/components/main/promo-banner";
import { FeaturedTutors } from "@/components/main/featured-tutors";
import { Stats } from "@/components/main/stats";
import { Schools } from "@/components/main/schools";
import { TeacherCTA } from "@/components/main/teacher-cta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBanner />
      
      <section className="relative z-20">
        <div className="relative mx-auto w-full max-w-5xl px-6 py-10 sm:py-12">
          <Hero />
          <div className="mt-7">
            <Search />
          </div>

          <PromoBanner />
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 py-10">
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