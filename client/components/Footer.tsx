import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] dark:bg-black text-white border-t border-gray-800 relative z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-800">

          {/* Brand & Dev */}
          <div className="flex flex-col items-center md:items-start gap-4 text-sm mt-2">
            <p className="text-gray-500">
              Built by the <Link href="/developers" className="text-gray-400 hover:text-blue-400 underline decoration-gray-700 underline-offset-2 transition-colors">SafeExam Team</Link>
            </p>
          </div>

          {/* Links Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4 text-sm text-gray-400 pt-4 md:pt-0">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} SafeExam. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
