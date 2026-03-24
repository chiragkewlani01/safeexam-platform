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
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "admin"]),
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const { login } = useAuthStore();
  const { showToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "student" },
  });

  const onSubmit = (data: FormData) => {
    // Simulate registration (store in Zustand, show toast)
    login({ name: data.name, email: data.email, role: data.role });
    showToast("Registered successfully!", "success");
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-12 bg-white dark:bg-[#1a1a1a] p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Register</h2>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" {...register("name")}/>
        {errors.name && <p className="text-xs text-[#EF4444] mt-1">{errors.name.message}</p>}
      </div>
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
      <div>
        <Label htmlFor="role">Role</Label>
        <select id="role" {...register("role")} className="block w-full px-3 py-2 border border-[#E5E7EB] rounded bg-white dark:bg-[#222] text-[#111827] dark:text-white">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="text-xs text-[#EF4444] mt-1">{errors.role.message}</p>}
      </div>
      <div className="flex gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting}>Register</Button>
        <Button type="reset" variant="outline" onClick={() => reset()}>Reset</Button>
      </div>
    </Form>
  );
}
