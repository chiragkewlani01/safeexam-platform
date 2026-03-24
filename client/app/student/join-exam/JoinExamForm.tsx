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
      const response = await fetch("http://localhost:8000/api/v1/exams/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ exam_code: data.examCode }),
      });

      if (!response.ok) {
        throw new Error("Exam not found");
      }

      const exam = await response.json();
      setExamDetails(exam);
      showToast(`Successfully joined: ${exam.title}`, "success");
    } catch (error) {
      showToast("Failed to join exam. Please check the code.", "error");
    }
  };

  if (examDetails) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Exam Details</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Exam Title</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{examDetails.title}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{examDetails.duration} minutes</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Exam Code</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{examDetails.exam_code}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button className="flex-1" onClick={() => router.push(`/exam/${examDetails.id}`)}>
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
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Join Exam</h2>
      {!user && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You must be logged in. <Link href="/auth/student-login" className="font-semibold underline">Login here</Link>
          </p>
        </div>
      )}
      <div>
        <Label htmlFor="examCode">Exam Code</Label>
        <Input id="examCode" type="text" {...register("examCode")} placeholder="e.g., ABC123DE" disabled={!user}/>
        {errors.examCode && <p className="text-xs text-[#EF4444] mt-1">{errors.examCode.message}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting || !user} className="flex-1">
          {isSubmitting ? "Joining..." : "Join"}
        </Button>
        <Button type="reset" variant="outline" className="flex-1" onClick={() => reset()}>Reset</Button>
      </div>
    </Form>
  );
}
