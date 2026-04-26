"use client";

import Logo from "@/components/Logo";
import LogoShape from "@/components/LogoShape";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function OurTeamPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const slides = [
    { id: 1, image: "/images/carousel1.webp" },
    { id: 2, image: "/images/carousel2.webp" },
    { id: 3, image: "/images/carousel3.webp" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next slide
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        // Swipe right - previous slide
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }

    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Welcome Section */}
      <div className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-4xl lg:text-5xl font-signpainter text-[#927C4E] mb-3">
            Welcome To DAFFA
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-black font-poppins">
            Know Us More
          </h2>
        </div>
      </div>

      {/* About DAFFA Section */}
      <div className="bg-[#093B77] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white">
              {/* Label */}
              <Link
                href="/about-us"
                className="inline-block border border-white text-white rounded-full px-6 py-2 mb-6 hover:bg-white hover:text-[#1A365D] transition-colors cursor-pointer"
              >
                <span className="font-medium">About DAFFA</span>
              </Link>

              {/* Main Title */}
              <h3 className="text-4xl lg:text-5xl font-bold text-[#BB9F64] font-poppins mb-5 leading-tight">
                Sail with the People Who Know Egypt&apos;s Waters
              </h3>

              {/* Description */}
              <p className="text-[#FAF7F1] text-xl font-poppins font-normal leading-9 mb-6 break-words">
                DAFFA is powered by a small, dedicated team of maritime
                professionals, travel experts and hospitality specialists. We
                combine local knowledge with modern booking tools to deliver
                seamless boat experiences — from private charters to group trips
                and water-sports adventures.
              </p>

              {/* Button */}
              <button className="bg-[#CEAF6E] text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#B8941F] transition-colors">
                Book Now
              </button>
            </div>

            {/* Right Column - Carousel */}
            <div className="relative">
              {/* Navigation Indicators */}
              <div className="flex mb-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`flex-1 h-0.5 mx-1 transition-colors duration-300 ${index === currentSlide ? "bg-amber-400" : "bg-white/60"
                      }`}
                  />
                ))}
              </div>

              {/* Carousel Images */}
              <div
                ref={carouselRef}
                className="relative overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {/* Slides Container */}
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide) => (
                    <div key={slide.id} className="w-full flex-shrink-0 relative h-96">
                      <Image
                        src={slide.image}
                        alt="DAFFA Team"
                        fill
                        className="object-cover rounded-lg select-none"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Goal Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-4xl lg:text-5xl font-signpainter text-[#927C4E] mb-4">
            DAFFA&apos;s Main Goal
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-black font-poppins break-words">
            DAFFA is dedicated to making{" "}
            <span className="block">boat trips easy for everyone.</span>
          </h2>
          <p className="text-2xl font-normal text-black font-poppins max-w-4xl mx-auto mt-10 leading-8 break-words">
            We believe that every person—whether you are booking your first boat
            or you&apos;re an{" "}
            <span className="block">
              experienced sailor—should have no trouble finding the perfect
              ride.
            </span>
          </p>
        </div>
      </div>

      {/* Why Choose DAFFA Section */}
      <div className="bg-white">
        {/* Full Width Image */}
        <div className="w-full relative h-[400px]">
          <Image
            src="/images/PLAY SLIDE.webp"
            alt="DAFFA App Interface"
            fill
            className="object-contain"
          />
        </div>

        {/* Core Values Section */}
        <div className="py-20 bg-white ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <p className="text-4xl lg:text-5xl font-signpainter text-[#927C4E] mb-4">
                Know the Reason
              </p>
              <h2 className="text-5xl lg:text-6xl font-bold text-black font-poppins">
                Why Choose DAFFA?
              </h2>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 mb-4 gap-4">
              {/* Trust And Safety First */}
              <div className="bg-[#093B77] px-4 py-2 pb-8 h-[440px] w-full">
                <div className="flex flex-col items-start relative">
                  <Logo
                    className="w-90 h-90 opacity-10 absolute top-0 left-0"
                    variant="white"
                  />
                  <Image
                    src="/icons/Shield.svg"
                    alt="Shield"
                    width={64}
                    height={64}
                    className="w-16 h-16 mb-4 mt-4"
                  />
                  <h3 className="text-4xl font-semibold text-[#D8BF8B] font-poppins mb-4 leading-tight capitalize break-words">
                    Trust And
                    <br />
                    Safety First
                  </h3>
                  <p className="text-white text-lg font-poppins leading-6">
                    Every Journey On The Water Begins With Trust. We Are
                    Uncompromising In Our Commitment To Safety, Meticulously
                    Vetting Every Boat And Captain In Our Fleet To Ensure You
                    Embark On Every Trip With Complete Peace Of Mind. Your
                    Well-Being Is Our Highest Priority.
                  </p>
                </div>
              </div>

              {/* Central Logo Section */}
              <div className="flex flex-col items-center justify-center text-center h-[440px] w-full">
                <div className="mb-4">
                  <LogoShape className="w-60 h-60 mx-auto" />
                  <h3 className="text-5xl font-bold bg-gradient-to-br from-[#106BD8] to-[#083872] bg-clip-text text-transparent font-poppins">
                    DAFFA
                  </h3>
                  <h4 className="text-[60px] font-bold text-black font-poppins mt-6 leading-[62px] break-words">
                    Core Values
                  </h4>
                </div>
              </div>

              {/* Authentic Connection */}
              <div className="bg-[#093B77] px-4 py-2 pb-8 h-[440px] w-full">
                <div className="flex flex-col items-start relative">
                  <Logo
                    className="w-90 h-90 opacity-10 absolute top-0 left-0"
                    variant="white"
                  />
                  <Image
                    src="/icons/character-3.svg"
                    alt="Character"
                    width={64}
                    height={64}
                    className="w-16 h-16 mb-4 mt-4"
                  />
                  <h3 className="text-4xl font-semibold text-[#D8BF8B] font-poppins mb-4 leading-tight capitalize break-words">
                    Authentic
                    <br />
                    Connection
                  </h3>
                  <p className="text-white text-lg font-poppins leading-6">
                    We Are &quot;Born On The Nile,&quot; And Our Passion Is
                    Sharing The True Essence Of Egypt&apos;s Waterways. We Value
                    Genuine Experiences, Local Knowledge, And Helping You
                    Connect With The Culture And History Of The Nile And The Red
                    Sea, Not Just The Water Itself.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Effortless Innovation */}
              <div className="bg-[#093B77] px-4 py-2 pb-8 h-[440px] w-full">
                <div className="flex flex-col items-start relative">
                  <Logo
                    className="w-90 h-90 opacity-10 absolute top-0 left-0"
                    variant="white"
                  />
                  <Image
                    src="/icons/bulb.svg"
                    alt="Bulb"
                    width={64}
                    height={64}
                    className="w-16 h-16 mb-4 mt-4"
                  />
                  <h3 className="text-4xl font-semibold text-[#D8BF8B] font-poppins mb-4 leading-tight capitalize break-words">
                    Effortless
                    <br />
                    Innovation
                  </h3>
                  <p className="text-white text-lg font-poppins leading-6">
                    We Believe Finding And Booking An Aquatic Adventure Should
                    Be Simple And Enjoyable. We Continuously Leverage
                    Technology—From AR Previews To Our AI Concierge—To Remove
                    Friction, Ensure Transparency, And Make The Process Of
                    Booking Your Dream Boat As Effortless As Possible.
                  </p>
                </div>
              </div>

              {/* Stewardship Of The Water */}
              <div className="bg-[#093B77] px-4 py-2 pb-8 h-[440px] w-full">
                <div className="flex flex-col items-start relative">
                  <Logo
                    className="w-90 h-90 opacity-10 absolute top-0 left-0"
                    variant="white"
                  />
                  <Image
                    src="/icons/water-scooter.svg"
                    alt="Water Scooter"
                    width={64}
                    height={64}
                    className="w-16 h-16 mb-4 mt-4"
                  />
                  <h3 className="text-4xl font-semibold text-[#D8BF8B] font-poppins mb-4 leading-tight capitalize break-words">
                    Stewardship Of
                    <br />
                    The Water
                  </h3>
                  <p className="text-white text-lg font-poppins leading-6">
                    Our Greatest Asset Is The Environment. We Are Committed To
                    Promoting Sustainable Practices Among Our Partners And
                    Users. We Actively Work To Protect The Pristine Beauty Of
                    The Nile And The Red Sea For Generations Of Travelers To
                    Come.
                  </p>
                </div>
              </div>

              {/* Curated Excellence */}
              <div className="bg-[#093B77] px-4 py-2 pb-8 h-[440px] w-full">
                <div className="flex flex-col items-start relative">
                  <Logo
                    className="w-90 h-90 opacity-10 absolute top-0 left-0"
                    variant="white"
                  />
                  <Image
                    src="/icons/yaght.svg"
                    alt="Yacht"
                    width={64}
                    height={64}
                    className="w-16 h-16 mb-4 mt-4"
                  />
                  <h3 className="text-4xl font-semibold text-[#D8BF8B] font-poppins mb-4 leading-tight capitalize break-words">
                    Curated
                    <br />
                    Excellence
                  </h3>
                  <p className="text-white text-lg font-poppins leading-6">
                    We Don&apos;t Settle For Average. We Hand-Pick A Diverse
                    Fleet—From Traditional Feluccas To Modern Yachts—And
                    Maintain High Standards Of Quality, Cleanliness, And
                    Service. We Ensure That Every Vessel And Every Trip Meets A
                    Benchmark Of Excellence For An Unforgettable Experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-4xl lg:text-5xl font-signpainter text-[#927C4E] mb-4">
              The Team
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold text-black font-poppins mb-6">
              Meet the Founder
            </h2>
            <p className="text-[27px] font-normal text-black font-poppins max-w-4xl mx-auto leading-[62px] break-words">
              Meet the passionate minds and dedicated hands behind DAFFA
            </p>
          </div>

          {/* Founder Card */}
          <div className="flex justify-center max-w-4xl mx-auto">
            {/* Ahmed Bastawi */}
            <div className="h-[450px] w-full max-w-md rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="relative bg-[#EFEFEF] h-80 overflow-hidden">
                <Image
                  src="/images/founder 2.webp"
                  alt="Ahmed Bastawi"
                  fill
                  className="object-contain"
                />
                <div className="absolute top-4 right-4"></div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#106BD8] font-poppins mb-2">
                    Ahmed Bastawi
                  </h3>
                  <p className="text-gray-600 font-poppins">Founder</p>
                </div>
                <div className="w-10 h-10 border border-[#106BD8] rounded-full flex items-center justify-center hover:bg-[#106BD8] transition-all duration-200 cursor-pointer group">
                  <svg
                    className="w-5 h-5 text-[#106BD8] group-hover:text-white transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
