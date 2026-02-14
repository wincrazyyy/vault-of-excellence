import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";

export async function FeaturedTutors() {
  const supabase = await createClient();

  const { data: tutors } = await supabase
    .from("tutors")
    .select("*")
    .order("rating", { ascending: false });

  if (!tutors || tutors.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        No tutors available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Featured Tutors</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Expert mentors ready to help you excel.
          </p>
        </div>

        <Button variant="link" asChild className="hidden sm:flex">
          <Link href="/tutors">View all</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tutor) => (
          <Card key={tutor.id} className="overflow-hidden transition-all hover:shadow-md border-violet-200/50 dark:border-violet-800/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {tutor.image_src ? (
                    <Image 
                      src={tutor.image_src} 
                      alt={tutor.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">
                      <span className="font-semibold text-lg">{tutor.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-foreground">
                    {tutor.name}
                  </div>
                  <div className="truncate text-sm text-muted-foreground">
                    {tutor.title || "Tutor"}
                  </div>
                </div>
              </div>

              <p className="mt-4 line-clamp-2 text-sm text-muted-foreground h-10">
                {tutor.subtitle || "Passionate about teaching and helping students achieve their goals."}
              </p>

              <div className="mt-4 flex items-center gap-2">
                {tutor.verified && (
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 hover:bg-violet-100">
                    Verified
                  </Badge>
                )}
                {tutor.rating > 0 && (
                  <Badge variant="outline" className="gap-1 border-orange-200 text-orange-600 dark:border-orange-900/50 dark:text-orange-400">
                    <Star className="h-3 w-3 fill-current" />
                    {Number(tutor.rating).toFixed(1)}
                  </Badge>
                )}
                {tutor.price > 0 && (
                  <span className="ml-auto text-sm font-medium">
                    ${tutor.price}/hr
                  </span>
                )}
              </div>

              <Button className="mt-5 w-full bg-violet-600 hover:bg-violet-700 text-white" asChild>
                <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/tutors">View all tutors</Link>
        </Button>
      </div>
    </div>
  );
}