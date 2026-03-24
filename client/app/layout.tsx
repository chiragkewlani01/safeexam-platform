import "./globals.css";

import Navbar from "../components/Navbar";
import ToastRoot from "../components/ToastRoot";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-inter bg-white text-[#111827] dark:bg-[#111827] dark:text-white flex flex-col min-h-screen">
        <Navbar />
        <ToastRoot />
        <main className="flex-1 pt-16 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
