"use client";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function DashboardStudent() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <section className="max-w-4xl mx-auto mt-12 p-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Student Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome, {user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Join Exam</h3>
          <p className="text-gray-700 dark:text-gray-400 mb-4">Enter the exam code provided by your instructor</p>
          <Button onClick={() => router.push("/student/join-exam")} className="w-full">
            Join Exam
          </Button>
        </div>

        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Your Results</h3>
          <p className="text-gray-700 dark:text-gray-400 mb-4">View your exam results and feedback</p>
          <Button variant="outline" className="w-full">
            View Results
          </Button>
        </div>
      </div>
    </section>
  );
}
