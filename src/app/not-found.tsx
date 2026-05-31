"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FDFBF7]">
      {/* Solid header variant ensures high contrast and solid white menu background */}
      <Header variant="solid" />

      <main className="flex-grow flex items-center justify-center py-16 px-4 md:py-24 relative overflow-hidden">
        {/* Interactive CSS Animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
          }
          @keyframes wave-move-1 {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(-12px); }
          }
          @keyframes wave-move-2 {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(12px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-wave-slow {
            animation: wave-move-1 8s ease-in-out infinite;
          }
          .animate-wave-fast {
            animation: wave-move-2 5s ease-in-out infinite;
          }
        `}} />

        <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
          {/* Immersive Nautical Illustration with Floating DAFFA Logo */}
          <div className="relative w-60 h-60 mx-auto flex items-center justify-center">
            {/* Soft pulsing ocean gradient behind the logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 to-blue-200/40 rounded-full blur-3xl opacity-80 animate-pulse"></div>

            {/* Elegant floating Daffa Logo using plain colored asset */}
            <div className="absolute top-18 z-20 animate-float drop-shadow-2xl">
              <Image
                src="/images/logo_colored_plain.png"
                alt="DAFFA Logo"
                width={90}
                height={90}
                className="object-contain select-none"
              />
            </div>

            {/* Waves SVG underneath the logo */}
            <svg
              className="w-48 h-48 text-[#093B77] absolute inset-x-0 bottom-0 mx-auto z-10 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Waves */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2 17.5c2-1 4-1 6 0s4 1 6 0 4-1 6 0"
                className="animate-wave-slow text-[#106BD8]/70"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"
                className="animate-wave-fast text-[#CEAF6E]/70"
              />
            </svg>
          </div>

          <div className="space-y-4">
            {/* Premium Gold/Blue Gradient 404 Text */}
            <h1 className="text-8xl md:text-9xl font-extrabold font-poppins tracking-widest bg-gradient-to-r from-[#093B77] via-[#106BD8] to-[#CEAF6E] bg-clip-text text-transparent select-none drop-shadow-sm leading-none">
              404
            </h1>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-poppins tracking-tight mt-4">
              This page does not exist
            </h2>

            <p className="text-gray-500 text-base md:text-lg font-poppins max-w-xl mx-auto leading-relaxed px-4">
              It looks like you&apos;ve drifted off course. The page you are looking for might have been moved, deleted, or never existed.
            </p>
          </div>

          {/* Interactive Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 px-4">
            <Link
              href="/"
              className="w-full sm:w-auto bg-[#CEAF6E] hover:bg-[#B8941F] text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-center duration-200 cursor-pointer"
            >
              Return to Home
            </Link>

            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto border-2 border-[#093B77] text-[#093B77] hover:bg-blue-50/50 px-8 py-4 rounded-lg font-semibold text-base md:text-lg transition-all transform hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
