"use client";
import { useAuthStore } from "@/store/useAuthStore";
import DashboardStudent from "./DashboardStudent";
import DashboardAdmin from "./DashboardAdmin";

export default function DashboardPage() {
  const { user } = useAuthStore();
  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-white dark:bg-[#1a1a1a] rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Please login to view your dashboard.</h2>
      </div>
    );
  }
  return user.role === "admin" ? <DashboardAdmin /> : <DashboardStudent />;
}