"use client";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function DashboardStudent() {
  const router = useRouter();
  return (
    <section className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-[#1a1a1a] rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
      <p className="mb-8 text-[#6B7280]">Welcome! You can join an exam using the code provided by your instructor.</p>
      <Button onClick={() => router.push("/student/join-exam")}>Join Exam</Button>
    </section>
  );
}
