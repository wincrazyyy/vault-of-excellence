"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (_event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  
  const getFirstName = () => {
    if (!user) return "";

    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0];
    }

    return user.email?.split("@")[0] || "User";
  };

  if (loading) {
    return (
      <div className="flex h-9 items-center justify-center px-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="text-sm font-medium hidden md:block">
        Hey, {getFirstName()}!
      </span>
      <Button 
        onClick={handleLogout} 
        size="sm" 
        variant="outline"
        className="h-8 px-3 sm:h-9 sm:px-4 text-xs sm:text-sm"
      >
        Sign out
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button 
        asChild 
        size="sm" 
        variant="ghost" 
        className="h-8 px-2 sm:h-9 sm:px-4 text-xs sm:text-sm"
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button 
        asChild 
        size="sm" 
        variant="default"
        className="h-8 px-3 sm:h-9 sm:px-4 text-xs sm:text-sm"
      >
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
