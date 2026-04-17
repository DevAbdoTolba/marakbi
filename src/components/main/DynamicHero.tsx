"use client";

import Image from "next/image";
import useDynamicHero from "@/hooks/useDynamicHero";
import { usePathname } from "next/navigation";

export default function DynamicHero() {
  const { title, description, background } = useDynamicHero();
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";

  return (
    <section className="relative z-10 w-full h-[380px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={background}
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className={`absolute inset-0 ${isContactPage ? 'bg-black/54' : 'bg-black/50'}`} />

      {/* Content */}
      <div className={`relative z-10 w-full ${isContactPage ? 'max-w-7xl' : 'max-w-6xl'} mx-auto ${isContactPage ? 'px-16 lg:px-20' : 'px-6'} flex flex-col md:flex-row items-center ${isContactPage ? 'justify-center' : 'justify-between'} gap-8 text-white`}>
        {/* Left Side - Title */}
        <div className={`${isContactPage ? 'text-left' : 'text-center md:text-left'} flex-1`}>
          <p className={`${isContactPage ? 'text-3xl sm:text-4xl lg:text-[36px]' : 'text-3xl sm:text-4xl lg:text-5xl'} font-poppins font-bold capitalize leading-tight whitespace-pre-line`}>
            {title}
          </p>
        </div>

        {/* Divider (visible only on medium and up) */}
        {isContactPage ? (
          <div className="hidden md:flex items-center justify-center shrink-0">
            <div className="w-px h-24 bg-white/70" />
          </div>
        ) : (
          <div className="hidden md:block w-px h-24 bg-white/70 shrink-0" />
        )}

        {/* Right Side - Description */}
        <div className={`flex-1 ${isContactPage ? 'max-w-[566px] text-left' : 'max-w-2xl text-center md:text-left'}`}>
          {isContactPage ? (
            <div className="text-white">
              <p className="text-base sm:text-lg font-poppins font-semibold capitalize mb-2 text-white">
                Your Nile Journeys, All in One Place
              </p>
              <p className="text-sm sm:text-base font-poppins font-normal leading-relaxed text-white">
                Relive your past adventures and get ready for the ones ahead — your bookings are here, waiting to set sail
              </p>
            </div>
          ) : (
            <p className="text-sm sm:text-base lg:text-lg font-light text-gray-100 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
