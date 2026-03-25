"use client";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth-client";

export default function DashboardStudent() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser(logout, () => router.push("/"));
  };

  return (
    <section className="max-w-5xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 lg:px-0 pb-10">
      <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 sm:p-8">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 sm:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Student Dashboard
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 break-all">
              Welcome, {user?.email}
            </p>
          </div>

          <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
            Logout
          </Button>
        </header>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <article className="rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-5 sm:p-6">
            <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold">
              Quick Action
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              Join Exam
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Enter the exam code shared by your instructor and open the exam details page.
            </p>
            <Button onClick={() => router.push("/student/join-exam")} className="w-full mt-5">
              Join Exam
            </Button>
          </article>

          <article className="rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-5 sm:p-6">
            <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
              Instructions
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              How to Join
            </h3>
            <ul className="mt-3 space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>Request the exam code from your admin.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>Open Join Exam and paste the code exactly.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>Review details before starting the test.</span>
              </li>
            </ul>
            <Button
              variant="outline"
              className="w-full mt-5"
              onClick={() => router.push("/student/join-exam")}
            >
              Enter Exam Code
            </Button>
          </article>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 sm:px-5 py-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Tip: Keep your internet stable and do not switch tabs during the exam session.
          </p>
        </div>
      </div>
    </section>
  );
}
