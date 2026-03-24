


import { Button } from "@/components/ui/Button";
import Image from "next/image";

// Reusable Doodle Components
const HighlightDoodle = ({ className }: { className?: string }) => (
  <svg className={`overflow-visible ${className}`} viewBox="0 0 200 20" fill="none">
    <path d="M5 15 Q 50 5 100 12 T 195 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDoodle = ({ className }: { className?: string }) => (
  <svg className={`overflow-visible ${className}`} viewBox="0 0 100 100" fill="none">
    <path d="M10 90 Q 40 10 90 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 75 10 L 90 20 L 85 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CircleDoodle = ({ className }: { className?: string }) => (
  <svg className={`overflow-visible ${className}`} viewBox="0 0 100 100" fill="none">
    <path d="M 50 10 C 80 10 90 40 85 70 C 80 100 30 95 15 75 C 0 55 10 20 45 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ScribbleUnderline = ({ className }: { className?: string }) => (
  <svg className={`overflow-visible ${className}`} viewBox="0 0 100 20" fill="none">
    <path d="M 5 15 Q 30 5 55 15 Q 80 5 95 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default function HomePage() {
  return (
    <main className="relative bg-[#FDFDFC] dark:bg-[#0A0A0A] min-h-screen w-full flex flex-col font-inter overflow-x-hidden selection:bg-primary/20">
      
      {/* GLOBAL BACKGROUND ELEMENTS (Noise, Grid, Glows, Doodles) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
         {/* Very subtle SVG noise texture */}
         <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
         
         {/* Light grid pattern */}
         <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         {/* Ambient Glows */}
         <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-blue-50/60 via-transparent to-transparent dark:from-blue-900/10" />
         <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-300/10 dark:bg-blue-600/10 blur-[120px]" />
         <div className="absolute top-[15%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-300/10 dark:bg-purple-600/10 blur-[130px]" />
         <div className="absolute bottom-[20%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-300/10 dark:bg-cyan-600/10 blur-[120px]" />

         {/* Faint Background Doodles */}
         <svg className="absolute top-[15%] left-[5%] w-32 h-32 text-gray-300/30 dark:text-gray-700/30 -rotate-12" viewBox="0 0 100 100" fill="none">
            <path d="M 10 50 Q 30 10 90 50 Q 80 90 10 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" />
         </svg>
         <svg className="absolute top-[35%] right-[8%] w-24 h-24 text-blue-200/40 dark:text-blue-900/40 rotate-[15deg]" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
         </svg>
         <svg className="absolute top-[60%] left-[10%] w-40 h-40 text-purple-200/30 dark:text-purple-900/30 -rotate-[25deg]" viewBox="0 0 200 200" fill="none">
            <path d="M 20 180 C 60 180 80 140 100 100 C 120 60 140 20 180 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
         </svg>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative w-full max-w-[1400px] mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 z-10">
        
        {/* Left: Content */}
        <div className="flex-1 flex flex-col items-start max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm mb-6 relative hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
              Session-based • Monitored • Secure
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight relative mb-6">
            Trust Every <span className="relative inline-block">
              Exam.
              <HighlightDoodle className="absolute -bottom-2 left-0 w-full h-4 text-primary opacity-80" />
            </span>
            <br />
            Control Every Session.
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
            SafeExam is not just a quiz app. It’s a secure, session-based examination system with real-time monitoring, auto-save, and rigorous anti-cheating controls.
            <strong className="block mt-3 text-base text-gray-900 dark:text-gray-200">No setup. No complexity. Set up exams in under 2 minutes.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="/auth/student-login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-8 text-lg font-medium rounded-xl shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)] hover:shadow-[0_12px_28px_-8px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-300">
                Join Exam
              </Button>
            </a>
            <a href="/auth/admin-login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-medium rounded-xl border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                Create Exam
              </Button>
            </a>
          </div>

          {/* Hand drawn arrow pointing to CTA on large screens */}
          <div className="hidden lg:block absolute -right-20 top-2/3 text-gray-400 dark:text-gray-600">
            <ArrowDoodle className="w-24 h-24 -rotate-12" />
            <span className="absolute top-16 left-24 text-sm font-handwriting rotate-12 whitespace-nowrap">Try it out!</span>
          </div>
        </div>

        {/* Right: Floating UI Concept */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative mt-10 lg:mt-0 flex justify-center">
          
          {/* Main App Window Simulation */}
          <div className="relative w-full aspect-[4/3] max-w-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col transform hover:translate-y-[-5px] transition-transform duration-500">
            {/* Header */}
            <div className="h-12 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-5 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 font-mono">Exam Session Active</div>
            </div>
            
            {/* Body */}
            <div className="flex-1 p-6 relative flex flex-col gap-4">
              <div className="w-1/3 h-5 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              <div className="w-full flex-1 bg-gradient-to-tr from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800/20 rounded-xl border border-blue-100/50 dark:border-blue-800/30 p-4 flex flex-col gap-3">
                <div className="w-full h-4 bg-white dark:bg-gray-800 rounded-md shadow-sm" />
                <div className="w-5/6 h-4 bg-white dark:bg-gray-800 rounded-md shadow-sm" />
                <div className="w-4/6 h-4 bg-white dark:bg-gray-800 rounded-md shadow-sm" />
                
                <div className="mt-auto self-end w-24 h-8 bg-primary/90 rounded-md" />
              </div>
            </div>

            {/* Doodle overlays on window */}
            <div className="absolute top-20 right-6 text-green-500/80 -rotate-12 hidden md:block">
              <CircleDoodle className="w-16 h-16" />
              <span className="absolute -top-3 -right-6 text-xs font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-md shadow-sm rotate-12">Monitored</span>
            </div>
          </div>

          {/* Floating Stat Card */}
          <div className="absolute -bottom-8 -left-6 lg:-bottom-12 lg:-left-12 bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl rotate-[-4deg] hover:rotate-0 transition-transform duration-300 z-20 group max-w-[200px]">
            <div className="absolute -top-4 -right-4 text-3xl drop-shadow-md group-hover:scale-110 transition-transform origin-bottom">📌</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Exams</div>
            <div className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">10,000+</div>
            <ScribbleUnderline className="absolute bottom-2 left-6 w-16 h-4 text-primary opacity-60" />
          </div>

          {/* Secondary Floating Card */}
          <div className="absolute top-1/2 -right-8 lg:-right-16 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg rotate-[6deg] hover:rotate-2 transition-transform duration-300 z-20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Auto-saved</div>
          </div>

        </div>
      </section>

      {/* 2. PROBLEM SECTION (Emotional storytelling) */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 relative">
        <div className="absolute inset-0 bg-red-50/30 dark:bg-red-900/5 rotate-1 rounded-3xl -z-10" />
        
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Why online exams fail today.
          </h2>
          <ScribbleUnderline className="w-48 h-6 text-red-400 mx-auto opacity-70" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Traditional forms and basic quizzes are a playground for dishonesty.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "No Monitoring", desc: "Tab switching, googling answers, and background apps go completely unnoticed.", icon: "👀" },
            { title: "Lost Data", desc: "A slight network drop and all student progress is instantly wiped out.", icon: "🔌" },
            { title: "Zero Control", desc: "Links are shared, impersonation happens, and there is no session tracking.", icon: "🔓" }
          ].map((item, i) => (
            <div key={i} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative group hover:bg-white dark:hover:bg-gray-900 transition-colors">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              
              {/* Random sketch artifact on the first card */}
              {i === 0 && (
                 <ArrowDoodle className="absolute -top-10 -right-4 w-16 h-16 text-red-300 dark:text-red-900/50 rotate-90" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2.5 THE GAP SECTION */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-gray-100 dark:border-gray-900">
         <div className="text-center mb-16 relative">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
               Built for the gap no one solved.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
               Until now, you only had two bad choices for online assessments. We built the third.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Enterprise */}
            <div className="bg-gray-50 dark:bg-gray-900/40 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center opacity-70">
               <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl mb-4">🏛️</div>
               <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Enterprise Systems</h3>
               <p className="text-sm text-gray-500 mb-6">Powerful, but extremely expensive and complex to set up.</p>
               <div className="mt-auto space-y-2 w-full text-xs font-semibold text-red-500/80">
                  <div className="py-2 border-t border-gray-200 dark:border-gray-800">Months to deploy</div>
                  <div className="py-2 border-t border-gray-200 dark:border-gray-800">$10,000+ per year</div>
               </div>
            </div>

            {/* Google Forms */}
            <div className="bg-gray-50 dark:bg-gray-900/40 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center opacity-70 relative">
               <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl mb-4">📝</div>
               <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Basic Quiz Apps</h3>
               <p className="text-sm text-gray-500 mb-6">Simple and cheap, but completely unmonitored and insecure.</p>
               <div className="mt-auto space-y-2 w-full text-xs font-semibold text-red-500/80">
                  <div className="py-2 border-t border-gray-200 dark:border-gray-800">Zero cheating protection</div>
                  <div className="py-2 border-t border-gray-200 dark:border-gray-800">Responses easily lost</div>
               </div>
            </div>

            {/* SafeExam */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-primary shadow-xl flex flex-col items-center text-center relative transform md:-translate-y-4">
               <div className="absolute -top-3 -right-3 text-2xl animate-bounce">✨</div>
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  <Image src="/logo.png" alt="SafeExam Logo" width={32} height={32} className="object-contain" />
               </div>
               <h3 className="font-bold text-xl text-primary mb-2">SafeExam</h3>
               <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Enterprise-level security combined with consumer-level simplicity.</p>
               <div className="mt-auto space-y-2 w-full text-xs font-semibold text-green-600 dark:text-green-400">
                  <div className="py-2 border-t border-gray-100 dark:border-gray-800">Set up in 2 minutes</div>
                  <div className="py-2 border-t border-gray-100 dark:border-gray-800">100% Session tracking</div>
               </div>
               <ScribbleUnderline className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 text-primary" />
            </div>
         </div>
      </section>

      {/* 3. SOLUTION SECTION (Powerful & System Level) */}
      <section className="w-full py-24 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
        {/* Abstract dark gradients */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.1),transparent_50%)]" />

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              System-Level Fix
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              SafeExam fixes this at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">core level.</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              We shifted control from the browser to the backend. Every session is tracked, validated, and fiercely protected.
            </p>
            
            <ul className="space-y-4">
              {[
                "Strict Session Tracking",
                "Real-time tab/window monitoring",
                "Auto-save mechanism per keystroke",
                "Role-based backend validation"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-300 text-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full max-w-md relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 relative shadow-2xl">
               <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                 <div className="text-sm font-semibold text-gray-400">Server Logs (Realtime)</div>
                 <div className="flex gap-1.5 flex-row">
                    <div className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
                 </div>
               </div>
               <div className="font-mono text-xs sm:text-sm text-gray-500 space-y-3">
                 <div className="flex gap-2"><span className="text-blue-400">[SYS]</span> <span>Session initialized for user_id=9821</span></div>
                 <div className="flex gap-2"><span className="text-green-400">[SEC]</span> <span>Full-screen enforced.</span></div>
                 <div className="flex gap-2"><span className="text-gray-400">[SAVE]</span> <span>Answer Q1 auto-saved.</span></div>
                 <div className="flex gap-2"><span className="text-yellow-400">[WARN]</span> <span>Window blur detected. Marking attempt...</span></div>
                 <div className="flex gap-2"><span className="text-gray-400">[SAVE]</span> <span>Answer Q2 auto-saved.</span></div>
               </div>

               {/* Hand drawn highlighter */}
               <div className="absolute top-1/2 right-4 text-yellow-500/40">
                  <HighlightDoodle className="w-32 h-6" />
               </div>
            </div>
            
            <div className="absolute -right-12 -bottom-10 bg-black border border-gray-800 p-4 rounded-xl shadow-xl flex items-center gap-4 rotate-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                <Image src="/logo.png" alt="SafeExam" width={24} height={24} />
              </div>
              <div>
                <div className="text-white font-bold">100% Controlled</div>
                <div className="text-gray-500 text-xs mt-1">Backend backed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES (Mixed layout, not boring cards) */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 lg:py-32 relative">
         <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Built for absolute fairness.</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to conduct high-stakes assessments with confidence, wrapped in a beautiful interface.</p>
         </div>

         <div className="flex flex-col gap-24">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative">
              <div className="flex-1 w-full order-2 md:order-1 relative">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 flex items-center justify-center relative overflow-hidden">
                   {/* Mock UI */}
                   <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 relative z-10">
                     <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                     <div className="w-full h-24 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400">Question Content</div>
                     <div className="w-full h-10 mt-4 bg-gray-100 dark:bg-gray-800 rounded-md" />
                   </div>
                   {/* Doodles */}
                   <div className="absolute right-4 bottom-4 text-sm font-handwriting text-blue-500 bg-white/80 dark:bg-black/80 px-4 py-2 rounded-lg shadow-sm -rotate-6">Saved instantly ✨</div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                 <div className="text-primary text-xl font-bold mb-4">01. Infinite Auto-Save</div>
                 <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Never lose a single keystroke.</h3>
                 <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                   Every answer is securely pushed to the server the moment it’s typed. Network goes down? Computer crashes? Students resume exactly where they left off. No panic.
                 </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative">
              <div className="flex-1">
                 <div className="text-red-500 text-xl font-bold mb-4">02. Proctoring Engine</div>
                 <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Detect suspicious behavior effortlessly.</h3>
                 <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                   A robust monitoring system that tracks window blurs, tab switches, and unauthorized exits. Any violation is logged permanently to the student's session.
                 </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-video bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-8 flex items-center justify-center relative overflow-hidden">
                   {/* Mock UI */}
                   <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 relative z-10 border border-red-200 dark:border-red-900">
                     <div className="flex items-center gap-3 text-red-600 mb-4 font-semibold">
                       <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       Violation Detected
                     </div>
                     <div className="text-sm text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">User switched to 'Google Search' tab at 14:02 PM.</div>
                   </div>
                   {/* Doodles */}
                   <svg className="absolute top-8 right-8 w-24 h-24 text-red-400 opacity-50" viewBox="0 0 100 100" fill="none">
                     <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="4" />
                     <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="4" />
                   </svg>
                </div>
              </div>
            </div>
         </div>
      </section>

      {/* 5. HOW IT WORKS (Visual Step Flow) */}
      <section className="w-full bg-blue-50/50 dark:bg-gray-900/20 py-24 relative border-y border-gray-100 dark:border-gray-800">
         <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">How it works in practice.</h2>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8 md:gap-0">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-[40px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent z-0" />
               
               {[
                 { step: 1, title: "Create Identity", desc: "Secure login" },
                 { step: 2, title: "Join Room", desc: "Validate access" },
                 { step: 3, title: "Lock Down", desc: "Start monitor" },
                 { step: 4, title: "Attempt", desc: "Auto-saving" },
                 { step: 5, title: "Submit", desc: "Finalize score" }
               ].map((item, i) => (
                  <div key={i} className="flex flex-row md:flex-col items-center gap-6 md:gap-4 relative z-10 w-full md:w-auto">
                     <div className="w-20 h-20 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl font-bold text-primary group transition-transform hover:scale-110">
                        {item.step}
                     </div>
                     <div className="text-left md:text-center">
                        <div className="font-bold text-gray-900 dark:text-white text-lg md:text-base">{item.title}</div>
                        <div className="text-gray-500 text-sm font-medium">{item.desc}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. TARGET AUDIENCE */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24">
         <div className="text-center mb-16 relative">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
               Who is this for?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
               Built for real-world educators and organizations that need strict control without the IT headaches.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { title: "Colleges & Schools", desc: "Conduct mid-terms and finals cleanly without buying expensive campus-wide enterprise licenses.", icon: "🎓" },
             { title: "Coaching Centers", desc: "Train students with mock-tests that actually simulate the strict environment of real exams.", icon: "🏫" },
             { title: "Online Educators", desc: "Protect your premium certification courses from answer-sharing and impersonation.", icon: "💻" },
             { title: "Clubs & Competitions", desc: "Host coding challenges, quizzes, or hackathons with a guaranteed level playing field.", icon: "🏆" }
           ].map((audience, i) => (
             <div key={i} className="bg-white/50 dark:bg-gray-900/30 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors group relative">
               <div className="text-4xl mb-6 bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform origin-bottom-left">{audience.icon}</div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{audience.title}</h3>
               <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{audience.desc}</p>
             </div>
           ))}
         </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="w-full relative py-20 mb-10 text-center">
         <div className="absolute inset-0 top-1/2 -translate-y-1/2 bg-blue-600 h-[80%] -skew-y-2 -z-10" />
         
         <div className="max-w-4xl mx-auto px-6 bg-white dark:bg-black p-12 md:p-16 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative z-10 overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight relative z-10">Enterprise-level security without enterprise pricing.</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
               No setup. No complexity. Start conducting completely secure, monitored exams in under 2 minutes.
            </p>
            <a href="/auth/google" className="relative z-10">
              <Button className="h-16 px-10 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
                Join Exam
              </Button>
            </a>
            <a href="/auth/admin" className="relative z-10 ml-4">
              <Button variant="outline" className="h-16 px-10 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
                Create Exam
              </Button>
            </a>
            
            <div className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2 relative z-10">
               <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
               Free tier available forever.
            </div>

            <ArrowDoodle className="absolute bottom-4 right-4 w-32 h-32 text-blue-100 dark:text-blue-900/30 -scale-x-100 hidden md:block opacity-50 -z-0" />
            <CircleDoodle className="absolute top-4 left-4 w-24 h-24 text-blue-100 dark:text-blue-900/30 hidden md:block opacity-50 -z-0" />
         </div>
      </section>

    </main>
  );
}

