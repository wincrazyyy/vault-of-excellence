import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Eye, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  User,
  ExternalLink
} from "lucide-react";

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const { data: tutor } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!tutor) {
    return <div className="p-10 text-center">Profile not found. Please contact support.</div>;
  }

  const isProfileComplete = tutor.title && tutor.price > 0 && tutor.sections?.length > 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {tutor.name}. Here is an overview of your profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tutors/${tutor.id}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Public Page
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/tutors/${tutor.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 border-violet-200 dark:border-violet-800/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <User className="w-32 h-32 text-violet-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile Status</CardTitle>
            <CardDescription>Your visibility on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300 font-bold text-2xl">
                {tutor.name?.[0] || "T"}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tutor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {tutor.title || "No title set"}
                </p>
              </div>
              <div className="ml-auto">
                 {isProfileComplete ? (
                   <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                 ) : (
                   <Badge variant="secondary">Incomplete</Badge>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="rounded-lg border p-3">
                 <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Price</div>
                 <div className="text-lg font-semibold">
                   {tutor.price > 0 ? `$${tutor.price / 100}/hr` : "Not set"}
                 </div>
               </div>
               <div className="rounded-lg border p-3">
                 <div className="text-xs text-muted-foreground uppercase font-medium mb-1">Sections</div>
                 <div className="text-lg font-semibold">
                   {tutor.sections?.length || 0} Modules
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>How students see you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-md text-yellow-600">
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Rating</span>
              </div>
              <span className="font-bold">{tutor.rating}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Return Rate</span>
              </div>
              <span className="font-bold">{tutor.return_rate}%</span>
            </div>

             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Verified</span>
              </div>
              <span className="font-bold">
                {tutor.verified ? "Yes" : "No"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
             <div className="bg-background p-3 rounded-full mb-4 shadow-sm">
                <ExternalLink className="h-6 w-6 text-muted-foreground" />
             </div>
             <h3 className="font-semibold text-lg mb-2">Share your profile</h3>
             <p className="text-sm text-muted-foreground max-w-md mb-6">
               Your public profile is ready to share. Copy the link below to send to students or post on social media.
             </p>
             <div className="flex items-center gap-2 max-w-md w-full">
               <code className="flex-1 block p-2 rounded bg-background border text-xs text-muted-foreground truncate">
                 {`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tutors/${tutor.id}`}
               </code>
               <Button variant="secondary" size="sm">Copy</Button>
             </div>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 h-64 bg-muted animate-pulse rounded-xl" />
        <div className="h-64 bg-muted animate-pulse rounded-xl" />
      </div>
    </div>
  );
}