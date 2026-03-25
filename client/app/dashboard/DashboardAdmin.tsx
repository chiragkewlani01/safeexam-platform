"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { logoutUser } from "@/lib/auth-client";

type Exam = {
  id: number;
  title: string;
  duration: number;
  exam_code: string;
};

export default function DashboardAdmin() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { showToast } = useToastStore();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingExamId, setDeletingExamId] = useState<number | null>(null);

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch("/api/v1/exams");
      if (!response.ok) {
        throw new Error("Failed to load exams");
      }
      const data = await response.json();
      setExams(data);
    } catch {
      showToast("Failed to load exams", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    setDeletingExamId(examId);
    try {
      const response = await apiFetch(`/api/v1/exams/${examId}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Delete failed");
      }

      setExams((prev) => prev.filter((exam) => exam.id !== examId));
      showToast("Exam deleted", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Delete failed", "error");
    } finally {
      setDeletingExamId(null);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleLogout = async () => {
    await logoutUser(logout, () => router.push("/"));
  };

  return (
    <section className="max-w-6xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 lg:px-0 pb-10">
      <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 sm:p-8">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 sm:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
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
          <Card className="bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 shadow-none hover:scale-100">
            <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold">
              Quick Action
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">Create New Exam</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Create an exam with title, duration, and questions.</p>
            <Button onClick={() => router.push("/admin/create-exam")} className="w-full">
              Create Exam
            </Button>
          </Card>

          <Card className="bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 shadow-none hover:scale-100">
            <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
              Management
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">View All Exams</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">See exam list, codes, and remove outdated exams.</p>
            <Button variant="outline" onClick={() => router.push("/admin/exams")} className="w-full">
              View Exams
            </Button>
          </Card>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Exams</h3>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total: {exams.length}</span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-10 bg-white dark:bg-gray-800">
            <LoadingSpinner className="w-8 h-8" />
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6">
            <EmptyState message="No exams created yet." />
          </div>
        ) : (
          <Table className="border-0 rounded-none">
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Duration</TH>
                <TH>Exam Code</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {exams.map((exam) => (
                <TR key={exam.id}>
                  <TD>{exam.title}</TD>
                  <TD>{exam.duration} min</TD>
                  <TD>
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-wide">{exam.exam_code}</span>
                  </TD>
                  <TD className="text-right">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={deletingExamId === exam.id}
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      {deletingExamId === exam.id ? "Deleting..." : "Delete"}
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
          </div>
        </div>
      </div>
    </section>
  );
}
