"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { useToastStore } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

const schema = z.object({
  examCode: z.string().min(4, { message: "Enter a valid exam code" }),
});

type FormData = z.infer<typeof schema>;

interface ExamDetail {
  id: number;
  title: string;
  duration: number;
  exam_code: string;
}

export default function JoinExamForm() {
  const { showToast } = useToastStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [examDetails, setExamDetails] = useState<ExamDetail | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      showToast("Please log in first to join an exam", "error");
      router.push("/auth/student-login");
      return;
    }

    try {
      const response = await apiFetch("/api/v1/exams/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exam_code: data.examCode }),
      });

      if (!response.ok) {
        throw new Error("Exam not found");
      }

      const exam = await response.json();
      setExamDetails(exam);
      showToast(`Successfully joined: ${exam.title}`, "success");
    } catch {
      showToast("Failed to join exam. Please check the code.", "error");
    }
  };

  if (examDetails) {
    return (
      <div className="w-full rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Exam Details</h2>
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-lg border border-slate-200 dark:border-gray-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Exam Title</p>
            <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">{examDetails.title}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-lg border border-slate-200 dark:border-gray-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">Duration</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{examDetails.duration} minutes</p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-lg border border-slate-200 dark:border-gray-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">Exam Code</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white tracking-wide">{examDetails.exam_code}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button className="flex-1" onClick={() => router.push(`/student/exam/${examDetails.id}`)}>
            Start Exam
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setExamDetails(null);
              reset();
            }}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">Enter Exam Code</h2>
      {!user && (
        <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            You must be logged in. <Link href="/auth/student-login" className="font-semibold underline">Login here</Link>
          </p>
        </div>
      )}
      <div>
        <Label htmlFor="examCode" className="text-slate-700 dark:text-slate-300">Exam Code</Label>
        <Input
          id="examCode"
          type="text"
          {...register("examCode")}
          placeholder="e.g., ABC123DE"
          disabled={!user}
          className="mt-2 h-11 sm:h-12 uppercase"
        />
        {errors.examCode && <p className="text-xs text-[#EF4444] mt-1">{errors.examCode.message}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button type="submit" disabled={isSubmitting || !user} className="flex-1">
          {isSubmitting ? "Joining..." : "Join"}
        </Button>
        <Button type="reset" variant="outline" className="flex-1" onClick={() => reset()}>
          Reset
        </Button>
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Tip: Codes are case-sensitive in some exam setups.
      </p>
    </Form>
  );
}
