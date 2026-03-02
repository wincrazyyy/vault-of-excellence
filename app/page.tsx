import { Hero } from "@/components/main/hero";
import { Search } from "@/components/main/search";
import { FeaturedTutors } from "@/components/main/featured-tutors";
import { Stats } from "@/components/main/stats";
import { Schools } from "@/components/main/schools";
import { TeacherCTA } from "@/components/main/teacher-cta";
import Image from "next/image"; // Assuming you use next/image

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="w-full bg-violet-600 px-6 py-2 text-center text-sm text-white">
        🚀 Looking to become a tutor? Join our upcoming webinar! <a href="#" className="underline font-bold">Learn more</a>
      </div>
      <section className="relative z-20">
        <div className="relative mx-auto w-full max-w-5xl px-6 py-10 sm:py-12">
          <Hero />
          <div className="mt-7">
            <Search />
          </div>

          <div className="mt-12 relative w-full aspect-21/9 sm:aspect-3/1 overflow-hidden rounded-2xl shadow-sm border border-border">
            <Image 
              src="/banner-image.jpg" 
              alt="Promotional Banner" 
              fill 
              className="object-cover" 
            />
          </div>
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