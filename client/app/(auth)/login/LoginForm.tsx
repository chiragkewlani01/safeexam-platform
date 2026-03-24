"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { login } = useAuthStore();
  const { showToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    // Simulate login (admin if email includes admin, else student)
    const role = data.email.includes("admin") ? "admin" : "student";
    login({ name: data.email.split("@")[0], email: data.email, role });
    showToast("Logged in successfully!", "success");
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")}/>
        {errors.email && <p className="text-xs text-[#EF4444] mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")}/>
        {errors.password && <p className="text-xs text-[#EF4444] mt-1">{errors.password.message}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting}>Login</Button>
        <Button type="reset" variant="outline" onClick={() => reset()}>Reset</Button>
      </div>
    </Form>
  );
}
