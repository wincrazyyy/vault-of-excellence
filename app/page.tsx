// app/page.tsx
import { Hero } from "@/components/hero";
import { Search } from "@/components/search";

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
    </main>
  );
}
