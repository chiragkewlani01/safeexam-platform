
"use client";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg text-[#2563EB] flex items-center gap-2">
          <Image src="/logo.png" alt="SafeExam Logo" width={130} height={130} className="rounded-sm" />
        </Link>
        {/* Only show these if logged in and role matches */}
        {user?.role === "admin" && (
          <Link href="/admin/create-exam" className="ml-4 text-sm font-medium">Create Exam</Link>
        )}
        {user?.role === "student" && (
          <Link href="/student/join-exam" className="ml-4 text-sm font-medium">Join Exam</Link>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user && (
          <>
            <span className="text-sm mr-2">{user.name}</span>
            <button onClick={logout} className="text-xs px-3 py-1 rounded bg-[#2563EB] text-white">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
