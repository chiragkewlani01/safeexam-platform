"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import DashboardStudent from "./DashboardStudent";
import DashboardAdmin from "./DashboardAdmin";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from backend after OAuth redirect
    const fetchUserData = async () => {
      try {
        // Try to get session token from URL (from OAuth callback)
        const sessionToken = searchParams.get("session_token");
        
        const fetchOptions: RequestInit = {
          credentials: "include",
        };
        
        // If we have a session token from URL, set it as a cookie
        if (sessionToken) {
          console.log("Setting session token from URL:", sessionToken);
          document.cookie = `session_token=${sessionToken}; path=/; SameSite=Lax`;
        }
        
        const response = await fetch("http://localhost:8000/api/v1/auth/me", fetchOptions);

        if (response.ok) {
          const userData = await response.json();
          console.log("User data received:", userData);
          login({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            created_at: userData.created_at,
          });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
      
      // If no user data from backend, check Zustand
      setIsLoading(false);
    };

    // If user is not authenticated, try fetching from backend
    if (!isAuthenticated || !user) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated after loading
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/auth/student-login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return user.role === "admin" ? <DashboardAdmin /> : <DashboardStudent />;
}