"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { useExamStore } from "@/store/useExamStore";
import { useToastStore } from "@/store/useToastStore";

const schema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute" }),
});

type FormData = z.infer<typeof schema>;

export default function CreateExamForm() {
  const { addExam } = useExamStore();
  const { showToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 60 },
  });

  const onSubmit = (data: FormData) => {
    addExam({
      id: Math.random().toString(36).slice(2),
      title: data.title,
      duration: data.duration,
      createdBy: "admin",
      examCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    });
    showToast("Exam created!", "success");
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Create Exam</h2>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" type="text" {...register("title")}/>
        {errors.title && <p className="text-xs text-[#EF4444] mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input id="duration" type="number" min={1} {...register("duration", { valueAsNumber: true })}/>
        {errors.duration && <p className="text-xs text-[#EF4444] mt-1">{errors.duration.message}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting}>Create</Button>
        <Button type="reset" variant="outline" onClick={() => reset()}>Reset</Button>
      </div>
    </Form>
  );
}
