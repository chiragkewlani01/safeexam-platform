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

const schema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute" }),
});

type FormData = z.infer<typeof schema>;

interface CreatedExam {
  id: number;
  title: string;
  duration: number;
  exam_code: string;
  created_at: string;
}

export default function CreateExamForm() {
  const { showToast } = useToastStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [createdExam, setCreatedExam] = useState<CreatedExam | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 60 },
  });

  const onSubmit = async (data: FormData) => {
    if (!user || user.role !== "admin") {
      showToast("You must be logged in as admin to create exams", "error");
      router.push("/auth/admin-login");
      return;
    }

    try {
      const examResponse = await fetch("http://localhost:8000/api/v1/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          duration: data.duration,
        }),
      });

      if (!examResponse.ok) {
        const error = await examResponse.json();
        throw new Error(error.detail || "Failed to create exam");
      }

      const exam = await examResponse.json();
      setCreatedExam(exam);
      showToast(`Exam created! Code: ${exam.exam_code}`, "success");
      reset();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create exam",
        "error"
      );
      console.error(error);
    }
  };

  if (createdExam) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Exam Created Successfully!</h2>
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Exam Title</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{createdExam.title}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{createdExam.duration} minutes</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Exam Code (Share with students)</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono text-center py-4">{createdExam.exam_code}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button 
            className="flex-1"
            onClick={() => {
              setCreatedExam(null);
              reset();
            }}
          >
            Create Another Exam
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Create New Exam</h2>
      <div>
        <Label htmlFor="title">Exam Title</Label>
        <Input id="title" type="text" {...register("title")} placeholder="e.g., Mid Semester Test"/>
        {errors.title && <p className="text-xs text-[#EF4444] mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input id="duration" type="number" min={1} {...register("duration", { valueAsNumber: true })} placeholder="60"/>
        {errors.duration && <p className="text-xs text-[#EF4444] mt-1">{errors.duration.message}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Creating..." : "Create Exam"}
        </Button>
        <Button type="reset" variant="outline" className="flex-1" onClick={() => reset()}>Reset</Button>
      </div>
    </Form>
  );
}
