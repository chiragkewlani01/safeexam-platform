"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { useToastStore } from "@/store/useToastStore";

const schema = z.object({
  examCode: z.string().min(4, { message: "Enter a valid exam code" }),
});

type FormData = z.infer<typeof schema>;

export default function JoinExamForm() {
  const { showToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    // Simulate join exam (show toast)
    showToast(`Joined exam: ${data.examCode}`, "success");
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Join Exam</h2>
      <div>
        <Label htmlFor="examCode">Exam Code</Label>
        <Input id="examCode" type="text" {...register("examCode")}/>
        {errors.examCode && <p className="text-xs text-[#EF4444] mt-1">{errors.examCode.message}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting}>Join</Button>
        <Button type="reset" variant="outline" onClick={() => reset()}>Reset</Button>
      </div>
    </Form>
  );
}
