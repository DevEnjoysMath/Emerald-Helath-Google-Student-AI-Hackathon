
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";


export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If the user is logged in and somehow lands here,
        // redirect them to the home page. The profile is now a dialog.
        router.replace('/');
      } else {
        // If not logged in, redirect to login page.
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show a loader while checking auth state and redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
