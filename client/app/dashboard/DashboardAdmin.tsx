"use client";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {
  const router = useRouter();
  return (
    <section className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-[#1a1a1a] rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="mb-8 text-[#6B7280]">Welcome! You can create a new exam or view all exams.</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => router.push("/admin/create-exam")}>Create Exam</Button>
        <Button variant="outline" onClick={() => router.push("/exams")}>View Exams</Button>
      </div>
    </section>
  );
}
