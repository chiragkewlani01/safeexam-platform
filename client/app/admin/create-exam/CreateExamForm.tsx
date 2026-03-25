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
import { apiFetch } from "@/lib/api";

const schema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute" }),
});

type FormData = z.infer<typeof schema>;

interface MCQQuestion {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
}

interface CreatedExam {
  id: number;
  title: string;
  duration: number;
  exam_code: string;
  created_at: string;
  questions_count?: number;
}

const createEmptyQuestion = (): MCQQuestion => ({
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "A",
});

export default function CreateExamForm() {
  const { showToast } = useToastStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [createdExam, setCreatedExam] = useState<CreatedExam | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([createEmptyQuestion()]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 60 },
  });

  const resetFormState = () => {
    reset();
    setQuestions([createEmptyQuestion()]);
  };

  const onSubmit = async (data: FormData) => {
    if (!user || user.role !== "admin") {
      showToast("You must be logged in as admin to create exams", "error");
      router.push("/auth/admin-login");
      return;
    }

    const hasInvalidQuestion = questions.some(
      (q) =>
        !q.question_text.trim() ||
        !q.option_a.trim() ||
        !q.option_b.trim() ||
        !q.option_c.trim() ||
        !q.option_d.trim()
    );

    if (questions.length === 0 || hasInvalidQuestion) {
      showToast("Please add at least one complete MCQ question", "error");
      return;
    }

    try {
      const examResponse = await apiFetch("/api/v1/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          duration: data.duration,
          questions,
        }),
      });

      if (!examResponse.ok) {
        const error = await examResponse.json();
        throw new Error(error.detail || "Failed to create exam");
      }

      const exam = await examResponse.json();
      setCreatedExam(exam);
      showToast(`Exam created! ${exam.questions_count || 0} question(s) added`, "success");
      resetFormState();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create exam",
        "error"
      );
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
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Questions Added</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{createdExam.questions_count || 0} MCQ(s)</p>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button 
            className="flex-1"
            onClick={() => {
              setCreatedExam(null);
              resetFormState();
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
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow space-y-4">
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

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">MCQ Questions</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setQuestions((prev) => [
                ...prev,
                createEmptyQuestion(),
              ])
            }
          >
            + Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Question {index + 1}</p>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-500 text-red-600"
                    onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <Input
                type="text"
                placeholder="Question text"
                value={q.question_text}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, question_text: e.target.value } : item))
                  )
                }
              />

              <div className="grid md:grid-cols-2 gap-2">
                <Input type="text" placeholder="Option A" value={q.option_a} onChange={(e) => setQuestions((prev) => prev.map((item, i) => (i === index ? { ...item, option_a: e.target.value } : item)))} />
                <Input type="text" placeholder="Option B" value={q.option_b} onChange={(e) => setQuestions((prev) => prev.map((item, i) => (i === index ? { ...item, option_b: e.target.value } : item)))} />
                <Input type="text" placeholder="Option C" value={q.option_c} onChange={(e) => setQuestions((prev) => prev.map((item, i) => (i === index ? { ...item, option_c: e.target.value } : item)))} />
                <Input type="text" placeholder="Option D" value={q.option_d} onChange={(e) => setQuestions((prev) => prev.map((item, i) => (i === index ? { ...item, option_d: e.target.value } : item)))} />
              </div>

              <div>
                <Label>Correct Option</Label>
                <select
                  className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-[#1a1a1a]"
                  value={q.correct_option}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, correct_option: e.target.value as "A" | "B" | "C" | "D" } : item
                      )
                    )
                  }
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Creating..." : "Create Exam"}
        </Button>
        <Button
          type="reset"
          variant="outline"
          className="flex-1"
          onClick={resetFormState}
        >
          Reset
        </Button>
      </div>
    </Form>
  );
}
